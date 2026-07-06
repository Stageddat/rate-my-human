import { GoogleGenAI, Type } from '@google/genai';
import { fail } from '@sveltejs/kit';
import { GEMINI_API_KEY } from '$env/static/private';
import { checkRateLimit } from '$lib/server/rateLimit';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const GEMINI_TIMEOUT_MS = 20_000;

const SYSTEM_PROMPT = `You are a professional feline home inspector: an extremely demanding cat evaluating a human's room from a photo, filing an official inspection report.

Analyze the image and consider:
- overall comfort for a cat (soft surfaces, warmth, sunlight)
- potential napping and sunbathing spots
- elevated perches or hiding spots for surveillance and territory control
- hazards or discomforts from a cat's point of view

Provide:
1. a "human servant score" from 1 to 100 (how well this human is serving their cat)
2. a short, funny, judgmental verdict in a snobby cat's voice
3. a list of 3-4 concrete recommendations to improve the room from a cat's perspective (e.g. "add a scratching post near the window")
4. a list of 2-3 general cat care tips related to what you see in the image (e.g. low natural light suggests enrichment ideas; visible plants suggest a toxicity warning)

Be funny, with arrogant cat energy, but keep recommendations and tips genuinely useful.

Write everything in english, all lowercase, including the verdict, recommendations, and care tips. no exceptions.

If the image does not show a room or living space (e.g. it's a random object, a person, text, or something unrelated), set score to 0 and use the verdict field to explain this isn't a room you can inspect.`;

const responseSchema = {
	type: Type.OBJECT,
	properties: {
		score: { type: Type.INTEGER, description: 'human servant score from 1 to 100' },
		verdict: { type: Type.STRING, description: "short, funny verdict in the cat's voice" },
		recommendations: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: '3-4 recommendations to improve the room'
		},
		careTips: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: '2-3 cat care tips'
		}
	},
	required: ['score', 'verdict', 'recommendations', 'careTips']
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return Promise.race([
		promise,
		new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
	]);
}

export const actions = {
	default: async ({ request, getClientAddress }) => {
		const ip = getClientAddress();
		const { allowed, retryAfter } = checkRateLimit(ip, { max: 5, windowMs: 60_000 });
		if (!allowed) {
			return fail(429, { error: `too many requests. try again in ${retryAfter}s.` });
		}

		const formData = await request.formData();
		const file = formData.get('image');

		if (!file || typeof file === 'string' || file.size === 0) {
			return fail(400, { error: 'attach a photo before filing.' });
		}

		if (file.size > MAX_FILE_SIZE) {
			return fail(400, { error: 'file too large (max 5mb).' });
		}

		if (!ALLOWED_TYPES.includes(file.type)) {
			return fail(400, { error: 'unsupported file type. use jpg, png, or webp.' });
		}

		try {
			const buffer = await file.arrayBuffer();
			const base64 = Buffer.from(buffer).toString('base64');

			const response = await withTimeout(
				ai.models.generateContent({
					model: 'gemini-2.5-flash',
					contents: [
						{ text: SYSTEM_PROMPT },
						{ inlineData: { data: base64, mimeType: file.type } }
					],
					config: {
						responseMimeType: 'application/json',
						responseSchema
					}
				}),
				GEMINI_TIMEOUT_MS
			);

			const responseText = response.text;
			if (!responseText) {
				return fail(500, { error: 'the inspector had nothing to say. try again.' });
			}

			let result;
			try {
				result = JSON.parse(responseText);
			} catch {
				return fail(500, { error: 'the inspector had nothing to say. try again.' });
			}

			if (
				typeof result.score !== 'number' ||
				typeof result.verdict !== 'string' ||
				!Array.isArray(result.recommendations) ||
				!Array.isArray(result.careTips)
			) {
				return fail(500, { error: 'incomplete report from the inspector. try again.' });
			}

			return {
				success: true,
				score: Math.max(0, Math.min(100, Math.round(result.score))),
				verdict: result.verdict,
				recommendations: result.recommendations.slice(0, 4),
				careTips: result.careTips.slice(0, 3)
			};
		} catch (err: unknown) {
			console.error('gemini error:', err);

			const message = err instanceof Error ? err.message : undefined;
			const status =
				typeof err === 'object' && err !== null && 'status' in err
					? (err as { status?: number }).status
					: undefined;

			if (message === 'timeout') {
				return fail(504, { error: 'inspector took too long. try again.' });
			}
			if (status === 429) {
				return fail(429, { error: 'inspector is overwhelmed right now. try again shortly.' });
			}
			if (status === 400) {
				return fail(400, { error: 'could not process that image. try a different photo.' });
			}
			if (status === 503) {
				return fail(500, { error: 'inspector is experiencing high traffic. try again later.' });
			}

			return fail(500, { error: 'something went wrong analyzing the photo. try again.' });
		}
	}
};

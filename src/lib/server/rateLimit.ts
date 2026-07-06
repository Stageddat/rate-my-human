type RateLimitOptions = {
	max?: number;
	windowMs?: number;
};

type RateLimitRecord = {
	count: number;
	start: number;
};

type RateLimitResult =
	| { allowed: true; retryAfter?: undefined }
	| { allowed: false; retryAfter: number };

const hits = new Map<string, RateLimitRecord>();

export function checkRateLimit(
	key: string,
	{ max = 3, windowMs = 60_000 }: RateLimitOptions = {}
): RateLimitResult {
	const now = Date.now();
	const record = hits.get(key);

	if (!record || now - record.start > windowMs) {
		hits.set(key, { count: 1, start: now });
		return { allowed: true };
	}

	if (record.count >= max) {
		return { allowed: false, retryAfter: Math.ceil((windowMs - (now - record.start)) / 1000) };
	}

	record.count++;
	return { allowed: true };
}

// clear map
setInterval(() => {
	const now = Date.now();
	for (const [key, record] of hits) {
		if (now - record.start > 5 * 60_000) hits.delete(key);
	}
}, 5 * 60_000);

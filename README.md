# Rate my human

> Built for the **#HACKTHEKITTY hackathon**

A very demanding feline inspector will evaluate the photos of your room and give you a score on how good a ~~slave~~ servant you are to conquer the world with his claws.

Upload a photo of any room and receive an inspection report including:
- **Human Servant Score (1–100)**: how well this human is serving their cat
- **Verdict**: a short, judgmental assessment in a snobby cat's voice
- **Recommendations**: concrete improvements from a cat's perspective
- **Care Tips**: genuine cat care advice based on what's visible in the image

## Showcase

**Live demo**: [ratemyhuman.stageddat.dev](https://ratemyhuman.stageddat.dev/)


## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/).
- **AI**: [Google Gemini](https://ai.google.dev/) for image analysis.
- **Runtime**: Node.js via `@sveltejs/adapter-node`.
- **Package Manager**: pnpm

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v9+)
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/Stageddat/rate-my-human.git
cd rate-my-human
```

### 2. Install dependencies

```sh
pnpm install
```

### 3. Set up environment variables

Copy the example env file and add your API key:

```sh
cp .env.example .env
```

Edit `.env` and set your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

You can get a free API key from [Google AI Studio](https://aistudio.google.com/apikey).

### 4. Start the development server

```sh
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Building for Production

```sh
pnpm build
```

This produces a Node.js server in the `build/` directory. Run it with:

```sh
node build
```

By default it listens on port 3000. Configure via the `PORT` environment variable.

## How It Works

1. User uploads a photo (JPG, PNG, or WebP, max 5 MB)
2. The server converts the image to base64 and sends it to Gemini 2.5 Flash with a system prompt that instructs the model to act as a feline home inspector
3. Gemini returns structured JSON with a score, verdict, recommendations, and care tips
4. The response is validated and displayed as an official inspection report

### Rate Limiting

Each IP is limited to **5 requests per minute** to prevent abuse. The limit is enforced server-side with an in-memory store.

## License

This project is open-source and available under the [GNU AGPLv3](./LICENSE.md).
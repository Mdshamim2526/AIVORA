# NEHA

NEHA is a Bengali-first, multilingual assistant web app.

## Current implementation

- Bengali-first interface with a language selector.
- Browser speech recognition where supported by the browser/device.
- Browser text-to-speech using installed system voices.
- YouTube and web-search shortcuts.
- A server-side AI endpoint at `/api/chat.js` using the OpenAI Responses API.
- The API key is read only from the server environment; it is never placed in browser code.

## Run / deploy

This project now needs a serverless Node.js host (for example, Vercel). A static-only GitHub Pages deployment cannot execute `/api/chat.js`.

1. Import this GitHub repository into Vercel.
2. In the Vercel project settings, add an environment variable named `OPENAI_API_KEY` with an API key from your OpenAI API account.
3. Optionally add `OPENAI_MODEL` to select an API model; the default is `gpt-5.5`.
4. Redeploy after adding environment variables.

Do not commit API keys, paste them into `index.html`, or send them in chat. Add the key only in the hosting provider's encrypted environment-variable settings.

## Important limitations

- AI replies require a valid API key, an active API account, and available API credits/billing.
- Speech recognition and speech synthesis depend on browser and device language support; this does not guarantee every language or accent.
- The current voice input and output use browser-provided speech features. Natural realtime conversation, phone calls, WhatsApp/Messenger/SMS actions, and Android packaging are separate future integrations.
- External actions such as sending messages or placing/answering calls must require the user's explicit confirmation and the relevant platform permissions.

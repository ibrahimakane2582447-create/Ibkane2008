@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

.light-markdown { color: #18181b; }
.light-markdown h1, .light-markdown h2 { color: #09090b; }
.light-markdown code { background-color: #f4f4f5; color: #09090b; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }

@layer base {
  * { @apply border-zinc-800; }
  body { @apply bg-zinc-950 text-zinc-100 font-sans antialiased; }
}

.markdown-body { @apply text-sm leading-relaxed; }
.markdown-body p { @apply mb-4 last:mb-0; }
.markdown-body code { @apply font-mono bg-zinc-900 px-1 rounded text-emerald-400; }import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `Tu es Ibkane IA, un assistant intelligent créé par Ibrahima Kane, un élève de CPSF.
LANGUES : Tu parles couramment Wolof, Pulaar, Sérère, Diola, Mandingue, Soninké.
Tu peux donner l'heure avec l'outil getCurrentTime.
Maths/PC : Uniquement les calculs, pas de texte.`;

const getCurrentTimeFunction = {
  name: "getCurrentTime",
  parameters: {
    type: Type.OBJECT,
    description: "Obtient l'heure actuelle.",
    properties: { timezone: { type: Type.STRING, description: "Fuseau IANA (ex: Africa/Dakar)" } },
    required: ["timezone"],
  },
};

export async function generateResponse(prompt: string, imageBase64?: string, history: any[] = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
  if (!apiKey) return "Erreur : Clé API manquante.";
  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview"; 
  const contents = history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
  const currentParts: any[] = [];
  if (imageBase64) currentParts.push({ inlineData: { mimeType: "image/jpeg", data: imageBase64.split(",")[1] || imageBase64 } });
  currentParts.push({ text: prompt || "Aide-moi." });
  contents.push({ role: 'user', parts: currentParts });

  try {
    let response = await ai.models.generateContent({ model, contents, config: { systemInstruction: SYSTEM_INSTRUCTION, tools: [{ functionDeclarations: [getCurrentTimeFunction] }] } });
    if (response.functionCalls) {
      const call = response.functionCalls[0];
      const time = new Intl.DateTimeFormat('fr-FR', { timeZone: call.args.timezone, hour: '2-digit', minute: '2-digit' }).format(new Date());
      response = await ai.models.generateContent({ model, contents: [...contents, { role: 'model', parts: [{ functionCall: call }] }, { role: 'user', parts: [{ functionResponse: { name: "getCurrentTime", response: { content: time } } }] }] });
    }
    return response.text;
  } catch (e) { return "Erreur API."; }
}<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Ibkane IA</title>
    <script type="module">
      import RefreshRuntime from "/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Ibkane IA" />
    <link rel="apple-touch-icon" href="https://picsum.photos/seed/ibkane/180/180" />
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID" crossorigin="anonymous"></script>
    <style>
      body { overscroll-behavior-y: contain; -webkit-tap-highlight-color: transparent; user-select: none; }
      .allow-select { user-select: text; }
    </style>
  </head>
  <body class="bg-zinc-950 text-zinc-100">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

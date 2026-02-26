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
.markdown-body code { @apply font-mono bg-zinc-900 px-1 rounded text-emerald-400; }

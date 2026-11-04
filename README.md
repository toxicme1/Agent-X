# Android Agent

No-auth AI agent for Android (React Native) with tool calling, permissions, and animated agent states.

## Features
- Chat with OpenRouter, Omniroute, Ollama, or any OpenAI-compatible API
- Tool calling: web, files, phone (dial/SMS), shell (with approval + allowlist)
- Animated agent character for thinking/running commands/using tools
- Per-tool approval modal with risk levels
- Settings persisted locally

## Setup
```bash
npm install
npx react-native run-android
```

## Config
Open Settings to set endpoint/model. For local: e.g. http://localhost:11434/v1/chat/completions with Ollama.

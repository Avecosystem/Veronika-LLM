export const models = [
  { id: 'provider-8/gpt-oss-20b', name: 'GPT OSS 20B', default: true },
  { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B (Free)', default: false },
  { id: 'meta-llama/llama-3-8b-instruct:free', name: 'Llama 3 8B (Free)', default: false },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', default: false }
];

export const defaultModel = 'provider-8/gpt-oss-20b';

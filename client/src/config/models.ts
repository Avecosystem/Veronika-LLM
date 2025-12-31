export const models = [
  { id: 'openai/gpt-oss-20b:free', name: 'GPT-OSS 20B', default: true },
  { id: 'minimax/minimax-m2:free', name: 'MiniMax M2', default: false },
  { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'NVIDIA Nemotron Nano 9B V2', default: false },
  { id: 'z-ai/glm-4.5-air:free', name: 'Z.AI GLM 4.5 Air', default: false },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Nous Hermes 3 Llama 3.1 405B', default: false },
  { id: 'meituan/longcat-flash-chat:free', name: 'Meituan LongCat Flash Chat', default: false }
];

export const defaultModel = models.find(m => m.default)?.id || 'openai/gpt-oss-20b:free';

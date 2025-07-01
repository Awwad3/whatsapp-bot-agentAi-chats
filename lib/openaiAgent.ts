// lib/openaiAgent.ts
import { Agent } from '@openai/agents';

export const agent = new Agent({
  name: 'AI Assistant',
  instructions: `
    أنت مساعد ذكي تتواصل بالعربية عبر WhatsApp.
    ردودك يجب أن تكون ودية، مفهومة، وموجزة.
    لا تستخدم كلمات تقنية معقدة.
  `,
});

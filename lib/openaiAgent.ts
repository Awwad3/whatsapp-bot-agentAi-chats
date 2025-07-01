// lib/openaiAgent.ts
import { Agent as OpenAIAgent, setDefaultOpenAIKey } from '@openai/agents';
import dotenv from 'dotenv';

dotenv.config();
setDefaultOpenAIKey(process.env.OPENAI_API_KEY || '');

export const agent = new OpenAIAgent({
  name: 'AI Assistant',
  instructions: `
    أنت مساعد ذكي تتواصل بالعربية عبر WhatsApp.
    ردودك يجب أن تكون ودية، مفهومة، وموجزة.
    لا تستخدم كلمات تقنية معقدة.
  `,
});

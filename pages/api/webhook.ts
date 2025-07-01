import type { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
// pages/api/webhook.ts

import { twiml as TwilioTwiml } from 'twilio';
import { agent } from '@/lib/openaiAgent';

export const config = {
  api: {
    bodyParser: false, // مهم لأن Twilio ترسل البيانات بصيغة x-www-form-urlencoded
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const buffers: Uint8Array[] = [];
  for await (const chunk of req) buffers.push(chunk);
  const data = Buffer.concat(buffers).toString();
  const params = new URLSearchParams(data);

  const userMessage = params.get('Body');
  const fromNumber = params.get('From');

  const messagingResponse = new TwilioTwiml.MessagingResponse();

  if (!userMessage || !fromNumber) {
    messagingResponse.message('عذرًا، لم أفهم الرسالة المرسلة.');
    res
      .status(200)
      .setHeader('Content-Type', 'text/xml')
      .send(messagingResponse.toString());
    return;
  }

  try {
    // تحليل الرسالة باستخدام OpenAI Agent
    const aiResponse = await agent.run(userMessage);
    const reply = aiResponse?.finalOutput || 'عذرًا، لم أتمكن من الرد الآن.';

    messagingResponse.message(reply);
  } catch (error) {
    console.error('AI Error:', error);
    messagingResponse.message('حدث خطأ أثناء معالجة الرسالة.');
  }

  res
    .status(200)
    .setHeader('Content-Type', 'text/xml')
    .send(messagingResponse.toString());
}

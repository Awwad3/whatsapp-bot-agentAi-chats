// pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
dotenv.config();

import { twiml as TwilioTwiml } from 'twilio';
import { agent } from '../../lib/openaiAgent';
import getRawBody from 'raw-body';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const params = new URLSearchParams(data);

    const userMessage = params.get('Body');
    const fromNumber = params.get('From');

    const messagingResponse = new TwilioTwiml.MessagingResponse();

    if (!userMessage || !fromNumber) {
      messagingResponse.message('عذرًا، لم أفهم الرسالة المرسلة.');
      res.status(200).setHeader('Content-Type', 'text/xml').send(messagingResponse.toString());
      return;
    }

    // تحليل الرسالة باستخدام OpenAI Agent
    const { finalOutput } = await import('@openai/agents').then(({ run }) => run(agent, userMessage));
    const reply = finalOutput || 'عذرًا، لم أتمكن من الرد الآن.';

    messagingResponse.message(reply);

    res.status(200).setHeader('Content-Type', 'text/xml').send(messagingResponse.toString());
  } catch (error) {
    console.error('Error processing message:', error);
    const messagingResponse = new TwilioTwiml.MessagingResponse();
    messagingResponse.message('حدث خطأ أثناء معالجة الرسالة.');
    res.status(500).setHeader('Content-Type', 'text/xml').send(messagingResponse.toString());
  }
}

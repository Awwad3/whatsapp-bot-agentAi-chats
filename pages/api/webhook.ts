// pages/api/webhook.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
dotenv.config();

import { twiml as TwilioTwiml } from 'twilio';
import getRawBody from 'raw-body';
import { run as runAgent } from '@openai/agents';
import { agent } from '../../lib/openaiAgent';

// تعطيل body parser لأن Twilio يرسل x-www-form-urlencoded
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // فقط POST مسموح
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // قراءة البيانات الخام
    const rawBody = await getRawBody(req);
    const data = rawBody.toString();
    const params = new URLSearchParams(data);

    // استخراج الرسالة والمرسل
    const message = params.get('Body')?.trim();
    const from = params.get('From')?.trim();

    const messagingResponse = new TwilioTwiml.MessagingResponse();

    // التحقق من صحة البيانات
    if (!message || !from) {
      messagingResponse.message('❌ لم يتم التعرف على الرسالة أو المرسل.');
      return res.status(200).setHeader('Content-Type', 'text/xml').send(messagingResponse.toString());
    }

    // ✅ تسجيل الرسالة للمتابعة (يمكن تخزينها لاحقًا في قاعدة بيانات)
    console.log(`📩 رسالة جديدة من: ${from}`);
    console.log(`💬 المحتوى: ${message}`);

    // تشغيل نموذج الذكاء الاصطناعي للرد
    let reply = 'عذرًا، لم أتمكن من معالجة الرسالة.';

    try {
      const { finalOutput } = await runAgent(agent, message);
      reply = finalOutput || reply;
    } catch (aiErr) {
      console.error('❗ فشل تحليل الرسالة عبر OpenAI:', aiErr);
      reply = 'حدث خطأ أثناء تحليل الرسالة باستخدام الذكاء الاصطناعي.';
    }

    // إرسال الرد
    messagingResponse.message(reply);
    return res.status(200).setHeader('Content-Type', 'text/xml').send(messagingResponse.toString());
  } catch (err) {
    console.error('❗ خطأ أثناء معالجة الطلب:', err);
    const messagingResponse = new TwilioTwiml.MessagingResponse();
    messagingResponse.message('حدث خطأ داخلي أثناء معالجة الرسالة.');
    return res.status(500).setHeader('Content-Type', 'text/xml').send(messagingResponse.toString());
  }
}

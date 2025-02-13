import { ReactElement } from 'react';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

import { env } from '@/env';

interface SendEmailParams {
  to: string;
  subject: string;
  template: ReactElement<unknown>;
}

export const sendEmail = async (data: SendEmailParams) => {
  if (process.env.NODE_ENV === 'development') {
    const transporter = nodemailer.createTransport(env.NODEMAILER_SMTP_URL);
    const emailHtml = await render(data.template);

    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to: data.to,
      subject: data.subject,
      html: emailHtml,
    });

    return;
  }

  const mailer = new Resend(env.RESEND_API_KEY);

  await mailer.emails.send({
    from: env.EMAIL_FROM,
    to: data.to,
    subject: data.subject,
    react: data.template,
  });
};

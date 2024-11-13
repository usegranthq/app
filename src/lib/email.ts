import { render } from '@react-email/components';
import { ReactElement } from 'react';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env } from '@/env';

interface SendEmailParams {
  to: string;
  subject: string;
  template: ReactElement;
}

export const sendEmail = async (data: SendEmailParams) => {
  const emailHtml = await render(data.template);

  if (env.NODE_ENV === 'development') {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_SERVER_HOST,
      port: parseInt(env.EMAIL_SERVER_PORT),
      auth: {
        user: env.EMAIL_SERVER_USER,
        pass: env.EMAIL_SERVER_PASSWORD,
      },
    });

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
    html: emailHtml,
  });
};

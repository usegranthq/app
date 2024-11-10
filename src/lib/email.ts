import { render } from '@react-email/components';
import { ReactElement } from 'react';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  template: ReactElement;
}

export const sendEmail = async (data: SendEmailParams) => {
  const emailHtml = await render(data.template);

  if (process.env.NODE_ENV === 'development') {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST as string,
      port: parseInt(process.env.EMAIL_SERVER_PORT as string),
      auth: {
        user: process.env.EMAIL_SERVER_USER as string,
        pass: process.env.EMAIL_SERVER_PASSWORD as string,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM as string,
      to: data.to,
      subject: data.subject,
      html: emailHtml,
    });

    return;
  }

  const mailer = new Resend(process.env.RESEND_API_KEY);

  await mailer.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: data.to,
    subject: data.subject,
    html: emailHtml,
  });
};

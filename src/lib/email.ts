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
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'elise.koelpin@ethereal.email',
        pass: 'MFn4qtSF8npk5ueZSX',
      },
    });

    await transporter.sendMail({
      from: 'Usergrant <onboarding@resend.dev>',
      to: data.to,
      subject: data.subject,
      html: emailHtml,
    });

    return;
  }

  const mailer = new Resend(process.env.RESEND_API_KEY);

  await mailer.emails.send({
    from: 'Usergrant <onboarding@resend.dev>',
    to: data.to,
    subject: data.subject,
    html: emailHtml,
  });
};

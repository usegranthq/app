import nodemailer from 'nodemailer';
import { ReactNode } from 'react';
import { render } from 'react-email';
import { Resend } from 'resend';

import env from '@/env';
import ChangeEmailVerification from '@/templates/ChangeEmailVerification';
import LoginEmail from '@/templates/LoginEmail';
import VerifyEmail from '@/templates/VerifyEmail';

interface SendEmailParams {
  to: string;
  subject: string;
  template: ReactNode;
}

const sendEmail = async (data: SendEmailParams) => {
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

interface SendLoginEmailParams {
  email: string;
  token: string;
  url: string;
}

interface SendEmailVerificationParams {
  email: string;
  token: string;
  url: string;
}

interface SendChangeEmailVerificationParams {
  email: string;
  token: string;
  url: string;
  newEmail: string;
}

export const sendLoginEmail = async (data: SendLoginEmailParams) => {
  await sendEmail({
    to: data.email,
    subject: 'Login to UseGrant',
    template: LoginEmail({ token: data.token, url: data.url }),
  });
};

export const sendEmailVerification = async (data: SendEmailVerificationParams) => {
  await sendEmail({
    to: data.email,
    subject: 'Verify your email address',
    template: VerifyEmail({ token: data.token, url: data.url }),
  });
};

export const sendChangeEmailConfirmation = async (data: SendChangeEmailVerificationParams) => {
  await sendEmail({
    to: data.email,
    subject: 'Verify your email address',
    template: ChangeEmailVerification({
      token: data.token,
      url: data.url,
      newEmail: data.newEmail,
    }),
  });
};

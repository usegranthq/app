import { BookLock, CheckCircleIcon, LockIcon, ShieldIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: ShieldIcon,
    title: 'Secure by Design',
    description:
      'Our authentication is built on OAuth 2.0 standards. Your services maintain full control by verifying all credentials directly, ensuring maximum security.',
    bullets: ['Automatic key rotation', 'OAuth 2.0 standards'],
  },
  {
    icon: LockIcon,
    title: 'Minimal Data Exposure',
    description:
      'UseGrant only stores the essential: your signup email. We have no knowledge of your services or intended usage patterns, ensuring maximum privacy.',
    bullets: ['Limited data storage', 'Privacy-first approach'],
  },
  {
    icon: BookLock,
    title: 'No Lock-in',
    description:
      'No lock-in. We do not store any data about your services or intended usage pattern. Use the apis to request client data any time.',
    bullets: ['Minimized attack surface', 'No persistent signing keys'],
  },
];

export default function ZeroTrustSection() {
  return (
    <section className="mt-28 w-full md:mt-44">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Zero Trust</h2>
            <p className="mx-auto text-muted-foreground">Secure, private, and built for modern applications</p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 pt-10 md:pt-20 lg:grid-cols-3 lg:gap-12">
          {features.map((feature, index) => (
            <Card className="relative overflow-hidden" key={`feature-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <feature.icon className="size-5 text-primary" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                <ul className="mt-6 space-y-2">
                  {feature.bullets.map((bullet, index) => (
                    <li className="flex items-center" key={`bullet-${index}`}>
                      <CheckCircleIcon className="mr-2 h-4 w-4 text-primary" />
                      <span className="text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <p className="max-w-xl text-center text-sm text-muted-foreground">
            Experience the next level of authentication security. With UseGrant&apos;s Zero Trust approach, you&apos;re
            embracing a security philosophy that puts your data and privacy first.
          </p>
        </div>
      </div>
    </section>
  );
}

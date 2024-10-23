import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mt-20">
        <h1 className="text-center text-5xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-center text-sm font-medium text-muted-foreground">Last updated: 23 October 2024</p>
        <div className="my-20 tracking-wide">
          <p>
            The terms, "UseGrant", "useGrant", "usegrant", "usegrant.dev", "We", "Us", or "Our" refers to usegrant.dev,
            and the terms “You” and “Your” refers to the licensed users of usegrant.dev.
          </p>
          <div className="mt-14 flex flex-col gap-14">
            <div>
              <h2 className="text-2xl font-bold">Acceptance of Terms</h2>
              <p className="mt-2">
                Welcome to usegrant. By signing up, browsing this website, and using our service, you are agreeing to
                comply with and be bound by the following terms and conditions of use, which together with our privacy
                policy govern our relationship with you in relation to this service. If you disagree with any part of
                these terms and conditions, please do not use our service.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Privacy and Data Security</h2>
              <p className="mt-2">
                We are dedicated to safeguarding your privacy and ensuring the security of your data. UseGrant will not
                access any of your data without your explicit consent. The data you provide, submit, or that is
                collected by UseGrant from you will be stored and processed in accordance with UseGrant's online privacy
                policy, which can be accessed at{' '}
                <Link href="/privacy" className="underline underline-offset-2">
                  usegrant.dev/privacy
                </Link>
                .
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Payment Processing</h2>
              <p className="mt-2">
                Our order process is facilitated by our online reseller,{' '}
                <Link href="https://paddle.com" target="_blank" className="underline underline-offset-2">
                  Paddle.com
                </Link>
                . Paddle serves as the Merchant of Record for all our transactions, offering customer support and
                managing returns.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Refund Policy</h2>
              <p className="mt-2">
                We offer refunds only in cases where there is a technical issue with the product that we are unable to
                resolve. Since a free version of UseGrant is available, we strongly encourage you to thoroughly test it
                before making a purchase.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Modifications</h2>
              <p className="mt-2">
                UseGrant reserves the right to revise these terms of service at any time without prior notice. By
                continuing to use this website, you agree to be bound by the most current version of these terms of
                service.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Termination</h2>
              <p className="mt-2">
                UseGrant reserves the right to terminate your access to the service without prior notice if you breach
                these terms of service or if required by law.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Limitation of Liability</h2>
              <p className="mt-2">
                UseGrant will not be liable for any damages arising from the use of or inability to use the service,
                including but not limited to direct, indirect, incidental, punitive, and consequential damages. This
                limitation of liability applies to all claims, whether based on warranty, contract, tort, or any other
                legal theory, and whether or not UseGrant has been informed of the possibility of such damages.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Miscellaneous</h2>
              <p className="mt-2">
                This agreement does not confer any benefit, right, or remedy to any person other than the parties
                involved. Neither party may assign or transfer its rights or obligations under this agreement without
                the prior written consent of the other party, which shall not be unreasonably withheld.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Contact Us</h2>
              <p className="mt-2">
                If you have any questions about these terms and conditions, please contact us at{' '}
                <a href="mailto:support@usegrant.dev">support@usegrant.dev</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

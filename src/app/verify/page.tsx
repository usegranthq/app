import VerifyForm from './VerifyForm';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-center">Verification</h1>
        <p className="mb-10 text-center text-sm mt-2">
          We have sent you a verification code to{' '}
          <span className="text-muted-foreground font-medium">contact@example.com</span>. Enter it below
        </p>
        <VerifyForm />
      </div>
    </div>
  );
}

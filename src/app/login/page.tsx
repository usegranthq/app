import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';
import LoginForm from './LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Card className="w-full p-5 max-w-sm space-y-4 rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Hey there <span>👋</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <SiGithub className="mr-2 size-4" />
              Github
            </Button>
            <Button variant="outline">
              <SiGoogle className="mr-2 size-4" />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <LoginForm />
        </CardContent>
        <CardFooter className="text-xs text-center">
          <p>
            By continuing, you agree to our{' '}
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { SiGithub, SiGoogle } from '@icons-pack/react-simple-icons';

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Card className="w-full p-5 max-w-sm space-y-4 rounded-xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">ugeGrant login</CardTitle>
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
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" required placeholder="user@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex text-xs">
              <div className="ml-auto">
                <Link href="/forgot-password" className="font-medium hover:underline underline-offset-2">
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-sm justify-center">
          <Link href="/register" className="font-medium">
            Don&apos;t have an account? <span className="hover:underline">Sign up</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

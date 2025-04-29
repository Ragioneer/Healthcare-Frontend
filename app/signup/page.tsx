import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Your Account</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          Sign up using your email or one of the providers below.
        </p>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full">Sign Up</Button>
          <div className="flex flex-col gap-2 mt-4">
            <Button variant="outline" className="w-full">Sign up with Google</Button>
            <Button variant="outline" className="w-full">Sign up with LinkedIn</Button>
            <Button variant="outline" className="w-full">Sign up with GitHub</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

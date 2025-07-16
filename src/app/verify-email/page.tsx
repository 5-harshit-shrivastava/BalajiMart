
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';

function VerifyEmailPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
            <MailCheck className="h-10 w-10" />
          </div>
          <CardTitle className="mt-4">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to <span className="font-semibold text-primary">{user?.email}</span>. Please check your inbox (and spam folder) to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After verifying, you may need to log in again. You can close this tab after you've clicked the link.
          </p>
          <Button onClick={logout} variant="outline">
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmailPage;

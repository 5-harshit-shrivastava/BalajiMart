
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function VerifyEmailPage() {
  const { user, logout, resendVerificationEmail, loading: authLoading, error } = useAuth();
  
  const handleResend = async () => {
      await resendVerificationEmail();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg text-center">
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
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          <p className="text-sm text-muted-foreground">
            After verifying, you may need to log in again. You can close this tab after you've clicked the link.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={logout} variant="outline" disabled={authLoading}>
                Back to Login
            </Button>
            <Button onClick={handleResend} disabled={authLoading}>
                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Resend Verification Email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VerifyEmailPage;

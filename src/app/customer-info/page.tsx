
"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { updateCustomerInfo } from '@/services/authService';
import withAuth from '@/hoc/withAuth';

function CustomerInfoPage() {
  const { user, loading, error, setError, refreshUser } = useAuth();
  const router = useRouter();
  
  const [isFromKota, setIsFromKota] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
        if (user.infoComplete) {
            router.replace('/');
        }
        setIsFromKota(user.isFromKota?.toString());
        setAddress(user.address || '');
        setPhone(user.phone || '');
    }
  }, [user, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
        setError("You must be logged in.");
        return;
    }
    if (!isFromKota) {
        setError("Please specify if you are from Kota.");
        return;
    }

    setFormLoading(true);
    try {
        await updateCustomerInfo(user.uid, {
            isFromKota: isFromKota === 'true',
            address,
            phone,
            infoComplete: true,
        });
        await refreshUser(); // Refresh user data in context
        router.push('/');
    } catch (err) {
        console.error(err);
        setError("Failed to update information. Please try again.");
    } finally {
        setFormLoading(false);
    }
  };

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>Please provide a few details so we can serve you better.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Are you from Kota?</Label>
              <p className="text-sm text-muted-foreground">This helps us determine delivery feasibility.</p>
              <RadioGroup value={isFromKota} onValueChange={setIsFromKota} className="flex gap-4 pt-2" disabled={formLoading}>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="kota-yes" />
                      <Label htmlFor="kota-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="kota-no" />
                      <Label htmlFor="kota-no">No</Label>
                  </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                disabled={formLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your contact number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={formLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={formLoading}>
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save and Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default withAuth(CustomerInfoPage, ['customer']);

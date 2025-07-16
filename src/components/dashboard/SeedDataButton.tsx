
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedProducts } from "@/services/seedService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Database } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SeedDataButton() {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSeed = async () => {
        setLoading(true);
        try {
            await seedProducts();
            toast({
                title: "Success!",
                description: "Dummy product data has been added to your database.",
            });
            // You might want to refresh the page to see the new data
            window.location.reload();
        } catch (error) {
            console.error("Failed to seed data:", error);
            toast({
                title: "Error",
                description: "Could not add dummy data. Check the console for details.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
       <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Seed Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to add dummy data?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will add a predefined list of sample products to your Firestore 'products' collection. It's intended for initial setup and testing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSeed} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Proceed
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    );
}

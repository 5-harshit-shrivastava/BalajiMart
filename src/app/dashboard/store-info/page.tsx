
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";

export default function StoreInfoPage() {
  const storeAddress = "Arjun Gali, Rangpur Rd, Railway Station Area, Kota, Rajasthan 324002 near mishra optician";
  const storePhone = "9588203452";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Information</h1>
        <p className="text-muted-foreground">Details about your physical store location and contact.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Balaji Mart</CardTitle>
          <CardDescription>Your store's contact and location details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <MapPin className="h-5 w-5 mt-1 text-primary" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-muted-foreground">{storeAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold">Phone Number</h3>
              <p className="text-muted-foreground">{storePhone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

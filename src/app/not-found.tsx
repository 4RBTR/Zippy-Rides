import Link from "next/link";
import { Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Car className="h-10 w-10" />
          <span className="text-2xl font-bold">Zippy Rides</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <p className="text-xl text-muted-foreground">
            Oops! This road doesn&apos;t exist.
          </p>
        </div>
        <Link
          href="/garage"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Back to Garage
        </Link>
      </div>
    </div>
  );
}

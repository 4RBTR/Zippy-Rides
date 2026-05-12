import { Car } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary via-primary/80 to-primary/60 items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="relative z-10 text-center space-y-6 px-12">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Zippy Rides
          </h1>
          <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
            Your all-in-one vehicle maintenance tracker. Keep your rides in
            top shape with smart part tracking, expense analytics, and
            timely reminders.
          </p>
          <div className="flex items-center justify-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Smart</div>
              <div className="text-sm text-white/60">Part Tracking</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Easy</div>
              <div className="text-sm text-white/60">Service Logs</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Clear</div>
              <div className="text-sm text-white/60">Analytics</div>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-white/5" />
      </div>
      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

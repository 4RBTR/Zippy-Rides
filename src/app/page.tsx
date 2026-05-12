import Link from "next/link";
import {
  Car,
  Wrench,
  BarChart3,
  Shield,
  Calendar,
  Gauge,
  ChevronRight,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  // If user is already logged in, redirect to garage
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/garage");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Gauge className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Zippy Rides
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" render={<Link href="/login" />}>
              Sign In
            </Button>
            <Button render={<Link href="/signup" />}>
              Get Started
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />

        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-3.5 w-3.5" />
              Smart Vehicle Maintenance
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Keep Your Rides in{" "}
              <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Top Shape
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Track maintenance schedules, spare parts, service costs, and tax
              renewals for all your vehicles — motorcycles and cars — in one
              beautiful dashboard.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base" render={<Link href="/signup" />}>
                Start Tracking Free
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
                render={<Link href="/login" />}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              From oil changes to tax renewals, Zippy Rides tracks it all with
              smart alerts and beautiful analytics.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Car,
                title: "Multi-Vehicle Garage",
                description:
                  "Manage motorcycles and cars side-by-side. Each vehicle gets its own dashboard with mileage, parts, and documents.",
                color: "bg-blue-500/10 text-blue-500",
              },
              {
                icon: Wrench,
                title: "Smart Part Tracking",
                description:
                  "Define replacement intervals for every part. The system calculates remaining lifespan and alerts you before parts are overdue.",
                color: "bg-emerald-500/10 text-emerald-500",
              },
              {
                icon: BarChart3,
                title: "Expense Analytics",
                description:
                  "See where your money goes with per-vehicle expense breakdowns, monthly trends, and all-time cost summaries.",
                color: "bg-violet-500/10 text-violet-500",
              },
              {
                icon: Calendar,
                title: "Tax & Registration",
                description:
                  "Track annual tax and 5-year registration dates with countdown badges. Never miss a renewal again.",
                color: "bg-amber-500/10 text-amber-500",
              },
              {
                icon: Shield,
                title: "Service Journal",
                description:
                  "Log symptoms, modifications, and notes. Attach receipt photos for every service to build a complete history.",
                color: "bg-rose-500/10 text-rose-500",
              },
              {
                icon: Gauge,
                title: "Mileage Dashboard",
                description:
                  "Update odometer readings with one click. Part lifespans update dynamically based on current mileage.",
                color: "bg-teal-500/10 text-teal-500",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-background p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <div
                  className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Add Your Vehicles",
                description:
                  "Register your motorcycle or car with its current mileage and tax dates.",
              },
              {
                step: "02",
                title: "Set Part Intervals",
                description:
                  "Define which parts need replacing and their intervals (e.g., oil every 3,000 km).",
              },
              {
                step: "03",
                title: "Log & Track",
                description:
                  "Log every service with costs and receipts. Watch your analytics grow over time.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-linear-to-br from-primary/5 via-transparent to-primary/5 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Track Smarter?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join now and never miss a service or tax deadline again.
          </p>
          <div className="mt-8">
            <Button size="lg" className="h-12 px-10 text-base" render={<Link href="/signup" />}>
              Get Started — It&apos;s Free
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>Zippy Rides</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Zippy Rides. Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}

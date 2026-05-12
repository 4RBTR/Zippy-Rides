import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions/auth";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { BarChart3 } from "lucide-react";
import { ExpenseChart } from "@/components/analytics/expense-chart";
import { StatsCards } from "@/components/analytics/stats-cards";

export const metadata = {
  title: "Analytics — Zippy Rides",
  description: "View expense analytics across all your vehicles.",
};

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Fetch all vehicles with their replacement costs
  const vehicles = await prisma.vehicle.findMany({
    where: { userId: user.id },
    include: {
      partIntervals: {
        include: {
          replacements: {
            orderBy: { replacedAt: "asc" },
          },
        },
      },
    },
  });

  // Calculate monthly expenses for the last 12 months
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(now, 11 - i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, "MMM yyyy"),
      shortLabel: format(date, "MMM"),
    };
  });

  // Build chart data
  const chartData = months.map((month) => {
    const entry: Record<string, string | number> = { month: month.shortLabel };
    let monthTotal = 0;

    vehicles.forEach((vehicle) => {
      let vehicleCost = 0;
      vehicle.partIntervals.forEach((pi) => {
        pi.replacements.forEach((rep) => {
          const repDate = new Date(rep.replacedAt);
          if (repDate >= month.start && repDate <= month.end) {
            vehicleCost += rep.cost;
          }
        });
      });
      entry[vehicle.name] = vehicleCost;
      monthTotal += vehicleCost;
    });

    entry.total = monthTotal;
    return entry;
  });

  // Calculate aggregate stats
  const allReplacements = vehicles.flatMap((v) =>
    v.partIntervals.flatMap((pi) => pi.replacements)
  );
  const totalSpent = allReplacements.reduce((sum, r) => sum + r.cost, 0);
  const totalServices = allReplacements.length;

  // Most expensive vehicle
  const vehicleCosts = vehicles.map((v) => ({
    name: v.name,
    cost: v.partIntervals
      .flatMap((pi) => pi.replacements)
      .reduce((sum, r) => sum + r.cost, 0),
  }));
  const mostExpensive = vehicleCosts.sort((a, b) => b.cost - a.cost)[0];

  // Average monthly cost (last 12 months)
  const avgMonthlyCost = totalSpent / 12;

  const vehicleNames = vehicles.map((v) => v.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Expense breakdown across all vehicles
        </p>
      </div>

      <StatsCards
        totalSpent={totalSpent}
        totalServices={totalServices}
        avgMonthlyCost={avgMonthlyCost}
        mostExpensiveVehicle={mostExpensive?.name || "-"}
        mostExpensiveCost={mostExpensive?.cost || 0}
      />

      {vehicles.length > 0 && allReplacements.length > 0 ? (
        <ExpenseChart
          data={chartData}
          vehicleNames={vehicleNames}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No service data yet. Log some services to see analytics.
          </p>
        </div>
      )}
    </div>
  );
}

import {
  DollarSign,
  Wrench,
  TrendingUp,
  Car,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalSpent: number;
  totalServices: number;
  avgMonthlyCost: number;
  mostExpensiveVehicle: string;
  mostExpensiveCost: number;
}

export function StatsCards({
  totalSpent,
  totalServices,
  avgMonthlyCost,
  mostExpensiveVehicle,
  mostExpensiveCost,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Spent",
      value: `Rp ${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      description: "All-time maintenance cost",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Total Services",
      value: totalServices.toString(),
      icon: Wrench,
      description: "Parts replaced",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Avg. Monthly",
      value: `Rp ${Math.round(avgMonthlyCost).toLocaleString()}`,
      icon: TrendingUp,
      description: "Over last 12 months",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      title: "Most Expensive",
      value: mostExpensiveVehicle,
      icon: Car,
      description:
        mostExpensiveCost > 0
          ? `Rp ${mostExpensiveCost.toLocaleString()} total`
          : "No data",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

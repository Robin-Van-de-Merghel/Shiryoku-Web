/**
 * Reusable stat card component for displaying KPIs
 * 
 * Used in dashboards to show high-level metrics with
 * optional trend indicators.
 */

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  /** Card title/label */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Icon or element to display */
  icon: ReactNode;
  /** Optional trend indicator */
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p
                className={`text-xs mt-2 ${
                  trend.direction === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
              </p>
            )}
          </div>
          <div className="text-gray-400 text-2xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

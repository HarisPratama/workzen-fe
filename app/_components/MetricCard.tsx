import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, iconColor, trend }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${iconColor}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <span className="text-sm font-semibold text-green-600 mb-1">
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

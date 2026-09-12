import React, { type ReactNode } from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  badge?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-blue-50 dark:bg-blue-950/40',
  iconTextColor = 'text-blue-600 dark:text-blue-400',
  badge,
  trend,
}) => {
  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div
          className={`p-3 rounded-xl flex items-center justify-center ${iconBgColor} ${iconTextColor}`}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        {subtitle && <span>{subtitle}</span>}
        {badge}
        {trend && (
          <span
            className={`font-medium flex items-center gap-1 ${
              trend.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  );
};

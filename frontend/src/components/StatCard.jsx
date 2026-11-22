import React from 'react';

export default function StatCard({ title, value, icon: Icon, change, trend = 'up', color = 'purple' }) {
  const colorMap = {
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-[#6C63FF]/10 text-[#6C63FF]',
      border: 'border-purple-100',
    },
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-[#3B82F6]/10 text-[#3B82F6]',
      border: 'border-blue-100',
    },
    navy: {
      bg: 'bg-slate-50',
      iconBg: 'bg-[#14213D]/10 text-[#14213D]',
      border: 'border-slate-200',
    },
    emerald: {
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-500/10 text-amber-600',
      border: 'border-amber-100',
    },
  };

  const scheme = colorMap[color] || colorMap.purple;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#14213D]">{value}</h3>
          {change !== undefined && (
            <p className="mt-2 text-xs font-medium flex items-center gap-1">
              <span className={trend === 'up' ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                {trend === 'up' ? '↑' : '↓'} {change}
              </span>
              <span className="text-slate-400">vs last month</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-xl ${scheme.iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}

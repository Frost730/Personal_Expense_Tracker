import React from 'react';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'solid' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  variant = 'subtle',
  size = 'sm',
  icon,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  
  if (color && variant === 'subtle') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses}`}
        style={{
          backgroundColor: `${color}18`, // ~10% opacity
          color: color,
          borderColor: `${color}40`,
          borderWidth: '1px',
        }}
      >
        {icon}
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${sizeClasses}`}
    >
      {icon}
      {label}
    </span>
  );
};

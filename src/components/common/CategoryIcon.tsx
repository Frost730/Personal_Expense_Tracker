import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Home,
  GraduationCap,
  HeartPulse,
  Plane,
  CreditCard,
  User,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  PiggyBank,
  Gift,
  CircleDollarSign,
  type LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

const iconMap: Record<string, React.FC<LucideProps>> = {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Home,
  GraduationCap,
  HeartPulse,
  Plane,
  CreditCard,
  User,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  PiggyBank,
  Gift,
  CircleDollarSign,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || CircleDollarSign;
  return <IconComponent {...props} />;
};

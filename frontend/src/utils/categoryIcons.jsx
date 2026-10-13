import React from 'react';
import {
  Home,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Film,
  Activity,
  Package,
  BookOpen,
  Briefcase,
  Laptop,
  TrendingUp,
  DollarSign,
  Tag,
  Coffee,
  Heart,
  Shield,
  Plane,
  Gift,
  Smile,
  HelpCircle
} from 'lucide-react';

export const AVAILABLE_ICONS = [
  { name: 'Home', icon: Home, label: 'Housing' },
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Groceries' },
  { name: 'Utensils', icon: Utensils, label: 'Dining' },
  { name: 'Car', icon: Car, label: 'Transport' },
  { name: 'Zap', icon: Zap, label: 'Utilities' },
  { name: 'Film', icon: Film, label: 'Entertainment' },
  { name: 'Activity', icon: Activity, label: 'Health' },
  { name: 'Package', icon: Package, label: 'Shopping' },
  { name: 'BookOpen', icon: BookOpen, label: 'Education' },
  { name: 'Briefcase', icon: Briefcase, label: 'Work/Salary' },
  { name: 'Laptop', icon: Laptop, label: 'Tech/Freelance' },
  { name: 'TrendingUp', icon: TrendingUp, label: 'Investments' },
  { name: 'DollarSign', icon: DollarSign, label: 'Money/Income' },
  { name: 'Coffee', icon: Coffee, label: 'Coffee/Café' },
  { name: 'Plane', icon: Plane, label: 'Travel' },
  { name: 'Gift', icon: Gift, label: 'Gifts' },
  { name: 'Heart', icon: Heart, label: 'Personal' },
  { name: 'Tag', icon: Tag, label: 'General' },
];

const iconMap = {
  Home,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Film,
  Activity,
  Package,
  BookOpen,
  Briefcase,
  Laptop,
  TrendingUp,
  DollarSign,
  Tag,
  Coffee,
  Plane,
  Gift,
  Heart,
  Smile,
  Shield
};

export const CategoryIcon = ({ name, className = 'w-4 h-4' }) => {
  const IconComponent = iconMap[name] || Tag;
  return <IconComponent className={className} />;
};

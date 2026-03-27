import { type HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`font-sans rounded-lg bg-[#f8f8f8] p-6 shadow-md text-otto-burgundy ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: string;
  icon: React.ReactNode;
}

export function CardHeader({ title, icon }: CardHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="text-otto-burgundy">{icon}</span>
      <h2 className="font-sans text-xl font-semibold text-otto-burgundy">{title}</h2>
    </div>
  );
}

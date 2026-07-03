import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = true, className = "", ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`glass rounded-2xl p-6 ${hover ? "card-hover" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

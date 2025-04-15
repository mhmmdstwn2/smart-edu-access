
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  linkTo: string;
  className?: string;
  color?: "primary" | "secondary" | "success";
}

export function RoleCard({
  title,
  description,
  icon,
  linkTo,
  className,
  color = "primary",
}: RoleCardProps) {
  const colorClasses = {
    primary: "bg-primary-light border-primary hover:border-primary",
    secondary: "bg-secondary-light border-secondary hover:border-secondary",
    success: "bg-success-light border-success hover:border-success",
  };

  return (
    <Link to={linkTo}>
      <div
        className={cn(
          "p-6 rounded-xl border-2 transition-all card-hover",
          colorClasses[color],
          className
        )}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-4xl">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

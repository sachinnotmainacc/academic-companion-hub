
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
  style?: React.CSSProperties; // Add style prop to the interface
}

const FeatureCard = ({ title, description, icon: Icon, href, className, style }: FeatureCardProps) => {
  return (
    <Link 
      to={href}
      className={cn(
        "glass-card rounded-xl p-6 card-hover flex flex-col items-center text-center transition-all",
        className
      )}
      style={style} // Apply the style prop
    >
      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  );
};

export default FeatureCard;

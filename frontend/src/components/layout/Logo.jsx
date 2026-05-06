import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function Logo({ 
  to = "/",
  iconBg = "bg-[#1549B8]",
  iconColor = "text-white",
  textColor = "text-[#0F172A]",
  cvColor = "text-[#7C3AED]",
  badgeText = null,
  badgeClassName = "",
  className = "" 
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 no-underline shrink-0 ${className}`}
    >
      <div
        className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center transition-colors duration-250`}
      >
        <span className={`${iconColor} font-black text-sm`}>N</span>
      </div>
      <span
        className={`font-extrabold text-[20px] tracking-[px] transition-colors duration-250 ${textColor} flex items-center`}
        style={{ letterSpacing: "-0.5px" }}
      >
        Nex<span className={cvColor}>CV</span>
        {badgeText && (
          <Badge variant="secondary" className={`ml-2 text-[10px] px-2 py-0 border ${badgeClassName}`}>
            {badgeText}
          </Badge>
        )}
      </span>
    </Link>
  );
}

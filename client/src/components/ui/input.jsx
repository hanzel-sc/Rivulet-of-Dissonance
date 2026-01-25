import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, isDarkMode = true, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
                isDarkMode
                    ? "border-slate-700 bg-slate-900/80 text-white placeholder:text-slate-400 focus:ring-offset-slate-950 shadow-[inset_0_0_10px_rgba(0,229,255,0.3)]"
                    : "border-slate-300 bg-white/90 text-slate-900 placeholder:text-slate-500 focus:ring-offset-white shadow-sm",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

export { Input };

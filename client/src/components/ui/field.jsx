import * as React from "react";
import { cn } from "@/lib/utils";

const Field = React.forwardRef(
    ({ className, orientation = "vertical", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex gap-3",
                    orientation === "horizontal" ? "flex-row items-center" : "flex-col",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Field.displayName = "Field";

export { Field };

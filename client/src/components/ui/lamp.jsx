"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { ParticleAnimation } from "./ParticleAnimation";
import { SHAPES } from "./particleShapes";

export const LampContainer = ({ children, className }) => {
    const { isDarkMode } = useTheme();
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const lampWidth = isMobile ? "15rem" : "30rem";
    const initialWidth = isMobile ? "8rem" : "15rem";
    const mainGlowWidth = isMobile ? "16rem" : "28rem";
    const lightBeamWidth = isMobile ? "15rem" : "30rem";

    return (
        <div
            className={cn(
                "relative flex min-h-screen flex-col items-center w-full rounded-md z-0 overflow-hidden transition-colors duration-500",
                isDarkMode ? "bg-slate-950" : "bg-gradient-to-b from-slate-100 to-slate-100",
                className
            )}
        >
            {/* Particle Animation - fills empty spaces on both sides */}
            <ParticleAnimation
                leftShape={SHAPES.orbit}
                rightShape={SHAPES.orbit}
                particleCount={isMobile ? 10 : 18}
            />

            {/* Lamp Effect Header */}
            <div className={cn("w-full z-0", isMobile ? "pt-[10vh]" : "pt-[20vh]")}>
                <div className="relative flex w-full items-center justify-center isolate z-0 h-40 md:h-80">
                    <motion.div
                        initial={{ opacity: 0.3, width: initialWidth }}
                        whileInView={{ opacity: isDarkMode ? 0.8 : 0.12, width: lampWidth }}
                        transition={{
                            delay: 0.3,
                            duration: 1.4,
                            ease: "easeInOut",
                        }}
                        style={{
                            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                        }}
                        className={cn(
                            "absolute inset-auto right-1/2 h-40 md:h-56 overflow-visible w-[15rem] md:w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]",
                            !isDarkMode && "opacity-20"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute w-full left-0 h-28 md:h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]",
                                isDarkMode ? "bg-slate-950" : "bg-slate-100"
                            )}
                        />
                        <div
                            className={cn(
                                "absolute w-28 md:w-40 h-full left-0 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]",
                                isDarkMode ? "bg-slate-950" : "bg-slate-100"
                            )}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0.3, width: initialWidth }}
                        whileInView={{ opacity: isDarkMode ? 0.8 : 0.12, width: lampWidth }}
                        transition={{
                            delay: 0.3,
                            duration: 1.4,
                            ease: "easeInOut",
                        }}
                        style={{
                            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
                        }}
                        className={cn(
                            "absolute inset-auto left-1/2 h-40 md:h-56 w-[15rem] md:w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]",
                            !isDarkMode && "opacity-20"
                        )}
                    >
                        <div
                            className={cn(
                                "absolute w-28 md:w-40 h-full right-0 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]",
                                isDarkMode ? "bg-slate-950" : "bg-slate-100"
                            )}
                        />
                        <div
                            className={cn(
                                "absolute w-full right-0 h-28 md:h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]",
                                isDarkMode ? "bg-slate-950" : "bg-slate-100"
                            )}
                        />
                    </motion.div>

                    {/* softened background glow */}
                    <div
                        className={cn(
                            "absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 blur-[90px] transition-opacity duration-1000",
                            isDarkMode ? "bg-slate-950" : "bg-slate-100"
                        )}
                    />

                    <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>

                    {/* MAIN GLOW — smoother dim/glow */}
                    <motion.div
                        initial={{ opacity: isDarkMode ? 0.2 : 0.05 }}
                        animate={{ opacity: isDarkMode ? 0.45 : 0.08 }}
                        transition={{
                            duration: 2.4,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "absolute inset-auto z-50 h-36 w-[16rem] md:w-[28rem] -translate-y-1/2 rounded-full blur-[80px]",
                            isDarkMode ? "bg-cyan-500" : "bg-cyan-300"
                        )}
                    />

                    {/* secondary glow */}
                    <motion.div
                        initial={{ opacity: 0.2, width: "8rem" }}
                        animate={{ opacity: 0.35, width: isMobile ? "12rem" : "16rem" }}
                        transition={{
                            delay: 0.4,
                            duration: 2,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full blur-[70px]",
                            isDarkMode ? "bg-cyan-400" : "bg-cyan-200"
                        )}
                    />

                    {/* light beam */}
                    <motion.div
                        initial={{ opacity: 0.2, width: initialWidth }}
                        animate={{ opacity: 0.35, width: lightBeamWidth }}
                        transition={{
                            delay: 0.4,
                            duration: 2,
                            ease: "easeInOut",
                        }}
                        className={cn(
                            "absolute inset-auto z-50 h-0.5 -translate-y-[4rem] md:-translate-y-[7rem]",
                            isDarkMode ? "bg-cyan-400" : "bg-cyan-300"
                        )}
                    />

                    <div
                        className={cn(
                            "absolute inset-auto z-40 h-44 w-full -translate-y-[9.5rem] md:-translate-y-[12.5rem]",
                            isDarkMode ? "bg-slate-950" : "bg-slate-100"
                        )}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className={cn("relative z-50 flex flex-col items-center px-5 w-full", isMobile ? "-mt-10" : "-mt-44")}>
                {children}
            </div>
        </div>
    );
};

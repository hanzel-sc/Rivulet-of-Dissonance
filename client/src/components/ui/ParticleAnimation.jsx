"use client";
import React, { useMemo } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { SHAPES } from "./particleShapes";

/**
 * Minimalist particle animation component
 * Creates floating, orbiting particles that complement the lamp effect
 */

const ParticleField = ({
    side = "left",
    particleCount = 35,
    shape = SHAPES.orbit,
    className,
}) => {
    const { isDarkMode } = useTheme();

    const particles = useMemo(() => {
        const items = [];
        for (let i = 0; i < particleCount; i++) {
            const size = 2 + Math.random() * 4;
            const delay = Math.random() * 8;
            const duration = 12 + Math.random() * 10;
            const x = 10 + Math.random() * 80;
            const y = 10 + Math.random() * 80;
            const opacity = 0.2 + Math.random() * 0.5;

            items.push({
                id: i,
                size,
                delay,
                duration,
                x,
                y,
                opacity,
            });
        }
        return items;
    }, [particleCount]);

    const getAnimationProps = (particle) => {
        const baseTransition = {
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
        };

        switch (shape) {
            case SHAPES.orbit:
                return {
                    animate: {
                        x: [0, 15, 0, -15, 0],
                        y: [0, -10, 0, 10, 0],
                        scale: [1, 1.1, 1, 0.9, 1],
                        opacity: [
                            particle.opacity,
                            particle.opacity * 1.3,
                            particle.opacity,
                            particle.opacity * 0.7,
                            particle.opacity,
                        ],
                    },
                    transition: baseTransition,
                };
            case SHAPES.float:
                return {
                    animate: {
                        y: [0, -20, 0],
                        x: [0, 5, 0],
                        opacity: [
                            particle.opacity,
                            particle.opacity * 1.2,
                            particle.opacity,
                        ],
                    },
                    transition: {
                        ...baseTransition,
                        duration: particle.duration * 0.8,
                    },
                };
            case SHAPES.pulse:
                return {
                    animate: {
                        scale: [1, 1.4, 1],
                        opacity: [
                            particle.opacity * 0.5,
                            particle.opacity,
                            particle.opacity * 0.5,
                        ],
                    },
                    transition: {
                        ...baseTransition,
                        duration: particle.duration * 0.6,
                    },
                };
            default:
                return {
                    animate: {},
                    transition: baseTransition,
                };
        }
    };

    return (
        <div
            className={cn(
                "absolute top-0 h-full pointer-events-none overflow-hidden",
                side === "left" ? "left-0" : "right-0",
                "w-1/4 md:w-1/3",
                className
            )}
        >
            {particles.map((particle) => {
                const animProps = getAnimationProps(particle);
                return (
                    <motion.div
                        key={particle.id}
                        className={cn(
                            "absolute rounded-full blur-[1px]",
                            isDarkMode
                                ? "bg-cyan-400/60"
                                : "bg-cyan-300/80"
                        )}
                        style={{
                            width: particle.size,
                            height: particle.size,
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={animProps.animate}
                        transition={animProps.transition}
                    />
                );
            })}
        </div>
    );
};

/**
 * Dual particle fields that mirror on both sides of the lamp
 */
export const ParticleAnimation = ({
    leftShape = SHAPES.orbit,
    rightShape = SHAPES.orbit,
    particleCount = 20,
    className,
}) => {
    const { isDarkMode } = useTheme();

    return (
        <div className={cn("absolute inset-0 z-10 pointer-events-none", className)}>
            <ParticleField
                side="left"
                shape={leftShape}
                particleCount={particleCount}
            />

            <ParticleField
                side="right"
                shape={rightShape}
                particleCount={particleCount}
            />

            {/* Subtle connecting glow in center (dark + light mode) */}
            <motion.div
                className={cn(
                    "absolute left-1/2 top-1/3 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl",
                    isDarkMode
                        ? "bg-cyan-500/5"
                        : "bg-cyan-400/10"
                )}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: isDarkMode
                        ? [0.3, 0.5, 0.3]
                        : [0.15, 0.25, 0.15],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default ParticleAnimation;

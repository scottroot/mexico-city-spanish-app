"use client";

import React, {useEffect, useId, useMemo, useRef, useState} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ClickAway from "./ClickAway";


export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: TooltipPlacement;
  offset?: number; // default 8
  disabled?: boolean;
  delay?: number; // default 80
  closeDelay?: number; // default 80
  panelClassName?: string;
  className?: string;
}

/**
 * Accessible Tooltip with Framer Motion.
 * - Hover/focus and keyboard friendly.
 * - AnimatePresence for mount/unmount. Reduced motion respected.
 */
export default function Tooltip({
  content,
  children,
  open,
  defaultOpen,
  onOpenChange,
  placement = "top",
  offset = 8,
  disabled,
  delay = 80,
  closeDelay = 80,
  panelClassName,
  className,
}: TooltipProps) {
  // const id = useId();
  // const wrapperRef = useRef<HTMLDivElement>(null);
  // const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(!!defaultOpen);
  // const isControlled = open !== undefined;
  // const isOpen = isControlled ? !!open : uncontrolledOpen;
  // const prefersReduced = useReducedMotion();

  // // timers for show/hide delays
  // const showTimer = useRef<number | null>(null);
  // const hideTimer = useRef<number | null>(null);

  // const clearTimers = () => {
  //   if (showTimer.current) {
  //     window.clearTimeout(showTimer.current);
  //     showTimer.current = null;
  //   }
  //   if (hideTimer.current) {
  //     window.clearTimeout(hideTimer.current);
  //     hideTimer.current = null;
  //   }
  // };

  // useEffect(() => () => clearTimers(), []);

  // const setOpen = (next: boolean) => {
  //   if (disabled) return;
  //   if (!isControlled) setUncontrolledOpen(next);
  //   onOpenChange?.(next);
  // };

  // const scheduleShow = () => {
  //   if (disabled) return;
  //   clearTimers();
  //   showTimer.current = window.setTimeout(() => setOpen(true), delay);
  // };

  // const scheduleHide = () => {
  //   clearTimers();
  //   hideTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
  // };

  // // keyboard: Esc closes
  // useEffect(() => {
  //   if (!isOpen) return;
  //   const onKey = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") setOpen(false);
  //   };
  //   document.addEventListener("keydown", onKey);
  //   return () => document.removeEventListener("keydown", onKey);
  // }, [isOpen]);

  // // clone child to attach aria and handlers
  // const trigger = useMemo(() => {
  //   const props: React.HTMLAttributes<HTMLElement> & {"aria-describedby"?: string} = {
  //     onMouseEnter: (e) => {
  //       children.props.onMouseEnter?.(e);
  //       scheduleShow();
  //     },
  //     onMouseLeave: (e) => {
  //       children.props.onMouseLeave?.(e);
  //       scheduleHide();
  //     },
  //     onFocus: (e) => {
  //       children.props.onFocus?.(e);
  //       scheduleShow();
  //     },
  //     onBlur: (e) => {
  //       children.props.onBlur?.(e);
  //       scheduleHide();
  //     },
  //     "aria-describedby": isOpen ? id : undefined,
  //   };
  //   return React.cloneElement(children, props);
  // }, [children, isOpen]);

  // const placementClasses: Record<TooltipPlacement, string> = {
  //   top: "bottom-full left-1/2 -translate-x-1/2",
  //   bottom: "top-full left-1/2 -translate-x-1/2",
  //   left: "right-full top-1/2 -translate-y-1/2",
  //   right: "left-full top-1/2 -translate-y-1/2",
  // };

  // const arrowPlacement: Record<TooltipPlacement, string> = {
  //   top: "-bottom-1 left-1/2 -translate-x-1/2 rotate-45",
  //   bottom: "-top-1 left-1/2 -translate-x-1/2 rotate-45",
  //   left: "-right-1 top-1/2 -translate-y-1/2 rotate-45",
  //   right: "-left-1 top-1/2 -translate-y-1/2 rotate-45",
  // };

  // const offsetStyle: React.CSSProperties =
  //   placement === "top"
  //     ? { marginBottom: offset }
  //     : placement === "bottom"
  //     ? { marginTop: offset }
  //     : placement === "left"
  //     ? { marginRight: offset }
  //     : { marginLeft: offset };

  // // Motion variants per placement
  // const variants = {
  //   initial: (p: TooltipPlacement) => {
  //     if (prefersReduced) return { opacity: 0 };
  //     switch (p) {
  //       case "top":
  //         return { opacity: 0, y: -4, scale: 0.98 };
  //       case "bottom":
  //         return { opacity: 0, y: 4, scale: 0.98 };
  //       case "left":
  //         return { opacity: 0, x: -4, scale: 0.98 };
  //       case "right":
  //         return { opacity: 0, x: 4, scale: 0.98 };
  //     }
  //   },
  //   animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  //   exit: (p: TooltipPlacement) => {
  //     if (prefersReduced) return { opacity: 0 };
  //     switch (p) {
  //       case "top":
  //         return { opacity: 0, y: -4, scale: 0.98 };
  //       case "bottom":
  //         return { opacity: 0, y: 4, scale: 0.98 };
  //       case "left":
  //         return { opacity: 0, x: -4, scale: 0.98 };
  //       case "right":
  //         return { opacity: 0, x: 4, scale: 0.98 };
  //     }
  //   },
  // } as const;

  // const transition = prefersReduced
  //   ? { duration: 0.1 }
  //   : { type: "spring", stiffness: 400, damping: 30, mass: 0.8 };
  
  return null;
  // return (
  //   <ClickAway
  //     onClickAway={() => {
  //       if (isOpen) setOpen(false);
  //     }}
  //     containerClass={"relative inline-block " + (className ?? "")}
  //   >
  //     <div ref={wrapperRef} className="contents">
  //       {trigger}

  //       <AnimatePresence
  //         // Tooltip panel with Framer Motion
  //       >
  //         {isOpen && (
  //           <motion.div
  //             key="tooltip"
  //             id={id}
  //             role="tooltip"
  //             aria-hidden={(!isOpen).toString()}
  //             className={[
  //               "pointer-events-none absolute z-50",
  //               placementClasses[placement],
  //               "rounded-2xl px-3 py-2 text-xs shadow-lg bg-neutral-900 text-white/95",
  //               panelClassName ?? "",
  //             ].join(" ")}
  //             style={offsetStyle}
  //             initial={variants.initial(placement)}
  //             animate={variants.animate}
  //             exit={variants.exit(placement)}
  //             transition={transition}
  //           >
  //             {content}
  //             <span
  //               aria-hidden="true"
  //               className={[
  //                 "absolute h-2 w-2 bg-neutral-900",
  //                 arrowPlacement[placement],
  //                 "rounded-[2px]",
  //               ].join(" ")}
  //             />
  //           </motion.div>
  //         )}
  //       </AnimatePresence>
  //     </div>
  //   </ClickAway>
  // );
}

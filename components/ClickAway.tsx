"use client"
import React, {useRef, useEffect, createElement} from "react";


function useOutsideAlerter(ref: any, handleClickAway: any) {
  useEffect(() => {
    function handleClickOutside(event: { target: any; }) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClickAway();
      }
    }

    // Escape Key Listener
    function keyDownHandler(event: any) {
      if (event.key === 'Escape') {
        handleClickAway();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [handleClickAway, ref]);
}


export default function OutsideAlerter({children, onClickAway, rootEl="div", as="", containerClass="", ...props}: {children: any, onClickAway?: any, rootEl?: string, as?: string, containerClass?: string, [k:string]: any}) {
  const wrapperRef = useRef(null);
  let func = onClickAway;
  if(typeof onClickAway === 'undefined') {
    func = ()=>null
  }
  useOutsideAlerter(wrapperRef, func);

  if(rootEl === "div" && !as) return <div className={containerClass} ref={wrapperRef}>{children}</div>
  if(as) {
    const forwardProps = {
      ref: wrapperRef,
      ...(containerClass ? {className: containerClass} : {}),
      ...props
    }
    return createElement(as, forwardProps, children)
  }

  return <span id="CAL" className={containerClass} ref={wrapperRef}>{children}</span>
}
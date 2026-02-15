'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const cursorRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 500, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);
    document.body.classList.add('custom-cursor-active');

    let rafId: number;
    const moveCursor = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.dataset.cursor === 'pointer';

      if (isInteractive) {
        setIsHovering(true);
        // Check for custom cursor text
        const text = target.dataset.cursorText || target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        if (text) setCursorText(text);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorText('');
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.body.classList.remove('custom-cursor-active');
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          {/* Inner dot */}
          <motion.div
            className="w-3 h-3 rounded-full bg-white"
            animate={{
              scale: isHovering ? 0 : 1,
            }}
          />
          
          {/* Outer ring */}
          <motion.div
            className="absolute w-8 h-8 rounded-full border border-white"
            animate={{
              scale: isHovering ? 1 : 0,
              opacity: isHovering ? 1 : 0,
            }}
          />

          {/* Cursor text */}
          {cursorText && (
            <motion.span
              className="absolute whitespace-nowrap text-xs font-medium text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 30 }}
              exit={{ opacity: 0 }}
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Trailing cursor */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="w-full h-full rounded-full border border-neon-blue/30"
          animate={{
            scale: isClicking ? 1.5 : isHovering ? 2 : 1,
            opacity: isHovering ? 0.5 : 0.3,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </>
  );
}

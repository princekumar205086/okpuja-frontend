'use client';

import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  active?: boolean;
  duration?: number;
}

export function Confetti({ active = true, duration = 4000 }: ConfettiProps) {
  const [showConfetti, setShowConfetti] = useState<boolean>(active);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only show confetti if active prop is true
    if (!active) {
      setShowConfetti(false);
      return;
    }
    if (active) {
      setShowConfetti(true);
      
      // Set timer to hide confetti after duration
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [active, duration]);

  useEffect(() => {
    // Set initial dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Set dimensions on mount
    updateDimensions();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={200}
      recycle={false}
      colors={['#f97316', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e']}
    />
  );
}

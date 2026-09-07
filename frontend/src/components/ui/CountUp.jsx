import React, { useState, useEffect, useRef } from 'react';

/**
 * CountUp - Smooth Animated Number Counter
 * Automatically parses prefix, numeric core, and suffix from values like:
 * - "₹340,900" -> prefix: "₹", target: 340900, suffix: ""
 * - "12.9k kg" -> prefix: "", target: 12.9, suffix: "k kg"
 * - "92%" -> prefix: "", target: 92, suffix: "%"
 * - "128 BPM" -> prefix: "", target: 128, suffix: " BPM"
 * - 162 -> target: 162
 */
export const CountUp = ({
  value,
  duration = 1.2,
  decimals,
  className = '',
  prefix: manualPrefix,
  suffix: manualSuffix,
  separator = ',',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Parse raw value
  const parseVal = () => {
    if (typeof value === 'number') {
      return {
        prefix: manualPrefix || '',
        num: value,
        suffix: manualSuffix || '',
        decimals: decimals !== undefined ? decimals : (value % 1 !== 0 ? 1 : 0),
      };
    }

    const str = String(value || '0').trim();
    // Match optional prefix, numeric part (with optional decimal), and suffix
    const match = str.match(/^([^0-9.-]*)([-+]?[0-9,]*\.?[0-9]+)(.*)$/);
    if (!match) {
      return { prefix: manualPrefix || '', num: 0, suffix: manualSuffix || str, decimals: 0 };
    }

    const prefix = manualPrefix !== undefined ? manualPrefix : match[1];
    const numStr = match[2].replace(/,/g, '');
    const num = parseFloat(numStr) || 0;
    const suffix = manualSuffix !== undefined ? manualSuffix : match[3];
    const dec = decimals !== undefined ? decimals : (numStr.includes('.') ? numStr.split('.')[1].length : 0);

    return { prefix, num, suffix, decimals: dec };
  };

  const parsed = parseVal();

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const easeOutExpo = (t) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const animateCount = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easedProgress = easeOutExpo(progress);
      const current = easedProgress * parsed.num;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setDisplayValue(parsed.num);
      }
    };

    // Intersection observer so it animates when it enters the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            animationFrameId = requestAnimationFrame(animateCount);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration, parsed.num]);

  // Format current numeric display
  const formatNumber = (n) => {
    const fixed = n.toFixed(parsed.decimals);
    const [intPart, decPart] = fixed.split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  };

  return (
    <span ref={elementRef} className={`inline-block tabular-nums ${className}`}>
      {parsed.prefix}
      {formatNumber(displayValue)}
      {parsed.suffix}
    </span>
  );
};

export default CountUp;

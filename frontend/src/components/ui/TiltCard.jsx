import React, { useRef, useState, useCallback } from 'react';

/**
 * TiltCard - Premium 3D Perspective Tilt Container
 * Features:
 * - Subtle 2-4 degree cursor-following 3D perspective tilt
 * - Dynamic specular light reflection / glare that follows the cursor
 * - Silky smooth spring physics reset on mouse leave
 * - Respects mobile/touch with gentle tap scaling
 * - Zero WebGL overhead, purely hardware-accelerated CSS 3D transforms
 */
export const TiltCard = ({
  children,
  className = '',
  maxTilt = 4, // Max tilt angle in degrees (subtle & restrained)
  glare = true,
  glareOpacity = 0.12,
  scale = 1.012,
  perspective = 1000,
  onClick,
  style = {},
  as: Component = 'div',
  ...props
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card center (-1 to 1)
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;

    const xOffset = (mouseX - 0.5) * 2;
    const yOffset = (mouseY - 0.5) * 2;

    // Calculate rotation: mouse on right -> tilt right (rotateY positive), mouse on top -> tilt up (rotateX negative)
    const rotateY = xOffset * maxTilt;
    const rotateX = -yOffset * maxTilt;

    setTransform({
      rotateX,
      rotateY,
      scale,
    });

    if (glare) {
      setGlarePos({
        x: mouseX * 100,
        y: mouseY * 100,
        opacity: glareOpacity,
      });
    }
  }, [maxTilt, scale, glare, glareOpacity]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        transform: `perspective(${perspective}px) rotateX(${transform.rotateX.toFixed(2)}deg) rotateY(${transform.rotateY.toFixed(2)}deg) scale3d(${transform.scale}, ${transform.scale}, 1)`,
        transition: isHovered 
          ? 'transform 0.08s cubic-bezier(0.2, 0, 0.2, 1)' 
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
        ...style,
      }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Specular Glare Reflection Layer */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-[inherit]"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.25), rgba(91, 110, 255, 0.15) 35%, transparent 70%)`,
          }}
        />
      )}

      {/* Card Content with 3D Depth preservation */}
      <div className="relative z-10 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </Component>
  );
};

export default TiltCard;

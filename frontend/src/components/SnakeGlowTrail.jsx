import React, { useState, useEffect, useRef } from "react";

const SnakeGlowTrail = () => {
  const positionsRef = useRef([]);
  const [positions, setPositions] = useState([]);
  const timeoutRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const fadeOutDelay = 300; // ms before fade starts
    const fadeOutInterval = 50; // ms between fade steps
    const maxLength = 20; // trail length

    let fadeTimeout;
    let fadeInterval;

    const updatePositions = () => {
      setPositions([...positionsRef.current]);
      animationFrameRef.current = requestAnimationFrame(updatePositions);
    };

    const handleMouseMove = (e) => {
      // Add new position
      positionsRef.current.push({ x: e.clientX, y: e.clientY });
      if (positionsRef.current.length > maxLength) positionsRef.current.shift();

      // Clear any fade timers
      if (fadeTimeout) clearTimeout(fadeTimeout);
      if (fadeInterval) clearInterval(fadeInterval);

      // Start fade timer
      fadeTimeout = setTimeout(() => {
        fadeInterval = setInterval(() => {
          if (positionsRef.current.length > 0) {
            positionsRef.current.shift();
            setPositions([...positionsRef.current]);
          } else {
            clearInterval(fadeInterval);
          }
        }, fadeOutInterval);
      }, fadeOutDelay);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(updatePositions);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(fadeTimeout);
      clearInterval(fadeInterval);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{
        background: positions.length
          ? positions
              .map((pos, index) => {
                const size = 60 - index * 4;
                const opacity = 0.6 - index * 0.05;
                return `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, rgba(147, 51, 234, ${opacity}), transparent 50%)`;
              })
              .join(", ")
          : "transparent",
        transition: "background 0.1s ease",
      }}
    />
  );
};

export default SnakeGlowTrail;

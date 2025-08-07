import React, { useEffect, useRef, useState } from 'react';

interface ScaleInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  scale?: number;
  className?: string;
  threshold?: number;
}

const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  duration = 600,
  delay = 0,
  scale = 0.8,
  className = '',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : `scale(${scale})`,
        transition: `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
};

export default ScaleIn;

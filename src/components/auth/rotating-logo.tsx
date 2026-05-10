import React from 'react';
import { BladeFan } from '../../../public/icon/bladeFan';

interface PulseFanRotateProps {
  size?: number;
  iconSize?: number;
  text?: string;
  radius?: number;
}

const PulseFanRotate = ({ 
  size = 160, 
  iconSize = 72, 
  text = "PULSE", 
  radius = 46 
}: PulseFanRotateProps) => {
  // Calculate dynamic values based on props
  const center = size / 2;
  const diameter = radius * 2;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Fan Icon */}
      <div className="absolute z-10">
        <BladeFan size={iconSize} color="#ffffff" strokeWidth={1.5} />
      </div>

      {/* Circular Text */}
      <svg
        className="absolute w-full h-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <path
            id="pulsePath"
            d={`M ${center}, ${center} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${diameter},0 a ${radius},${radius} 0 1,1 -${diameter},0`}
          />
        </defs>
        {[0, 90, 180, 270].map((deg) => (
          <text
            key={deg}
            className="fill-white text-[10px] font-black uppercase tracking-widest"
          >
            <textPath
              href="#pulsePath"
              /* Maintains your +10 offset logic */
              startOffset={`${((deg / 360) * 100 + 10) % 100}%`}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {text}
            </textPath>
          </text>
        ))}
      </svg>
    </div>
  );
};

export default PulseFanRotate;
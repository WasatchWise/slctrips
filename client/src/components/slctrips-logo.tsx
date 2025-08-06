import React from 'react';

interface SLCTripsLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'white' | 'monochrome';
  className?: string;
}

export function SLCTripsLogo({ size = 'md', variant = 'primary', className = '' }: SLCTripsLogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const variantStyles = {
    primary: {
      slc: 'text-[#0082c9]',
      trips: 'text-white',
      pin: 'text-[#f8a023]',
      pinGradient: 'from-[#f8a023] to-[#db3d0e]'
    },
    white: {
      slc: 'text-white',
      trips: 'text-white',
      pin: 'text-white',
      pinGradient: 'from-white to-gray-200'
    },
    monochrome: {
      slc: 'text-gray-800',
      trips: 'text-gray-800',
      pin: 'text-gray-800',
      pinGradient: 'from-gray-800 to-gray-600'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className={`${styles.slc} uppercase`}>SLC</span>
      <span className={`${styles.trips} lowercase`}>tr</span>
      {/* Special 'i' with map pin design */}
      <span className="relative inline-block">
        <span className={`${styles.trips} lowercase`}>ps</span>
        {/* Map pin dot */}
        <span className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 ${styles.pin} bg-current rounded-full`}></span>
        {/* Map pin stem */}
        <span className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gradient-to-b ${styles.pinGradient}`}></span>
      </span>
    </div>
  );
}

// Alternative version with SVG map pin for more precise control
export function SLCTripsLogoWithSVG({ size = 'md', variant = 'primary', className = '' }: SLCTripsLogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const variantColors = {
    primary: {
      slc: '#0082c9',
      trips: '#ffffff',
      pin: '#f8a023',
      pinGradient: 'url(#orangeGradient)'
    },
    white: {
      slc: '#ffffff',
      trips: '#ffffff',
      pin: '#ffffff',
      pinGradient: 'url(#whiteGradient)'
    },
    monochrome: {
      slc: '#374151',
      trips: '#374151',
      pin: '#374151',
      pinGradient: 'url(#grayGradient)'
    }
  };

  const colors = variantColors[variant];

  return (
    <div className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span style={{ color: colors.slc }} className="uppercase">SLC</span>
      <span style={{ color: colors.trips }} className="lowercase">tr</span>
      <span className="relative inline-block">
        <span style={{ color: colors.trips }} className="lowercase">ps</span>
        <svg 
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3" 
          viewBox="0 0 12 12"
          fill="none"
        >
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f8a023" />
              <stop offset="100%" stopColor="#db3d0e" />
            </linearGradient>
            <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
            <linearGradient id="grayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>
          </defs>
          {/* Map pin dot */}
          <circle cx="6" cy="2" r="1.5" fill={colors.pin} />
          {/* Map pin stem */}
          <path d="M6 3.5 L6 10 L5 11 L7 11 L6 10 Z" fill={colors.pinGradient} />
        </svg>
      </span>
    </div>
  );
}

// Simple text version for small applications
export function SLCTripsLogoText({ size = 'md', variant = 'primary', className = '' }: SLCTripsLogoProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const variantColors = {
    primary: {
      slc: 'text-[#0082c9]',
      trips: 'text-white'
    },
    white: {
      slc: 'text-white',
      trips: 'text-white'
    },
    monochrome: {
      slc: 'text-gray-800',
      trips: 'text-gray-800'
    }
  };

  const colors = variantColors[variant];

  return (
    <div className={`font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      <span className={`${colors.slc} uppercase`}>SLC</span>
      <span className={`${colors.trips} lowercase`}>Trips</span>
    </div>
  );
} 
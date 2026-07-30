import React from 'react';
import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'menu'
  | 'sparkles'
  | 'calendar'
  | 'star'
  | 'user'
  | 'bell'
  | 'wine'
  | 'chef'
  | 'credit-card'
  | 'zap'
  | 'smile'
  | 'heart'
  | 'check'
  | 'x'
  | 'arrow-right'
  | 'clock'
  | 'award'
  | 'crown'
  | 'utensils'
  | 'camera'
  | 'qr'
  | 'fingerprint'
  | 'face-id'
  | 'delete'
  | 'cloud'
  | 'check-circle';

interface PremiumIconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const PremiumIcon: React.FC<PremiumIconProps> = ({
  name,
  size = 20,
  color = '#d4af37',
  strokeWidth = 2,
}) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'crown':
      return (
        <Svg {...commonProps}>
          <Path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" />
        </Svg>
      );

    case 'utensils':
      return (
        <Svg {...commonProps}>
          <Path d="M18 2v20M14 2v6a4 4 0 0 0 4 4M6 2v6a4 4 0 0 0 4 4M6 22V12M10 2v6" />
        </Svg>
      );

    case 'camera':
      return (
        <Svg {...commonProps}>
          <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <Circle cx="12" cy="13" r="3" />
        </Svg>
      );

    case 'qr':
      return (
        <Svg {...commonProps}>
          <Rect x="3" y="3" width="7" height="7" rx="1" />
          <Rect x="14" y="3" width="7" height="7" rx="1" />
          <Rect x="3" y="14" width="7" height="7" rx="1" />
          <Path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 18h3v3h-3zM18 14h3v3h-3z" />
        </Svg>
      );

    case 'fingerprint':
      return (
        <Svg {...commonProps}>
          <Path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M14 13.12c0 2.38 0 6.38-1 8.88M2 12a10 10 0 0 1 18-3.5M12 2a10 10 0 0 0-8 6M6 16c.39-2.3 1-5 1-7a5 5 0 0 1 9.24-2.61M21.25 15c-.25-1-.5-2.25-.5-3a8.75 8.75 0 0 0-14-6.6" />
        </Svg>
      );

    case 'face-id':
      return (
        <Svg {...commonProps}>
          <Path d="M4 7V5a2 2 0 0 1 2-2h2M16 3h2a2 2 0 0 1 2 2v2M4 17v2a2 2 0 0 0 2 2h2M16 21h2a2 2 0 0 0 2-2v-2" />
          <Path d="M9 9h.01M15 9h.01" />
          <Path d="M10 13c.5.5 1.5 1 2 1s1.5-.5 2-1" />
        </Svg>
      );

    case 'delete':
      return (
        <Svg {...commonProps}>
          <Path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
          <Line x1="18" y1="9" x2="12" y2="15" />
          <Line x1="12" y1="9" x2="18" y2="15" />
        </Svg>
      );

    case 'cloud':
      return (
        <Svg {...commonProps}>
          <Path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
        </Svg>
      );

    case 'check-circle':
      return (
        <Svg {...commonProps}>
          <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <Polyline points="22 4 12 14.01 9 11.01" />
        </Svg>
      );

    case 'home':
      return (
        <Svg {...commonProps}>
          <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <Polyline points="9 22 9 12 15 12 15 22" />
        </Svg>
      );

    case 'menu':
      return (
        <Svg {...commonProps}>
          <Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <Path d="M6 6h10" />
          <Path d="M6 10h10" />
          <Path d="M6 14h8" />
        </Svg>
      );

    case 'sparkles':
      return (
        <Svg {...commonProps}>
          <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <Path d="M5 3v4" />
          <Path d="M19 17v4" />
          <Path d="M3 5h4" />
          <Path d="M17 19h4" />
        </Svg>
      );

    case 'calendar':
      return (
        <Svg {...commonProps}>
          <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <Line x1="16" y1="2" x2="16" y2="6" />
          <Line x1="8" y1="2" x2="8" y2="6" />
          <Line x1="3" y1="10" x2="21" y2="10" />
          <Path d="M8 14h.01" />
          <Path d="M12 14h.01" />
          <Path d="M16 14h.01" />
          <Path d="M8 18h.01" />
          <Path d="M12 18h.01" />
        </Svg>
      );

    case 'star':
      return (
        <Svg {...commonProps}>
          <Path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </Svg>
      );

    case 'user':
      return (
        <Svg {...commonProps}>
          <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <Circle cx="12" cy="7" r="4" />
        </Svg>
      );

    case 'bell':
      return (
        <Svg {...commonProps}>
          <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </Svg>
      );

    case 'wine':
      return (
        <Svg {...commonProps}>
          <Path d="M8 22h8" />
          <Path d="M12 15v7" />
          <Path d="M12 15a7 7 0 0 0 7-7V3H5v5a7 7 0 0 0 7 7Z" />
        </Svg>
      );

    case 'chef':
      return (
        <Svg {...commonProps}>
          <Path d="M6 13.87A6 6 0 0 1 7.41 2a6 6 0 0 1 9.18 0A6 6 0 0 1 18 13.87V21H6v-7.13Z" />
          <Line x1="6" y1="17" x2="18" y2="17" />
        </Svg>
      );

    case 'credit-card':
      return (
        <Svg {...commonProps}>
          <Rect x="2" y="5" width="20" height="14" rx="2" />
          <Line x1="2" y1="10" x2="22" y2="10" />
        </Svg>
      );

    case 'zap':
      return (
        <Svg {...commonProps}>
          <Path d="M13 2 L3 14 L12 14 L11 22 L21 10 L12 10 L13 2 Z" />
        </Svg>
      );

    case 'smile':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <Line x1="9" y1="9" x2="9.01" y2="9" />
          <Line x1="15" y1="9" x2="15.01" y2="9" />
        </Svg>
      );

    case 'heart':
      return (
        <Svg {...commonProps}>
          <Path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </Svg>
      );

    case 'check':
      return (
        <Svg {...commonProps}>
          <Polyline points="20 6 9 17 4 12" />
        </Svg>
      );

    case 'x':
      return (
        <Svg {...commonProps}>
          <Line x1="18" y1="6" x2="6" y2="18" />
          <Line x1="6" y1="6" x2="18" y2="18" />
        </Svg>
      );

    case 'arrow-right':
      return (
        <Svg {...commonProps}>
          <Line x1="5" y1="12" x2="19" y2="12" />
          <Polyline points="12 5 19 12 12 19" />
        </Svg>
      );

    case 'clock':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="12 6 12 12 16 14" />
        </Svg>
      );

    case 'award':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="8" r="7" />
          <Polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </Svg>
      );

    default:
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
        </Svg>
      );
  }
};

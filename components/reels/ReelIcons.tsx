
import React from 'react';

export const DiamondLike = ({ filled, className = '' }: { filled: boolean, className?: string }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "#ff0055" : "none"} stroke="currentColor" strokeWidth={1.5} className={className}>
    <path d="M12 22L2.5 12L12 2L21.5 12L12 22Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HexComment = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
    <path d="M21 11.5C21 16.19 16.97 20 12 20C10.86 20 9.77 19.81 8.75 19.45L3 21L4.5 16.4C3.56 15.1 3 13.57 3 11.5C3 6.81 7.03 3 12 3C16.97 3 21 6.81 21 11.5Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PrismShare = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
    <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WaveformIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
    <path d="M2 12H4M6 8V16M10 4V20M14 6V18M18 10V14M22 12H20" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

'use client';

import { useEffect, useRef } from 'react';
import { CONFIG } from '@/lib/config';

/**
 * Grain — Animated SVG Film Grain Overlay
 *
 * Renders an animated SVG feTurbulence filter over the entire viewport.
 * The seed animates from 0→20 over 8 seconds for organic, non-repeating grain.
 * mix-blend-mode: overlay at 4.5% opacity — always present, never intrusive.
 */
export default function Grain() {
  if (!CONFIG.effects.grainEnabled) return null;

  return (
    <div
      className="grain-overlay"
      aria-hidden="true"
      role="presentation"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="3"
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="seed"
              from="0"
              to="20"
              dur="8s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix
            type="saturate"
            values="0"
            in="noise"
            result="grayNoise"
          />
          <feBlend
            in="SourceGraphic"
            in2="grayNoise"
            mode="overlay"
            result="blended"
          />
          <feComposite
            in="blended"
            in2="SourceGraphic"
            operator="in"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#grain-filter)"
          fill="rgba(255,255,255,0.15)"
        />
      </svg>
    </div>
  );
}

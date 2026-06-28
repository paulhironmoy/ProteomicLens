import React from "react";

interface MicroscopeLogoProps {
  className?: string;
  iconClassName?: string;
}

export default function MicroscopeLogo({ className = "", iconClassName = "w-6 h-6" }: MicroscopeLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* 3D Glossy Magnifying Glass & Cellular Proteomics Cluster */}
      <svg
        className={`${iconClassName} transition-all duration-300 filter drop-shadow-[0_4px_6px_rgba(79,70,229,0.15)]`}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shadow Gradient */}
          <radialGradient id="baseShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A1E9E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4A1E9E" stopOpacity="0" />
          </radialGradient>

          {/* Frame/Rim Gradients */}
          <linearGradient id="glassRimOuter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35127d" />
            <stop offset="40%" stopColor="#2c0c6c" />
            <stop offset="100%" stopColor="#120136" />
          </linearGradient>

          <linearGradient id="glassRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a376ff" />
            <stop offset="25%" stopColor="#7a42f5" />
            <stop offset="60%" stopColor="#4d16c9" />
            <stop offset="100%" stopColor="#24056e" />
          </linearGradient>

          <linearGradient id="glassRimInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#230466" />
            <stop offset="100%" stopColor="#551bc9" />
          </linearGradient>

          <linearGradient id="rimGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Handle Gradients */}
          <linearGradient id="handleBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7239f5" />
            <stop offset="50%" stopColor="#4a19cf" />
            <stop offset="100%" stopColor="#23047d" />
          </linearGradient>

          <linearGradient id="handleStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ac8eff" />
            <stop offset="100%" stopColor="#1a025c" />
          </linearGradient>

          <linearGradient id="handleGloss" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="15%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Lens Glass Gradient */}
          <radialGradient id="lensBg" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f7f4ff" />
            <stop offset="80%" stopColor="#ebdfff" />
            <stop offset="100%" stopColor="#cfbcff" />
          </radialGradient>

          {/* Spheres/Cell Gradients */}
          {/* Center (Large deep purple) */}
          <radialGradient id="purpleSphere" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#eadeff" />
            <stop offset="15%" stopColor="#b488ff" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>

          {/* Light Lavender spheres (Top, Bottom, Bottom-Right) */}
          <radialGradient id="lavenderSphereLight" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f5f0ff" />
            <stop offset="30%" stopColor="#d3c4ff" />
            <stop offset="75%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>

          {/* Medium-Dark Purple spheres (Bottom-Left, Top-Left) */}
          <radialGradient id="purpleSphereMedium" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ebdfff" />
            <stop offset="25%" stopColor="#ba94ff" />
            <stop offset="70%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#5b21b6" />
          </radialGradient>

          {/* Pinkish/Violet sphere (Top-Right) */}
          <radialGradient id="violetSphere" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fde7ff" />
            <stop offset="20%" stopColor="#e879f9" />
            <stop offset="65%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#701a75" />
          </radialGradient>
        </defs>

        {/* 1. Ambient Drop Shadow underneath the magnifying glass */}
        <ellipse cx="280" cy="455" rx="150" ry="16" fill="url(#baseShadow)" />

        {/* 2. Shiny 3D Handle (Angled at 225 degrees / bottom-left) */}
        <g id="handle">
          {/* Main rounded handle bar */}
          <rect
            x="118"
            y="312"
            width="60"
            height="150"
            rx="30"
            transform="rotate(45 118 312)"
            fill="url(#handleBg)"
            stroke="url(#handleStroke)"
            strokeWidth="5"
          />
          {/* Inner glossy highlight streak on handle */}
          <rect
            x="126"
            y="320"
            width="20"
            height="120"
            rx="10"
            transform="rotate(45 126 320)"
            fill="url(#handleGloss)"
          />
          {/* Highlight reflex cap at the bottom end of the handle */}
          <circle cx="160" cy="415" r="16" fill="#ffffff" opacity="0.15" />
        </g>

        {/* 3. Microscope/Lens Rim (Magnifying Glass Frame) */}
        <g id="lens-frame">
          {/* Outer Ring with deep shadow offset */}
          <circle cx="300" cy="220" r="132" fill="url(#glassRimOuter)" />
          
          {/* Main 3D purple bevel structure */}
          <circle cx="300" cy="220" r="126" fill="url(#glassRim)" />

          {/* Shiny inner highlight circle ring representing reflective metallic/plastic bevel */}
          <circle cx="300" cy="220" r="118" stroke="url(#rimGloss)" strokeWidth="4" />

          {/* Deep inner shadow bevel immediately bordering the glass */}
          <circle cx="300" cy="220" r="114" fill="url(#glassRimInner)" />
        </g>

        {/* 4. Translucent/Glass Lens Plate */}
        <g id="lens-plate">
          {/* Lens background with radial light-falloff gradient */}
          <circle cx="300" cy="220" r="102" fill="url(#lensBg)" />
          
          {/* Radial glaze glow representation */}
          <circle cx="300" cy="220" r="102" fill="#ffffff" opacity="0.1" />
        </g>

        {/* 5. Proteomics / Cellular Clusters inside Microscope Lens (Glossy 3D Spheres) */}
        <g id="protein-spheres">
          {/* Sphere 1: Top (Light Lavender) */}
          <circle cx="300" cy="160" r="16" fill="url(#lavenderSphereLight)" />
          <circle cx="295" cy="155" r="4" fill="#ffffff" opacity="0.65" filter="blur(0.5px)" /> {/* 3D light dot */}

          {/* Sphere 2: Top-Right (Vibrant violet/magenta) */}
          <circle cx="360" cy="182" r="18" fill="url(#violetSphere)" />
          <circle cx="354" cy="176" r="4.5" fill="#ffffff" opacity="0.65" filter="blur(0.5px)" />

          {/* Sphere 3: Bottom-Right (Medium lavender) */}
          <circle cx="364" cy="248" r="18" fill="url(#lavenderSphereLight)" />
          <circle cx="358" cy="242" r="4.5" fill="#ffffff" opacity="0.6" filter="blur(0.5px)" />

          {/* Sphere 4: Bottom (Light Lavender) */}
          <circle cx="300" cy="280" r="16" fill="url(#lavenderSphereLight)" />
          <circle cx="295" cy="275" r="4" fill="#ffffff" opacity="0.65" filter="blur(0.5px)" />

          {/* Sphere 5: Bottom-Left (Medium purple) */}
          <circle cx="244" cy="260" r="20" fill="url(#purpleSphereMedium)" />
          <circle cx="238" cy="254" r="5" fill="#ffffff" opacity="0.7" filter="blur(0.5px)" />

          {/* Sphere 6: Top-Left (Medium purple, small) */}
          <circle cx="246" cy="194" r="14" fill="url(#purpleSphereMedium)" />
          <circle cx="242" cy="190" r="3.5" fill="#ffffff" opacity="0.65" filter="blur(0.5px)" />

          {/* Central Core Protein (Largest, most prominent purple sphere) */}
          <circle cx="300" cy="220" r="24" fill="url(#purpleSphere)" />
          {/* Primary glossy 3D highlight */}
          <circle cx="292" cy="212" r="6" fill="#ffffff" opacity="0.8" filter="blur(0.5px)" />
          {/* Subtler bounce light on the bottom right edge inside the sphere */}
          <path d="M 312 232 A 16 16 0 0 1 288 236 A 20 20 0 0 0 312 232" fill="#ffffff" opacity="0.25" />
        </g>

        {/* 6. Realistic Glass Highlight Overlay (Outer Crescent Reflection) */}
        <path
          d="M 215 170 A 102 102 0 0 1 385 220 A 102 102 0 0 0 215 170 Z"
          fill="#ffffff"
          opacity="0.45"
          filter="blur(1px)"
        />
        {/* Soft second reflection on opposite side (bottom right) */}
          <path
          d="M 385 270 A 102 102 0 0 1 245 315 A 102 102 0 0 0 385 270 Z"
          fill="#ffffff"
          opacity="0.12"
          filter="blur(1px)"
        />
      </svg>
    </div>
  );
}


import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './KeychainHeroVisual.css';

/**
 * KeychainHeroVisual
 * A luxury editorial 3D interactive showcase component for the Keychain collection.
 * Features:
 * - Fluid 3D spring tilt responding to cursor movement
 * - Interactive dynamic resin glare reflection
 * - Ambient levitation & breathing floral aura
 * - Rotating bespoke artisan seal
 * - Glassmorphic editorial floating tags
 * - Diagonal crystal light sweep animation
 */
const KeychainHeroVisual = ({
  image = '/keychain_hero.jpg',
  alt = 'Bespoke Botanical Floral Showcase with Real Preserved Blooms and 24K Gold Leaf',
  badgeText = 'Handcrafted Botanical Resin',
  specsLabel = 'BESPOKE COLLECTION',
  specsTitle = 'Real Preserved Petals & 24K Leaf',
  sealText = '• TWIRL & FLORA • ARTISAN BOTANICALS',
  sealIcon = '✤',
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D tilt tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for fluid, physics-based rotation
  const springConfig = { damping: 22, stiffness: 180, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Map normalized mouse (0 -> 1) to tilt angles (-10deg -> +10deg)
  const rotateX = useTransform(smoothMouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-12, 12]);
  
  // Parallax translation for the inner image and floating elements
  const imageTranslateX = useTransform(smoothMouseX, [0, 1], [-8, 8]);
  const imageTranslateY = useTransform(smoothMouseY, [0, 1], [-8, 8]);

  // Floating tags counter-parallax
  const badgeTranslateX = useTransform(smoothMouseX, [0, 1], [12, -12]);
  const badgeTranslateY = useTransform(smoothMouseY, [0, 1], [10, -10]);

  // Dynamic light glare coordinates in percentage
  const glareX = useTransform(smoothMouseX, [0, 1], [15, 85]);
  const glareY = useTransform(smoothMouseY, [0, 1], [15, 85]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly reset tilt back to center
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div className="keychain-visual-container">
      {/* Ambient Pulsing Backlight Halo */}
      <motion.div
        className="keychain-ambient-glow"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.55, 0.85, 0.55],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Gentle Floating & Levitation Motion Wrapper */}
      <motion.div
        className="keychain-levitation-wrap"
        animate={
          isHovered
            ? { y: -6 }
            : {
                y: [-8, 8, -8],
                rotateZ: [-0.6, 0.6, -0.6],
              }
        }
        transition={
          isHovered
            ? { duration: 0.3 }
            : {
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        {/* Interactive 3D Card Stage */}
        <motion.div
          ref={cardRef}
          className="keychain-card-stage"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1100,
            transformStyle: 'preserve-3d',
          }}
          whileHover={{ scale: 1.025 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Main Visual Frame */}
          <div className="keychain-frame-inner">
            {/* High-res Image with Parallax Drift */}
            <motion.div
              className="keychain-img-canvas"
              style={{
                x: imageTranslateX,
                y: imageTranslateY,
                scale: 1.08,
              }}
            >
              <img
                src={image}
                alt={alt}
                className="keychain-picture"
                loading="eager"
              />
            </motion.div>

            {/* Dynamic Interactive Light Glare (Simulates Crystal Resin Reflection) */}
            <motion.div
              className="keychain-resin-glare"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([gx, gy]) =>
                    `radial-gradient(circle 280px at ${gx}% ${gy}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.12) 40%, transparent 80%)`
                ),
                opacity: isHovered ? 1 : 0.6,
              }}
            />

            {/* Periodic Shimmer Light Sweep */}
            <div className="keychain-light-sweep" />

            {/* Refined Glassmorphic Framing Vignette */}
            <div className="keychain-frame-vignette" />
          </div>

          {/* Floating Luxury Tag - Top Right */}
          <motion.div
            className="keychain-floating-badge"
            style={{
              x: badgeTranslateX,
              y: badgeTranslateY,
              translateZ: 40,
            }}
          >
            <span className="badge-sparkle">✦</span>
            <span className="badge-text">{badgeText}</span>
          </motion.div>

          {/* Floating Editorial Specs Card - Bottom Left */}
          <motion.div
            className="keychain-specs-card"
            style={{
              x: badgeTranslateX,
              y: badgeTranslateY,
              translateZ: 35,
            }}
          >
            <div className="specs-dot" />
            <div className="specs-content">
              <span className="specs-label">{specsLabel}</span>
              <span className="specs-title">{specsTitle}</span>
            </div>
          </motion.div>

          {/* Rotating Artisan Seal - Bottom Right */}
          <motion.div
            className="keychain-artisan-seal"
            style={{
              translateZ: 45,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg viewBox="0 0 100 100" className="seal-svg" aria-hidden="true">
              <path
                id="keychainSealPath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="seal-text">
                <textPath href="#keychainSealPath" startOffset="0%">
                  {sealText}
                </textPath>
              </text>
            </svg>
            <div className="seal-center-icon">{sealIcon}</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default KeychainHeroVisual;

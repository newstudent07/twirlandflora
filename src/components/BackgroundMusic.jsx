import React, { useEffect, useRef, useState } from 'react';
import { AmbientGardenEngine } from '@/lib/ambientMusic';
import './BackgroundMusic.css';

const STORAGE_ENABLED_KEY = 'twirl_flora_music_enabled';
const STORAGE_VOLUME_KEY = 'twirl_flora_music_volume';

function readStoredEnabled() {
  try {
    return localStorage.getItem(STORAGE_ENABLED_KEY) !== 'false';
  } catch {
    return true;
  }
}

function readStoredVolume() {
  try {
    const parsed = parseFloat(localStorage.getItem(STORAGE_VOLUME_KEY));
    return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0.65;
  } catch {
    return 0.65;
  }
}

const BackgroundMusic = () => {
  const initialEnabled = readStoredEnabled();
  const initialVolume = readStoredVolume();

  const [volume, setVolume] = useState(initialVolume);
  const [status, setStatus] = useState(() => (initialEnabled ? 'awaiting' : 'paused'));
  const [showVolume, setShowVolume] = useState(false);

  const engineRef = useRef(null);
  const widgetRef = useRef(null);
  const enabledRef = useRef(initialEnabled);
  const initialVolumeRef = useRef(initialVolume);
  const removeUnlockRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const engine = new AmbientGardenEngine(initialVolumeRef.current);
    engineRef.current = engine;

    const detachUnlockListeners = () => {
      if (removeUnlockRef.current) {
        removeUnlockRef.current();
        removeUnlockRef.current = null;
      }
    };

    const attachUnlockListeners = () => {
      detachUnlockListeners();

      const handleFirstGesture = (event) => {
        if (!isMounted || !enabledRef.current || !engineRef.current) return;

        // Let the widget's own click handler manage direct clicks on the music pill
        if (event.target && event.target.closest && event.target.closest('[data-music-control="true"]')) {
          return;
        }

        engineRef.current.start().then((started) => {
          if (started && isMounted) {
            setStatus('playing');
            detachUnlockListeners();
          }
        });
      };

      const events = ['pointerdown', 'keydown', 'touchstart', 'click'];
      events.forEach((evt) => {
        window.addEventListener(evt, handleFirstGesture, { passive: true, capture: true });
      });

      removeUnlockRef.current = () => {
        events.forEach((evt) => {
          window.removeEventListener(evt, handleFirstGesture, { capture: true });
        });
      };
    };

    if (enabledRef.current) {
      engine.start().then((started) => {
        if (!isMounted) return;
        if (started) {
          setStatus('playing');
        } else {
          setStatus('awaiting');
          attachUnlockListeners();
        }
      });
    }

    return () => {
      isMounted = false;
      detachUnlockListeners();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Close volume popover when clicking outside or pressing Escape
  useEffect(() => {
    if (!showVolume) return undefined;

    const handleOutsideClick = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setShowVolume(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowVolume(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showVolume]);

  const persistEnabled = (value) => {
    try {
      localStorage.setItem(STORAGE_ENABLED_KEY, value ? 'true' : 'false');
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  };

  const persistVolume = (value) => {
    try {
      localStorage.setItem(STORAGE_VOLUME_KEY, String(value));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  };

  const handleTogglePlay = () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (status === 'playing') {
      enabledRef.current = false;
      persistEnabled(false);
      engine.pause();
      setStatus('paused');
      return;
    }

    enabledRef.current = true;
    persistEnabled(true);

    if (removeUnlockRef.current) {
      removeUnlockRef.current();
      removeUnlockRef.current = null;
    }

    engine.start().then((started) => {
      if (started) {
        setStatus('playing');
      }
    });
  };

  const handleVolumeChange = (event) => {
    const nextVol = parseFloat(event.target.value);
    setVolume(nextVol);
    persistVolume(nextVol);

    const engine = engineRef.current;
    if (!engine) return;

    engine.setVolume(nextVol);

    if (nextVol > 0 && status !== 'playing') {
      enabledRef.current = true;
      persistEnabled(true);
      if (removeUnlockRef.current) {
        removeUnlockRef.current();
        removeUnlockRef.current = null;
      }
      engine.start().then((started) => {
        if (started) {
          setStatus('playing');
        }
      });
    }
  };

  const statusLabel =
    status === 'playing'
      ? 'Playing'
      : status === 'awaiting'
        ? 'Tap to listen'
        : 'Muted';

  const toggleAriaLabel =
    status === 'playing' ? 'Mute soothing background music' : 'Play soothing background music';

  return (
    <aside
      ref={widgetRef}
      className="ambient-music-widget"
      data-music-control="true"
      aria-label="Background music controls"
    >
      {showVolume && (
        <div className="ambient-volume-popover" role="region" aria-label="Volume control">
          <label htmlFor="ambient-volume-range" className="ambient-volume-label">
            Volume
          </label>
          <input
            id="ambient-volume-range"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="ambient-volume-slider"
            aria-label="Background music volume"
          />
          <span className="ambient-volume-pct">{Math.round(volume * 100)}%</span>
        </div>
      )}

      <div
        className={`ambient-music-pill ${
          status === 'playing'
            ? 'is-playing'
            : status === 'awaiting'
              ? 'is-awaiting'
              : 'is-paused'
        }`}
      >
        <button
          type="button"
          className="ambient-music-toggle"
          onClick={handleTogglePlay}
          aria-label={toggleAriaLabel}
          aria-pressed={status === 'playing'}
        >
          <span className="ambient-icon-disc" aria-hidden="true">
            {status === 'playing' ? (
              <span className="ambient-wave-bars">
                <span />
                <span />
                <span />
                <span />
              </span>
            ) : status === 'awaiting' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </span>

          <span className="ambient-meta">
            <span className="ambient-title">Garden Melody</span>
            <span className="ambient-status">{statusLabel}</span>
          </span>
        </button>

        <button
          type="button"
          className={`ambient-volume-btn ${showVolume ? 'active' : ''}`}
          onClick={() => setShowVolume((prev) => !prev)}
          aria-label="Adjust music volume"
          aria-expanded={showVolume}
          title="Adjust volume"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default BackgroundMusic;


import React, { useEffect, useRef, useState } from 'react';
import {
  AmbientGardenEngine,
  DEFAULT_TRACK_ID,
  MUSIC_TRACKS,
} from '@/lib/ambientMusic';
import './BackgroundMusic.css';

const STORAGE_ENABLED_KEY = 'twirl_flora_music_enabled';
const STORAGE_VOLUME_KEY = 'twirl_flora_music_volume';
const STORAGE_TRACK_KEY = 'twirl_flora_music_track';

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

function readStoredTrackId() {
  try {
    const saved = localStorage.getItem(STORAGE_TRACK_KEY);
    if (saved && MUSIC_TRACKS.some((t) => t.id === saved)) {
      return saved;
    }
    return DEFAULT_TRACK_ID;
  } catch {
    return DEFAULT_TRACK_ID;
  }
}

const BackgroundMusic = () => {
  const initialEnabled = readStoredEnabled();
  const initialVolume = readStoredVolume();
  const initialTrackId = readStoredTrackId();

  const [volume, setVolume] = useState(initialVolume);
  const [trackId, setTrackId] = useState(initialTrackId);
  const [status, setStatus] = useState(() => (initialEnabled ? 'awaiting' : 'paused'));
  const [showDrawer, setShowDrawer] = useState(false);

  const engineRef = useRef(null);
  const widgetRef = useRef(null);
  const enabledRef = useRef(initialEnabled);
  const initialVolumeRef = useRef(initialVolume);
  const initialTrackRef = useRef(initialTrackId);
  const removeUnlockRef = useRef(null);
  const attachUnlockRef = useRef(null);
  const wasInterruptedByHideRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const engine = new AmbientGardenEngine(
      initialVolumeRef.current,
      initialTrackRef.current
    );
    engineRef.current = engine;

    const detachUnlockListeners = () => {
      if (removeUnlockRef.current) {
        removeUnlockRef.current();
        removeUnlockRef.current = null;
      }
    };

    const attachUnlockListeners = () => {
      if (removeUnlockRef.current || !isMounted) return;

      const handleFirstGesture = (event) => {
        if (!isMounted || !enabledRef.current || !engineRef.current) return;

        if (engineRef.current.isPlaying) {
          setStatus('playing');
          detachUnlockListeners();
          return;
        }

        // Let the widget's own click handler manage direct clicks on the music controls
        if (event.target && event.target.closest && event.target.closest('[data-music-control="true"]')) {
          return;
        }

        engineRef.current.start({ fromUserGesture: true }).then((started) => {
          if (started && isMounted) {
            setStatus('playing');
            detachUnlockListeners();
          }
        });
      };

      const events = ['touchend', 'pointerup', 'click', 'keydown', 'touchstart'];
      events.forEach((evt) => {
        window.addEventListener(evt, handleFirstGesture, { passive: true, capture: true });
      });

      removeUnlockRef.current = () => {
        events.forEach((evt) => {
          window.removeEventListener(evt, handleFirstGesture, { capture: true });
        });
      };
    };

    attachUnlockRef.current = attachUnlockListeners;

    engine.setStateChangeHandler((nextStatus) => {
      if (!isMounted) return;
      if (nextStatus === 'awaiting' && enabledRef.current) {
        setStatus('awaiting');
        attachUnlockListeners();
      }
    });

    const handleVisibilityOrPageShow = () => {
      if (!isMounted || !engineRef.current) return;

      if (document.hidden) {
        if (engineRef.current.isPlaying) {
          wasInterruptedByHideRef.current = true;
          engineRef.current.pause();
          setStatus('awaiting');
        }
        return;
      }

      if (enabledRef.current && (wasInterruptedByHideRef.current || !engineRef.current.isPlaying)) {
        wasInterruptedByHideRef.current = false;
        attachUnlockListeners();
        engineRef.current.start({ fromUserGesture: false }).then((started) => {
          if (!isMounted) return;
          if (started) {
            setStatus('playing');
            detachUnlockListeners();
          } else {
            setStatus('awaiting');
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrPageShow);
    window.addEventListener('pageshow', handleVisibilityOrPageShow);

    if (enabledRef.current) {
      // Attach unlock listeners immediately so first mobile tap is never missed
      // while checking whether passive autoplay is permitted.
      attachUnlockListeners();
      engine.start({ fromUserGesture: false }).then((started) => {
        if (!isMounted) return;
        if (started) {
          setStatus('playing');
          detachUnlockListeners();
        } else {
          setStatus('awaiting');
        }
      });
    }

    return () => {
      isMounted = false;
      attachUnlockRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityOrPageShow);
      window.removeEventListener('pageshow', handleVisibilityOrPageShow);
      detachUnlockListeners();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Close drawer when clicking outside or pressing Escape
  useEffect(() => {
    if (!showDrawer) return undefined;

    const handleOutsideClick = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setShowDrawer(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDrawer(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showDrawer]);

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

  const persistTrackId = (nextId) => {
    try {
      localStorage.setItem(STORAGE_TRACK_KEY, nextId);
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  };

  const clearPendingUnlock = () => {
    if (removeUnlockRef.current) {
      removeUnlockRef.current();
      removeUnlockRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (status === 'playing' && engine.isPlaying) {
      wasInterruptedByHideRef.current = false;
      enabledRef.current = false;
      persistEnabled(false);
      clearPendingUnlock();
      engine.pause();
      setStatus('paused');
      return;
    }

    wasInterruptedByHideRef.current = false;
    enabledRef.current = true;
    persistEnabled(true);
    clearPendingUnlock();

    engine.start({ fromUserGesture: true }).then((started) => {
      if (started) {
        setStatus('playing');
      } else if (enabledRef.current) {
        setStatus('awaiting');
        if (attachUnlockRef.current) attachUnlockRef.current();
      }
    });
  };

  const handleSelectTrack = (nextId) => {
    setTrackId(nextId);
    persistTrackId(nextId);

    const engine = engineRef.current;
    if (!engine) return;

    wasInterruptedByHideRef.current = false;
    enabledRef.current = true;
    persistEnabled(true);
    clearPendingUnlock();

    engine.setTrack(nextId, { autoStart: true, fromUserGesture: true }).then((playing) => {
      if (playing) {
        setStatus('playing');
      } else if (enabledRef.current) {
        setStatus('awaiting');
        if (attachUnlockRef.current) attachUnlockRef.current();
      }
    });
  };

  const handleNextTrack = () => {
    const currentIdx = MUSIC_TRACKS.findIndex((t) => t.id === trackId);
    const nextIdx = (currentIdx + 1) % MUSIC_TRACKS.length;
    handleSelectTrack(MUSIC_TRACKS[nextIdx].id);
  };

  const handleVolumeChange = (event) => {
    const nextVol = parseFloat(event.target.value);
    setVolume(nextVol);
    persistVolume(nextVol);

    const engine = engineRef.current;
    if (!engine) return;

    engine.setVolume(nextVol);

    if (nextVol > 0 && (status !== 'playing' || !engine.isPlaying)) {
      wasInterruptedByHideRef.current = false;
      enabledRef.current = true;
      persistEnabled(true);
      clearPendingUnlock();
      engine.start({ fromUserGesture: true }).then((started) => {
        if (started) {
          setStatus('playing');
        } else if (enabledRef.current) {
          setStatus('awaiting');
          if (attachUnlockRef.current) attachUnlockRef.current();
        }
      });
    }
  };

  const activeIndex = Math.max(
    0,
    MUSIC_TRACKS.findIndex((t) => t.id === trackId)
  );
  const activeTrack = MUSIC_TRACKS[activeIndex] || MUSIC_TRACKS[0];

  const statusLabel =
    status === 'playing'
      ? activeTrack.subtitle
      : status === 'awaiting'
        ? 'Tap to listen'
        : 'Muted';

  const toggleAriaLabel =
    status === 'playing'
      ? `Pause ${activeTrack.title}`
      : `Play ${activeTrack.title}`;

  return (
    <aside
      ref={widgetRef}
      className="ambient-music-widget"
      data-music-control="true"
      aria-label="Background music controls"
    >
      {showDrawer && (
        <div
          className="ambient-soundscape-popover"
          role="region"
          aria-label="Soundscape tracks and volume"
        >
          <div className="ambient-popover-header">
            <span className="ambient-popover-heading">Botanical Soundscape</span>
            <span className="ambient-track-counter">
              {activeIndex + 1} / {MUSIC_TRACKS.length}
            </span>
          </div>

          <div className="ambient-track-list" role="radiogroup" aria-label="Select background track">
            {MUSIC_TRACKS.map((track) => {
              const isSelected = track.id === activeTrack.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`ambient-track-item ${isSelected ? 'is-active' : ''}`}
                  onClick={() => handleSelectTrack(track.id)}
                >
                  <span className="ambient-track-info">
                    <span className="ambient-track-name">{track.title}</span>
                    <span className="ambient-track-sub">{track.subtitle}</span>
                  </span>
                  {isSelected && (
                    <span className="ambient-track-badge" aria-hidden="true">
                      {status === 'playing' ? (
                        <span className="ambient-mini-bars">
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : (
                        <span className="ambient-active-dot" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="ambient-volume-row">
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
            <span className="ambient-title">{activeTrack.title}</span>
            <span className="ambient-status">{statusLabel}</span>
          </span>
        </button>

        <span className="ambient-pill-divider" aria-hidden="true" />

        <button
          type="button"
          className="ambient-icon-btn"
          onClick={handleNextTrack}
          aria-label="Switch to next track"
          title="Next track"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>

        <button
          type="button"
          className={`ambient-icon-btn ${showDrawer ? 'active' : ''}`}
          onClick={() => setShowDrawer((prev) => !prev)}
          aria-label="Choose track and adjust volume"
          aria-expanded={showDrawer}
          title="Tracks & volume"
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

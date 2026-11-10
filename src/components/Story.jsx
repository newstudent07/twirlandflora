import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Story.css';

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20">
    <path d="M4 10h11M11 6l4 4-4 4" />
  </svg>
);

function GardenIllustration() {
  return (
    <svg
      className="cute-404-garden garden"
      viewBox="0 0 1200 360"
      role="img"
      aria-label="A whimsical garden of flowers growing around the number 404"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <g id="cute-daisy">
          <ellipse cx="0" cy="-17" rx="8" ry="18" fill="#fffaf0" />
          <ellipse cx="0" cy="-17" rx="8" ry="18" fill="#fffaf0" transform="rotate(72)" />
          <ellipse cx="0" cy="-17" rx="8" ry="18" fill="#fffaf0" transform="rotate(144)" />
          <ellipse cx="0" cy="-17" rx="8" ry="18" fill="#fffaf0" transform="rotate(216)" />
          <ellipse cx="0" cy="-17" rx="8" ry="18" fill="#fffaf0" transform="rotate(288)" />
          <circle r="8" fill="#efb94c" />
        </g>
        <g id="cute-pink-flower">
          <path
            d="M0 0C-35-12-33-48-8-40C-3-68 30-64 28-36C58-42 69-9 39 3C57 27 31 47 8 25C-8 53-39 37-29 8C-55-5-31-31 0 0Z"
            fill="#ef8a86"
          />
          <circle r="9" fill="#f8c84e" />
        </g>
        <g id="cute-leaf">
          <path d="M0 0C4-29 25-35 36-32C35-10 20 5 0 0Z" fill="#7a925c" />
          <path d="M2-1 28-26" fill="none" stroke="#4d6847" strokeWidth="2" />
        </g>
      </defs>

      <g className="cute-404-garden__stems garden__stems" fill="none" stroke="#4d6847" strokeLinecap="round">
        <path d="M63 357C74 272 73 189 47 113" />
        <path d="M184 360C172 285 193 223 231 166" />
        <path d="M321 360C330 279 305 229 279 190" />
        <path d="M438 360C416 285 433 218 471 145" />
        <path d="M751 360C738 282 761 220 800 163" />
        <path d="M884 360C901 274 886 210 855 158" />
        <path d="M1009 360C990 280 1008 217 1054 168" />
        <path d="M1145 360C1134 282 1145 215 1176 127" />
      </g>

      <g className="cute-404-garden__leaves garden__leaves">
        <use href="#cute-leaf" transform="translate(64 281) rotate(198) scale(.8)" />
        <use href="#cute-leaf" transform="translate(73 245) rotate(10) scale(.68)" />
        <use href="#cute-leaf" transform="translate(184 302) rotate(201)" />
        <use href="#cute-leaf" transform="translate(200 258) rotate(12) scale(.72)" />
        <use href="#cute-leaf" transform="translate(321 294) rotate(197) scale(.75)" />
        <use href="#cute-leaf" transform="translate(421 286) rotate(198) scale(.8)" />
        <use href="#cute-leaf" transform="translate(439 243) rotate(6)" />
        <use href="#cute-leaf" transform="translate(747 286) rotate(197)" />
        <use href="#cute-leaf" transform="translate(765 249) rotate(8) scale(.75)" />
        <use href="#cute-leaf" transform="translate(894 278) rotate(199) scale(.75)" />
        <use href="#cute-leaf" transform="translate(1002 286) rotate(195) scale(.82)" />
        <use href="#cute-leaf" transform="translate(1024 246) rotate(9)" />
        <use href="#cute-leaf" transform="translate(1146 279) rotate(195)" />
      </g>

      <g className="cute-404-garden__flowers garden__flowers">
        <use href="#cute-daisy" transform="translate(47 109) scale(1.15)" />
        <use href="#cute-pink-flower" transform="translate(231 163) scale(.74)" />
        <use href="#cute-daisy" transform="translate(279 187) scale(.85)" />
        <use href="#cute-pink-flower" transform="translate(472 142) scale(.92)" />
        <use href="#cute-daisy" transform="translate(801 160) scale(1.05)" />
        <use href="#cute-pink-flower" transform="translate(855 154) scale(.69)" />
        <use href="#cute-daisy" transform="translate(1055 165) scale(.88)" />
        <use href="#cute-pink-flower" transform="translate(1177 124) scale(.78)" />
      </g>

      <path
        className="cute-404-garden__ground garden__ground"
        d="M0 346C146 318 239 337 348 344C474 352 554 324 680 332C813 340 878 358 1001 341C1074 331 1140 332 1200 343V360H0Z"
      />
    </svg>
  );
}

export default function Story() {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Page not found — Twirl & Flora';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <main className="cute-404-page page">
      <header className="cute-404-header header">
        <Link className="cute-404-brand brand" to="/" aria-label="Twirl and Flora, home">
          <span className="cute-404-brand__mark brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span>Twirl &amp; Flora</span>
        </Link>

        <Link className="cute-404-header__link header__link" to="/">
          Back to the garden
          <Arrow />
        </Link>
      </header>

      <section className="cute-404-hero hero">
        <p className="cute-404-eyebrow eyebrow">
          <span aria-hidden="true">✿</span>
          Error 404
          <span aria-hidden="true">✿</span>
        </p>
        <div className="cute-404-error-code error-code" aria-hidden="true">
          <span>4</span>
          <span className="cute-404-error-code__flower error-code__flower">
            <i />
          </span>
          <span>4</span>
        </div>
        <div className="cute-404-message message">
          <h1>This page hasn’t bloomed yet.</h1>
          <p>
            Looks like this little corner of the garden is still growing. Let’s wander somewhere
            lovely instead.
          </p>
          <Link className="cute-404-home-button home-button" to="/">
            Take me home
            <Arrow />
          </Link>
        </div>
      </section>

      <GardenIllustration />

      <p className="cute-404-side-note cute-404-side-note--left side-note side-note--left" aria-hidden="true">
        keep growing
      </p>
      <p className="cute-404-side-note cute-404-side-note--right side-note side-note--right" aria-hidden="true">
        find your way
      </p>
    </main>
  );
}

'use client';

import Image from 'next/image';
import {useCallback, useEffect, useState} from 'react';
import {FiChevronLeft, FiChevronRight, FiMaximize2, FiX} from 'react-icons/fi';

export type GalleryMedia = {
  kind: 'image' | 'video';
  src: string;
  alt: string;
};

export function HomeGalleries({
  fleet,
  photos,
  note,
  openLabel,
  closeLabel,
  prevLabel,
  nextLabel
}: {
  fleet: GalleryMedia[];
  photos: GalleryMedia[];
  note: string;
  openLabel: string;
  closeLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const all = [...fleet, ...photos];
  const [active, setActive] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => setClosing(true), []);
  const step = useCallback(
    (delta: number) => {
      setActive((current) => (current === null ? current : (current + delta + all.length) % all.length));
    },
    [all.length]
  );

  useEffect(() => {
    if (!closing) return;
    const id = window.setTimeout(() => {
      setActive(null);
      setClosing(false);
    }, 180);
    return () => window.clearTimeout(id);
  }, [closing]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [active, requestClose, step]);

  const current = active === null ? null : all[active];

  return (
    <>
      <div className="fleet-gallery">
        {fleet.map((media) => (
          <button
            key={media.src}
            type="button"
            className={
              media.kind === 'video'
                ? 'fleet-gallery-item fleet-gallery-wide fleet-gallery-video'
                : 'fleet-gallery-item'
            }
            aria-label={`${openLabel}: ${media.alt}`}
            onClick={() => setActive(all.indexOf(media))}
          >
            {media.kind === 'image' ? (
              <Image src={media.src} alt={media.alt} fill sizes="(max-width: 760px) 100vw, 58vw" />
            ) : (
              <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
                <source src={media.src} type="video/mp4" />
              </video>
            )}
            <span className="media-expand" aria-hidden="true">
              <FiMaximize2 />
            </span>
          </button>
        ))}
      </div>
      <p className="real-gallery-note">{note}</p>
      <div className="real-photo-grid">
        {photos.map((media) => (
          <button
            key={media.src}
            type="button"
            className="real-photo-item"
            aria-label={`${openLabel}: ${media.alt}`}
            onClick={() => setActive(all.indexOf(media))}
          >
            <Image src={media.src} alt={media.alt} fill sizes="(max-width: 760px) 50vw, 25vw" loading="lazy" />
            <span className="media-expand" aria-hidden="true">
              <FiMaximize2 />
            </span>
          </button>
        ))}
      </div>

      {current && active !== null && (
        <div className={`lightbox${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-label={current.alt}>
          <button type="button" className="lightbox-backdrop" aria-label={closeLabel} onClick={requestClose} />
          <div className="lightbox-content">
            <div className="lightbox-media">
              <div key={current.src} className="lightbox-media-inner">
                {current.kind === 'image' ? (
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    style={{objectFit: 'contain', objectPosition: 'center'}}
                  />
                ) : (
                  <video src={current.src} controls autoPlay playsInline aria-label={current.alt} />
                )}
              </div>
            </div>
            <div className="lightbox-bar">
              <div className="lightbox-nav">
                <button type="button" className="lightbox-btn" aria-label={prevLabel} onClick={() => step(-1)}>
                  <FiChevronLeft />
                </button>
                <button type="button" className="lightbox-btn" aria-label={nextLabel} onClick={() => step(1)}>
                  <FiChevronRight />
                </button>
              </div>
              <p aria-live="polite">
                {active + 1} / {all.length}
              </p>
              <button type="button" className="lightbox-btn" aria-label={closeLabel} onClick={requestClose} autoFocus>
                <FiX />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

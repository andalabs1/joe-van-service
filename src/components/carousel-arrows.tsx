'use client';

export function CarouselArrows({
  targetId,
  prevLabel,
  nextLabel,
  className = ''
}: {
  targetId: string;
  prevLabel: string;
  nextLabel: string;
  className?: string;
}) {
  const scroll = (direction: 1 | -1) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 400);
    el.scrollBy({left: direction * amount, behavior: 'smooth'});
  };

  return (
    <div className={`carousel-arrows ${className}`.trim()}>
      <button type="button" className="carousel-btn" aria-label={prevLabel} onClick={() => scroll(-1)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="carousel-btn" aria-label={nextLabel} onClick={() => scroll(1)}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

'use client';
import {useEffect, useId, useRef, useState, type PointerEvent} from 'react';
import type {TechnicalImage} from '@/data/case-studies';

type Props = {images: TechnicalImage[]; initialIndex: number; onClose: () => void};
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// Native dialog supplies modal focus containment, inert background and Escape.
// The full-resolution image is fetched only after the gallery is opened.
export default function TechnicalImageViewer({images, initialIndex, onClose}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [failed, setFailed] = useState(false);
  const pointers = useRef(new Map<number, {x: number; y: number}>());
  const asset = images[index];

  useEffect(() => {
    const modal = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    modal.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({preventScroll: true});
    };
  }, []);

  function reset() {setScale(1); setPosition({x: 0, y: 0});}
  function zoom(value: number) {
    const next = clamp(value, 1, 8);
    setScale(next);
    if (next === 1) setPosition({x: 0, y: 0});
  }
  function navigate(direction: number) {
    pointers.current.clear();
    setIndex(current => (current + direction + images.length) % images.length);
    setFailed(false);
    reset();
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {x: event.clientX, y: event.clientY});
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const next = {x: event.clientX, y: event.clientY};
    if (pointers.current.size === 2) {
      const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)![1];
      const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y);
      const distance = Math.hypot(next.x - other.x, next.y - other.y);
      if (oldDistance > 0) zoom(scale * distance / oldDistance);
    } else if (scale > 1) {
      const bounds = viewport.current!.getBoundingClientRect();
      setPosition(current => ({
        x: clamp(current.x + next.x - previous.x, -bounds.width * (scale - 1) / 2, bounds.width * (scale - 1) / 2),
        y: clamp(current.y + next.y - previous.y, -bounds.height * (scale - 1) / 2, bounds.height * (scale - 1) / 2),
      }));
    }
    pointers.current.set(event.pointerId, next);
  }

  return <dialog className="technical-lightbox" ref={dialog} aria-labelledby={titleId}
    onCancel={event => {event.preventDefault(); onClose();}}
    onClick={event => {if (event.target === event.currentTarget) onClose();}}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {event.preventDefault(); navigate(event.key === 'ArrowRight' ? 1 : -1);}
      if (event.key === '+' || event.key === '=') {event.preventDefault(); zoom(scale * 1.25);}
      if (event.key === '-') {event.preventDefault(); zoom(scale / 1.25);}
      if (event.key === '0') {event.preventDefault(); reset();}
    }}>
    <div className="technical-lightbox-shell">
      <header><div><span>TECHNICAL DOCUMENTATION · {index + 1} / {images.length}</span><h2 id={titleId}>{asset.title}</h2></div><button type="button" onClick={onClose} aria-label="Close image viewer">Close ×</button></header>
      <div className="technical-lightbox-controls" role="group" aria-label="Image controls">
        <button type="button" onClick={() => zoom(scale / 1.25)} disabled={scale <= 1} aria-label="Zoom out">−</button>
        <output aria-label="Image zoom" aria-live="polite">{Math.round(scale * 100)}%</output>
        <button type="button" onClick={() => zoom(scale * 1.25)} disabled={scale >= 8} aria-label="Zoom in">+</button>
        <button type="button" onClick={reset}>Reset zoom</button><button type="button" onClick={reset}>Fit to screen</button>
        {images.length > 1 && <><button type="button" onClick={() => navigate(-1)} aria-label="Previous image">← Previous</button><button type="button" onClick={() => navigate(1)} aria-label="Next image">Next →</button></>}
      </div>
      <div className="technical-image-viewport" ref={viewport} data-zoomed={scale > 1}
        onPointerDown={pointerDown} onPointerMove={pointerMove}
        onPointerUp={event => pointers.current.delete(event.pointerId)} onPointerCancel={event => pointers.current.delete(event.pointerId)} onLostPointerCapture={event => pointers.current.delete(event.pointerId)}>
        {failed ? <p role="status">This technical image is unavailable. Close the viewer to continue reading the documentation.</p> :
          // A native image preserves the original SVG/raster source for precise pan/zoom.
          // eslint-disable-next-line @next/next/no-img-element
          <img key={asset.src} src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} draggable={false} onError={() => setFailed(true)} style={{transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`}}/>}
      </div>
      <footer><p>{asset.caption}</p><span>Drag to pan when zoomed. Pinch or use + / − to zoom. Arrow keys switch images; Escape closes.</span></footer>
    </div>
  </dialog>;
}

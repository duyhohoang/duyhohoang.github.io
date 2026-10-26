'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import type {TechnicalImage} from '@/data/case-studies';

const TechnicalImageViewer = dynamic(() => import('./TechnicalImageViewer'), {ssr: false});

export function DocumentationPending({children}: {children: React.ReactNode}) {
  return <div className="technical-pending"><span>Documentation pending</span><p>{children}</p></div>;
}

function GalleryImage({image}: {image: TechnicalImage}) {
  const [failed, setFailed] = useState(false);
  return failed ? <span className="technical-missing-image">Image unavailable · documentation pending</span> : <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 699px) 90vw, 600px" onError={() => setFailed(true)}/>;
}

export function TechnicalGallery({images, label, viewerImages = images}: {images: TechnicalImage[]; label: string; viewerImages?: TechnicalImage[]}) {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState<number | null>(null);
  const categories = [...new Set(images.map(image => image.category))];
  const visible = filter === 'All' ? images : images.filter(image => image.category === filter);
  return <div className="technical-gallery" aria-label={label}>
    {categories.length > 1 && <div className="technical-gallery-filters" role="group" aria-label={label + ' categories'}>{['All', ...categories].map(category => <button type="button" key={category} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}</div>}
    <div className="technical-gallery-grid">{visible.map(image => <figure key={image.src}><button type="button" className="technical-image-trigger" aria-label={'Enlarge ' + image.title} onClick={() => setActive(viewerImages.findIndex(candidate => candidate.src === image.src))}><GalleryImage image={image}/><span>Enlarge ↗</span></button><figcaption><strong>{image.title}</strong><span>{image.caption}</span></figcaption></figure>)}</div>
    {active !== null && <TechnicalImageViewer images={viewerImages} initialIndex={active} onClose={() => setActive(null)}/>}
  </div>;
}

import { Navigation } from '@/components/layout/Navigation';

const images = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
  '/images/gallery-6.jpg',
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Gallery</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((src) => (
            <img key={src} src={src} alt="Coffee shop" className="h-64 w-full rounded-2xl object-cover" />
          ))}
        </div>
      </main>
    </div>
  );
}

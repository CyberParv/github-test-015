import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-900 text-white">
      <div className="absolute inset-0">
        <img
          src="/images/hero-coffee.jpg"
          alt="Fresh coffee" 
          className="h-full w-full object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 flex flex-col gap-6 p-8 md:p-16">
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">Brewed to perfection, delivered with care.</h1>
        <p className="max-w-2xl text-base text-neutral-200 md:text-lg">
          Discover artisan coffee, seasonal blends, and handcrafted pastries curated for coffee lovers.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-amber-500 text-neutral-900 hover:bg-amber-400">Order now</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">Explore menu</Button>
        </div>
      </div>
    </section>
  );
}

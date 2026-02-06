import { Navigation } from '@/components/layout/Navigation';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">About us</h1>
        <p className="text-base text-neutral-600">
          We are a community-first coffee shop committed to ethically sourced beans, handcrafted drinks, and warm hospitality.
        </p>
        <section className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Our story</h2>
            <p className="text-sm text-neutral-600">Founded by baristas and roasters, we celebrate the craft of coffee.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Hours</h2>
            <p className="text-sm text-neutral-600">Mon - Fri: 7am - 7pm</p>
            <p className="text-sm text-neutral-600">Sat - Sun: 8am - 6pm</p>
          </div>
        </section>
      </main>
    </div>
  );
}

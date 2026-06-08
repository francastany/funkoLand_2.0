import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductCollections from "@/components/Collections";
import FAQ from "@/components/FAQ";

export function Home() {
  return (
    <main className="max-w-6xl min-h-dvh mx-auto">
      <Hero />
      <FeaturedProducts />
      <ProductCollections />
      <FAQ />
    </main>
  );
}

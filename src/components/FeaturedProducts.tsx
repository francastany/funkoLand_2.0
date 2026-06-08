import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { FunkoCard } from "@/components/FunkoCard";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFunkos } from "@/hooks/useFunkos";
import { Skeleton } from "./ui/skeleton";

export default function FeaturedProducts() {
  const { funkos, loading } = useFunkos();
  const featured = funkos.filter((funko) => funko.featured);
  const items = featured.length > 4 ? featured : funkos;
  const canScroll = items.length > 4;
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  React.useEffect(() => {
    if (!api) return;
    api.reInit();
  }, [api, items.length]);

  return (
    <section className="mx-auto max-w-6xl py-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="flex max-md:flex-col max-md:gap-4 md:items-center justify-between md:mb-8">
          <h2 className="text-3xl font-thin text-gray-500">
            Productos
            <span className="text-primary font-bold italic text-3xl font-display tracking-tight">
              {" "}
              Destacados
            </span>
          </h2>
        </div>
        <Carousel
          opts={{ align: "start", loop: canScroll, skipSnaps: true }}
          plugins={canScroll ? [autoplay.current] : []}
          setApi={setApi}
          className="mt-6 mask-x-from-95% lg:mask-x-none"
          aria-label="Featured products"
        >
          <CarouselContent className="-ml-4 py-4">
            {loading
              ? Array.from({ length: 12 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <Skeleton className="w-full h-110 animate-pulse rounded-lg" />
                  </CarouselItem>
                ))
              : items.slice(0, 12).map((funko) => (
                  <CarouselItem
                    key={funko.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <FunkoCard funko={funko} />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="z-10 shadow-md" />
          <CarouselNext className="z-10 shadow-md" />
        </Carousel>

        {!loading && items.length === 0 && (
          <p className="mt-6 text-sm text-gray-600">
            No hay productos destacados por ahora.
          </p>
        )}
      </div>
    </section>
  );
}

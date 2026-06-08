import { cn } from "@/lib/utils";
import marvelCollection from "@/assets/Collections/marvel2.webp";
import musicCollection from "@/assets/Collections/music.webp";
import sportsCollection from "@/assets/Collections/sports.webp";

import { ArrowRightIcon } from "lucide-react";

const callouts = [
  {
    name: "Leyendas & Música",
    description: "Tus artistas y bandas favoritas en formato figura.",
    imageSrc: musicCollection,
    imageAlt: "Colección de figuras Funko Pop de músicos y leyendas del rock.",
    href: "/funkos?category=music",
  },
  {
    name: "Héroes & Villanos",
    description: "Colecciona los personajes más épicos de los cómics.",
    imageSrc: marvelCollection,
    imageAlt: "Colección de figuras Funko Pop de superhéroes y villanos.",
    href: "/funkos?category=heros",
  },
  {
    name: "Deportes & Cultura",
    description: "Los íconos más destacados del deporte y la cultura.",
    imageSrc: sportsCollection,
    imageAlt:
      "Colección de figuras Funko Pop de íconos deportivos y culturales.",
    href: "/funkos?category=sports",
  },
];

export default function ProductCollections() {
  return (
    <section className="mx-auto max-w-6xl py-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="flex max-md:flex-col max-md:gap-4 md:items-center justify-between md:mb-8">
          <h2 className="text-3xl font-thin text-gray-500">
            Nuestras
            <span className="text-primary font-bold italic text-3xl font-display tracking-tight">
              {" "}
              Colecciones
            </span>
          </h2>
          <a
            href="/funkos"
            className="text-sm font-semibold text-primary hover:underline italic"
          >
            Explorar Todas
            <ArrowRightIcon className="size-4 ms-1 inline" />
          </a>
        </div>

        <div className="mt-6 space-y-6 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
          {callouts.map((callout, i) => (
            <div key={callout.name} className="group relative">
              <div className="w-full relative rounded-lg bg-white object-cover max-sm:h-80 sm:aspect-2/1 lg:aspect-square overflow-hidden transition-transform duration-300 shadow-lg group-hover:shadow-2xl">
                <div className="absolute inset-0 bg-linear-30 from-primary to-transparent z-10 pointer-events-none"></div>
                <img
                  alt={callout.imageAlt}
                  src={callout.imageSrc}
                  className={cn(
                    "w-full h-full object-cover object-left transition-transform duration-300",
                    {
                      "scale-105 group-hover:scale-110": i === 0,
                      "group-hover:scale-105": i !== 0,
                    },
                  )}
                />
              </div>
              <h3 className="mt-4 mb-2 text-xl text-primary font-semibold group-hover:underline">
                <a href={callout.href} className="font-display">
                  <span className="absolute inset-0" />
                  {callout.name}
                </a>
              </h3>
              <p className="text-sm font-regular text-pretty text-gray-700 leading-tight">
                {callout.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

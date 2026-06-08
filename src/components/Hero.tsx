import { ArrowUpRight, Bell } from "lucide-react";
import HeroImage from "@/assets/Hero/heroImage_ups.webp";

export default function Hero() {
  return (
    <section className="py-8 relative w-full h-[75dvh] lg:h-[80dvh] mask-b-from-85%">
      <div className="max-w-6xl relative w-full">
        <div className="max-md:hidden inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground mb-4 max-w-full text-sm font-normal lg:mb-10 lg:py-2 lg:pl-2 lg:pr-5">
          <span className="mr-2 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Bell className="size-4 text-primary/70" />
          </span>
          <p className="truncate whitespace-nowrap">
            Novedades semanales, preventas y lanzamientos exclusivos.
          </p>
        </div>
        <h1 className="mb-6 text-[40px] font-bold tracking-tight leading-tight lg:text-7xl xl:max-w-[75%] text-pretty">
          Tu colección Funko, en un solo lugar
        </h1>
        <p className="max-w-2xl text-zinc-600 text-base md:max-w-[45ch] lg:max-w-[60ch] lg:text-lg leading-tight text-pretty">
          Chusmeá el catalogo oficial, ediciones limitadas y personajes de tus
          sagas favoritas.
          <span className="hidden md:inline">
            {" "}
            Encontrá figuras unicas para completar tu vitrina.
          </span>
        </p>
        <a
          href="/funkos"
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors border border-primary hover:bg-primary hover:text-white bg-white text-primary mt-4 rounded-md px-4 py-2.5 md:px-6 md:py-3 md:w-fit"
        >
          Ver Funkos
          <ArrowUpRight className="size-6 ms-1" />
        </a>
      </div>
      <img
        src={HeroImage}
        alt="Hero Image"
        className="absolute top-85 h-auto w-full sm:w-auto md:top-60 md:h-[65dvh] right-0 object-cover -z-10"
      />
    </section>
  );
}

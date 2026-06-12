import { Users, CloudDownload, PackageOpen, Globe } from "lucide-react";

import aboutBanner from "@/assets/About/about_banner.webp";

export function About() {
  return (
    <>
      <section className="min-h-screen">
        <div className="container mt-8 lg:mt-16 mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
          {/* Header */}
          <header className="mb-4 lg:mb-8 grid md:grid-cols-[1.75fr_1fr] grid-cols-1 items-end">
            <h1 className="text-foreground mb-2 text-2xl font-bold md:text-3xl lg:text-5xl leading-snug">
              El equipo de funkoLand
            </h1>
            <p className="text-muted-foreground max-md:mt-4 text-sm md:text-base mb-1">
              Somos un equipo apasionado por los Funkos y queremos compartir
              nuestra pasión contigo.
            </p>
          </header>
          <figure className="relative w-full h-full object-cover aspect-video border rounded-xl overflow-hidden group">
            <img
              src={aboutBanner}
              className="w-full h-full object-cover border rounded-xl group-hover:scale-105 transition-transform duration-300"
              alt=""
            />
            <div className="absolute inset-0 w-full h-full bg-linear-330 from-primary from-10% to-transparent group-hover:opacity-50 opacity-100 transition-opacity duration-300"></div>
          </figure>

          {/* Mission & Vision */}
          <section className="flex flex-col gap-4 mt-16 lg:mt-32">
            <div className="flex border-b border-secondary/30 mb-4 md:mx-6 pb-4 md:items-end justify-between max-md:flex-col">
              <h3 className="font-bold text-xl lg:text-2xl text-foreground max-md:mb-4">
                Nuestra Misión
              </h3>
              <p className="text-muted-foreground text-base text-pretty leading-relaxed md:w-2/4">
                Nuestra misión es ofrecer la mayor variedad de Funkos del
                mercado a precios competitivos, con un servicio al cliente
                excepcional.
              </p>
            </div>
            <div className="flex border-b border-secondary/30 mb-4 md:mx-6 pb-4 md:items-end justify-between max-md:flex-col">
              <h3 className="font-bold text-xl lg:text-2xl text-foreground max-md:mb-4">
                Nuestra Visión
              </h3>
              <p className="text-muted-foreground text-base text-pretty leading-relaxed md:w-2/4">
                Queremos ser la tienda de referencia para los coleccionistas de
                Funkos en Latinoamérica, ofreciendo una experiencia de compra
                única y personalizada.
              </p>
            </div>
          </section>
        </div>
      </section>
      <section className="text-muted-foreground body-font">
        <div className="container px-4 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-8">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground/90 leading-snug">
              <span className="text-primary font-display italic font-bold pe-1">
                funkoLand
              </span>{" "}
              en Números
            </h2>
            <p className="lg:w-2/3 mx-auto leading-snug text-base">
              Nos enorgullece el impacto que hemos logrado en la comunidad de
              coleccionistas. Aquí te presentamos algunos de nuestros logros.
            </p>
          </div>
          <div className="flex flex-wrap text-center">
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border border-secondary/30 px-4 py-6 rounded-lg">
                <CloudDownload className="text-primary/80 w-12 h-12 mb-3 inline-block" />
                <h2 className="mb-1 font-medium text-3xl text-foreground">
                  2.7K
                </h2>
                <p className="leading-relaxed">Descargas de Catálogo</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border border-secondary/30 px-4 py-6 rounded-lg">
                <Users className="text-primary/80 w-12 h-12 mb-3 inline-block" />
                <h2 className="mb-1 font-medium text-3xl text-foreground">
                  1.3K
                </h2>
                <p className="leading-relaxed">Coleccionistas</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border border-secondary/30 px-4 py-6 rounded-lg">
                <PackageOpen className="text-primary/80 w-12 h-12 mb-3 inline-block" />
                <h2 className="mb-1 font-medium text-3xl text-foreground">
                  74
                </h2>
                <p className="leading-relaxed">Envíos Realizados</p>
              </div>
            </div>
            <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="border border-secondary/30 px-4 py-6 rounded-lg">
                <Globe className="text-primary/80 w-12 h-12 mb-3 inline-block" />
                <h2 className="mb-1 font-medium text-3xl text-foreground">
                  46
                </h2>
                <p className="leading-relaxed">Países Alcanzados</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

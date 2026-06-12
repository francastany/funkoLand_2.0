import { Clock, MapPin, Mail, Phone } from "lucide-react";
import contactImage from "@/assets/Contact/Contact.webp";

export function Contact() {
  return (
    <section className="">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        {/* Header */}
        <header className="mb-4 sm:mb-8 lg:mb-16">
          <h2 className="text-foreground mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">
            Contacto
          </h2>
          <p className="text-muted-foreground text-base italic">
            Dejanos un mensaje y te responderemos a la brevedad.
          </p>
        </header>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Image Section */}
          <figure className="rounded-lg overflow-hidden shadow-sm">
            <img
              src={contactImage}
              alt="Ilustración de contacto de FunkoLand"
              className="size-full object-cover object-center hover:scale-105 hover:rotate-3 transition-transform duration-300 ease-in-out"
            />
          </figure>

          {/* Contact Info Section */}
          <section aria-labelledby="contact-info-heading">
            <h3
              id="contact-info-heading"
              className="text-foreground mb-4 text-2xl font-semibold"
            >
              ¡Estamos para ayudarte!
            </h3>
            <p className="text-muted-foreground mb-10 text-base">
              ¿Tenés alguna consulta sobre tu pedido, un producto o necesitás
              asesoramiento para tu colección? Escribinos o llamanos, nuestro
              equipo está listo para ayudarte.
            </p>

            {/* Contact Info Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Horario de Atención */}
              <article className="rounded-lg bg-card p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full border border-primary/20">
                    <Clock className="text-primary size-5" />
                  </div>
                  <h4 className="text-foreground text-base font-medium text-center">
                    Horario de Atención
                  </h4>
                  <div className="text-center">
                    <p className="text-muted-foreground">Lunes a Viernes</p>
                    <p className="text-muted-foreground">10:00 am a 8:00 pm</p>
                  </div>
                </div>
              </article>

              {/* Nuestra Dirección */}
              <article className="rounded-lg bg-card p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full border border-primary/20">
                    <MapPin className="text-primary size-5" />
                  </div>
                  <h4 className="text-foreground text-base font-medium">
                    Nuestra Dirección
                  </h4>
                  <address className="text-muted-foreground text-center not-italic">
                    Av. Santa Fe 1234, Piso 2
                    <br />
                    Buenos Aires, Argentina
                  </address>
                </div>
              </article>

              {/* Email */}
              <article className="rounded-lg bg-card p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full border border-primary/20">
                    <Mail className="text-primary size-5" />
                  </div>
                  <h4 className="text-foreground text-base font-medium">
                    Email
                  </h4>
                  <div className="text-center">
                    <a
                      href="mailto:info@funkoland.com"
                      className="text-muted-foreground underline-offset-4 hover:underline"
                    >
                      info@funkoland.com
                    </a>
                  </div>
                </div>
              </article>

              {/* Teléfono */}
              <article className="rounded-lg bg-card p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full border border-primary/20">
                    <Phone className="text-primary size-5" />
                  </div>
                  <h4 className="text-foreground text-base font-medium">
                    Teléfono
                  </h4>
                  <div className="text-center">
                    <a
                      href="tel:+1800FUNKOS"
                      className="text-muted-foreground underline-offset-4 hover:underline"
                    >
                      +1 800-FUNKOS
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

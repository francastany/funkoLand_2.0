import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type InfoSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

const INFO_SECTIONS: InfoSection[] = [
  {
    id: "terms",
    title: "Términos y Condiciones",
    paragraphs: [
      "Al acceder y comprar en funkoLand aceptás estos términos y condiciones en su totalidad. Si no estás de acuerdo con alguno de ellos, te pedimos que no utilices nuestro sitio.",
      "Todos los productos publicados están sujetos a disponibilidad de stock. Nos reservamos el derecho de limitar la cantidad de unidades por pedido y de cancelar compras en caso de error en el precio o la descripción de un producto.",
      "Los precios pueden modificarse sin previo aviso. El precio vigente es el que figura en el sitio al momento de confirmar la compra.",
    ],
  },
  {
    id: "privacy",
    title: "Política de Privacidad",
    paragraphs: [
      "En funkoLand respetamos tu privacidad. Los datos personales que nos brindás (nombre, dirección, email, teléfono) se utilizan exclusivamente para procesar tus pedidos y mejorar tu experiencia de compra.",
      "No compartimos, vendemos ni cedemos tu información a terceros, salvo que sea necesario para completar el envío de tu pedido (por ejemplo, con empresas de logística).",
      "Podés solicitar en cualquier momento la actualización o eliminación de tus datos personales escribiéndonos a través de nuestra página de contacto.",
    ],
  },
  {
    id: "shipping",
    title: "Política de Envíos",
    paragraphs: [
      "Realizamos envíos a todo el país. Los tiempos de entrega estimados son de 2 a 5 días hábiles para zonas urbanas y de 5 a 10 días hábiles para el resto del territorio.",
      "El costo de envío se calcula en base a tu ubicación y se muestra antes de confirmar la compra. Una vez despachado el pedido, vas a recibir un código de seguimiento por email.",
      "funkoLand no se responsabiliza por demoras ocasionadas por el correo o la empresa de logística una vez que el paquete fue despachado.",
    ],
  },
  {
    id: "refund",
    title: "Política de Reembolsos",
    paragraphs: [
      "Si tu Funko llega dañado o no corresponde con lo pedido, tenés 10 días corridos desde la recepción para solicitar un cambio o reembolso.",
      "El producto debe devolverse en su empaque original, sin uso y con todos sus accesorios. Los gastos de envío de la devolución corren por cuenta de funkoLand cuando el error es nuestro.",
      "Una vez recibido y verificado el producto devuelto, procesamos el reembolso dentro de los 5 días hábiles al mismo medio de pago utilizado en la compra.",
    ],
  },
];

export function Information() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(hash.replace("#", ""));
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <section className="min-h-screen">
      <div className="container mt-8 lg:mt-16 mx-auto px-4 sm:px-6 lg:px-8 xl:px-0">
        <header className="mb-4 lg:mb-8">
          <h1 className="text-foreground mb-2 text-2xl font-bold md:text-3xl lg:text-5xl leading-snug">
            Información
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Todo lo que necesitás saber antes de comprar en funkoLand.
          </p>
        </header>

        <div className="flex flex-col gap-4 mt-16 lg:mt-24">
          {INFO_SECTIONS.map(({ id, title, paragraphs }) => (
            <div
              key={id}
              id={id}
              className="border-b border-secondary/30 mb-4 md:mx-6 pb-8 scroll-mt-24"
            >
              <h3 className="font-bold text-xl lg:text-2xl text-foreground mb-4">
                {title}
              </h3>
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-muted-foreground text-base text-pretty leading-relaxed md:w-3/4"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

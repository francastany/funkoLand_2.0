import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQs = {
  question: string;
  answer: string;
}[];

const faqItems = [
  {
    question: "¿Qué categorias de Funkos puedo encontrar?",
    answer:
      "Tenemos colecciones de peliculas, deportes, iconos y heroes, ademas del catalogo completo. Usa los filtros para explorar tu categoria favorita.",
  },
  {
    question: "¿Los productos son originales?",
    answer:
      "Si, trabajamos con distribuidores oficiales para ofrecer Funkos autenticos y con empaque sellado.",
  },
  {
    question: "¿Cada cuánto se actualiza el catalogo?",
    answer:
      "Agregamos nuevos lanzamientos y reposiciones semanalmente. Si buscas una figura especifica, revisa la seccion de novedades.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Si, enviamos a todo el país con opciones estandar y express. El costo y el tiempo de entrega se calculan en el checkout.",
  },
];

const FAQ = ({ faqItems }: { faqItems: FAQs }) => {
  return (
    <section className="py-8 mt-8">
      <hr className="border-primary/30 md:hidden mb-8" />
      <div className="mx-auto max-w-6xl sm:px-6 xl:px-0">
        {/* FAQ Header */}
        <div className="mb-8 text-start md:mb-8">
          <h2 className="leading-relaxed md:leading-normal text-xl md:text-3xl font-thin text-gray-700">
            ¿Necesitás ayuda?
            <span className="text-2xl md:text-3xl text-primary/90 font-bold italic font-display tracking-tight">
              {" "}
              <br className="md:hidden" />
              Tenemos Respuestas.
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-tight max-w-[75ch] text-balance">
            Explorá nuestras preguntas más frecuentes y encuentra la información
            que necesitas.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className="border-b pb-4"
            >
              <AccordionTrigger className="text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base md:ms-4 max-w-[75ch] text-pretty h-auto">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const FAQPage = () => {
  return <FAQ faqItems={faqItems} />;
};

export default FAQPage;

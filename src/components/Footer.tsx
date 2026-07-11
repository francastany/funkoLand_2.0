import { Fragment } from "react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type FooterLink = {
  text: string;
  link: string;
};

type FooterLinksSectionData = {
  title: string;
  items: FooterLink[];
};

interface FooterLinksSectionProps {
  sections: FooterLinksSectionData[];
}

interface FooterProps {
  // newsletter?: NewsletterData;
  footerLinks?: FooterLinksSectionData[];
  className?: string;
}

const FOOTER_LINKS: FooterLinksSectionData[] = [
  {
    title: "Información",
    items: [
      {
        text: "Términos y Condiciones",
        link: "/information#terms",
      },
      {
        text: "Política de Privacidad",
        link: "/information#privacy",
      },
      {
        text: "Política de Envíos",
        link: "/information#shipping",
      },
      {
        text: "Política de Reembolsos",
        link: "/information#refund",
      },
    ],
  },
  {
    title: "Categorías",
    items: [
      {
        text: "Movies",
        link: "/funkos?category=movies",
      },
      {
        text: "Sports",
        link: "/funkos?category=sports",
      },
      {
        text: "Icons",
        link: "/funkos?category=icons",
      },
      {
        text: "Heroes",
        link: "/funkos?category=heroes",
      },
    ],
  },
];

const Footer = ({
  // newsletter = NEWSLETTER_DATA,
  footerLinks = FOOTER_LINKS,
  className,
}: FooterProps) => {
  return (
    <section
      className={cn(
        "py-4 mt-16 pt-12 px-6 xl:px-0 max-w-6xl w-full mx-auto border-t",
        className,
      )}
    >
      <div className="space-y-10">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {/* <div>
            <NewsletterSection {...newsletter} />
          </div> */}
          <FooterLinksSection sections={footerLinks} />
          <BrandSection />
        </div>
        <Separator className="" />
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-muted-foreground max-md:text-xs">
            Copyright © 2026 FunkoLand
          </p>
        </div>
      </div>
    </section>
  );
};

const FooterLinksSection = ({ sections }: FooterLinksSectionProps) => {
  return (
    <Fragment>
      {sections.map(({ title, items }) => (
        <div key={title}>
          <h2 className="mb-6 text-sm leading-tight font-medium text-muted-foreground uppercase">
            {title}
          </h2>
          <ul className="space-y-3">
            {items.map(({ text, link }) => (
              <li key={text}>
                <a href={link} className="underline-offset-4 hover:underline">
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Fragment>
  );
};

const BrandSection = () => {
  return (
    <div className="self-end">
      <span className="text-primary font-display italic font-bold text-2xl">
        funkoLand
      </span>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
        Tu colección Funko,
        <span className="font-semibold italic"> en un solo lugar.</span>
      </p>
    </div>
  );
};

export { Footer };

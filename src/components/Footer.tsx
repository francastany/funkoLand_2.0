import type { LucideIcon } from "lucide-react";
import { Clock, MapPin, Phone } from "lucide-react";
import { Fragment } from "react";

import { Button } from "@/components/ui/button";

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

type SocialIcon = {
  title: string;
  src: string;
  className?: string;
};

type SocialLink = {
  link: string;
  icon: SocialIcon;
};

type ContactLink = {
  icon: LucideIcon;
  text: string;
  type: LinkTypes;
  link?: string;
};

type ContactLinks = {
  contactDetails: ContactLink[];
  socialMedia: SocialLink[];
};

interface ContactSectionProps {
  links: ContactLinks;
}

interface FooterProps {
  // newsletter?: NewsletterData;
  footerLinks?: FooterLinksSectionData[];
  contactLinks?: ContactLinks;
  className?: string;
}

const LINK_TYPES = {
  NO_LINK: "NO_LINK",
  PHONE_LINK: "PHONE_LINK",
  EMAIL_LINK: "EMAIL_LINK",
};

type LinkTypes = keyof typeof LINK_TYPES;

const FOOTER_LINKS: FooterLinksSectionData[] = [
  {
    title: "Information",
    items: [
      {
        text: "Terms and Conditions",
        link: "#",
      },
      {
        text: "Privacy Policy",
        link: "#",
      },
      {
        text: "Shipping Policy",
        link: "#",
      },
      {
        text: "Refund Policy",
        link: "#",
      },
    ],
  },
  {
    title: "Categories",
    items: [
      {
        text: "Pop! Animation",
        link: "#",
      },
      {
        text: "Pop! Marvel",
        link: "#",
      },
      {
        text: "Pop! Star Wars",
        link: "#",
      },
      {
        text: "Exclusives",
        link: "#",
      },
    ],
  },
];

const SOCIAL_ICONS = {
  facebook: {
    title: "Facebook",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/facebook-icon.svg",
  },
  x: {
    title: "X",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/x.svg",
    className: "dark:invert",
  },
  instagram: {
    title: "Instagram",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/instagram-icon.svg",
  },
};

const CONTACT_LINKS: ContactLinks = {
  contactDetails: [
    {
      icon: MapPin,
      text: "info@funkoland.com",
      link: "info@funkoland.com",
      type: LINK_TYPES.EMAIL_LINK as LinkTypes,
    },
    {
      icon: Phone,
      text: "+1 800-FUNKOS",
      link: "+1 800-FUNKOS",
      type: LINK_TYPES.PHONE_LINK as LinkTypes,
    },
    {
      icon: Clock,
      text: "Mon - Fri, 10 am - 8 pm",
      type: LINK_TYPES.NO_LINK as LinkTypes,
    },
  ],
  socialMedia: [
    {
      icon: SOCIAL_ICONS.facebook,
      link: "#",
    },
    {
      icon: SOCIAL_ICONS.x,
      link: "#",
    },
    {
      icon: SOCIAL_ICONS.instagram,
      link: "#",
    },
  ],
};

const Footer = ({
  // newsletter = NEWSLETTER_DATA,
  footerLinks = FOOTER_LINKS,
  contactLinks = CONTACT_LINKS,
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
          <ContactSection links={contactLinks} />
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

const ContactSection = ({ links }: ContactSectionProps) => {
  const { socialMedia, contactDetails } = links;

  return (
    <div>
      <h2 className="mb-6 text-sm leading-tight font-medium text-muted-foreground uppercase">
        Contact
      </h2>
      <div className="space-y-6">
        <ul className="space-y-3">
          {contactDetails.map((item) => (
            <li className="flex items-center gap-3" key={item.text}>
              <item.icon className="size-4 shrink-0 basis-4" />
              <div className="flex-1">
                {item.type === LINK_TYPES.NO_LINK ? (
                  <p>{item.text}</p>
                ) : (
                  <a
                    href={
                      item.type === "EMAIL_LINK"
                        ? `mailto:${item.link}`
                        : `tel:${item.link}`
                    }
                    className="underline-offset-4 hover:underline"
                  >
                    {item.text}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-3">
          {socialMedia.map(({ icon, link }) => (
            <li key={icon.title}>
              <Button size="icon-lg" variant="outline" asChild>
                <a href={link}>
                  <img
                    className={cn("size-5", icon.className)}
                    alt={icon.title}
                    src={icon.src}
                  />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export { Footer };

import type { LucideIcon } from "lucide-react";
import { Gift, Package, RefreshCw, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type incentive = {
  title: string;
  icon: LucideIcon;
  text: string;
  id: string;
};

interface IncentivesProps {
  incentives?: incentive[];
  className?: string;
}

const INCENTIVES: incentive[] = [
  {
    id: "1",
    title: "Embalaje Seguro",
    text: "Máxima protección para coleccionistas.",
    icon: Package,
  },
  {
    id: "2",
    title: "Cambios y Devoluciones",
    text: "30 días para resolver cualquier problema.",
    icon: RefreshCw,
  },
  {
    id: "3",
    title: "100% Originales",
    text: "Garantía de autenticidad en todo nuestro catálogo.",
    icon: ShieldCheck,
  },
  {
    id: "4",
    title: "Ediciones y Regalos",
    text: "Funkos exclusivos y sorpresas con tu compra.",
    icon: Gift,
  },
];

const Incentives = ({
  incentives = INCENTIVES,
  className,
}: IncentivesProps) => {
  return (
    <section className={cn("py-4", className)}>
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {incentives?.map(({ title, icon: Icon, text, id }) => (
            <div key={id} className="flex items-center gap-2">
              <div className="shrink-0 group">
                <div className="flex size-10 place-content-center place-items-center rounded-full border border-primary text-primary hover:bg-primary bg-white hover:text-primary-foreground transition-colors transition-duration-500">
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1">{title}</h3>
                <p className="text-xs">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Incentives };

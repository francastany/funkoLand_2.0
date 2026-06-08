import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useFunkos } from "@/hooks/useFunkos";
import { ProductDetail } from "@/components/ProductDetail";
import { Skeleton } from "@/components/ui/skeleton";
import type { Funko } from "@/types";

type FunkoDetailProps = {
  idOverride?: number;
};

const FunkoDetailSkeleton = () => {
  return (
    <section className="pb-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="grid gap-4 md:grid-cols-3 xl:gap-5">
              <Skeleton className="aspect-square w-full rounded-lg md:col-span-3" />
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-10 w-3/4" />
                  <div className="flex flex-wrap items-center gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-12 w-28 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full max-w-[36ch]" />
                <Skeleton className="h-4 w-4/5 max-w-[32ch]" />
              </div>
            </div>

            <div>
              <Skeleton className="mb-4 h-5 w-40" />
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b py-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center justify-between border-b py-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-44" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export function FunkoDetail({ idOverride }: FunkoDetailProps) {
  const { id, slug } = useParams();
  const rawId = idOverride ?? Number(id ?? slug);
  const parsedId = useMemo(() => rawId, [rawId]);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  const { getFunkoById, error } = useFunkos();
  const [loading, setLoading] = useState(false);
  const [funko, setFunko] = useState<Funko | null>(null);

  useEffect(() => {
    let active = true;

    if (!isValidId) {
      setFunko(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      const data = await getFunkoById(parsedId);
      if (active) {
        setFunko(data);
        setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [getFunkoById, isValidId, parsedId]);

  if (!isValidId) {
    return <p>El ID del funko no es valido.</p>;
  }

  if (loading) {
    return <FunkoDetailSkeleton />;
  }

  if (error) {
    return <p>Error al cargar el funko: {error}</p>;
  }

  if (!funko) {
    return <p>No se encontro el funko solicitado.</p>;
  }

  return <ProductDetail funko={funko} />;
}

import { CircleCheck, CircleX, Heart, ShoppingCart, Star, StarHalf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { Funko } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Incentives } from "@/components/ui/incentives";
import sentenceCase from "@/utils/utils";
import { Button } from "./ui/button";
import QuantityInput from "@/components/quantity-input";
import { useCartContext } from "@/hooks/useCart";
import { useAuthContext } from "@/hooks/useAuth";
import { useWishlistContext } from "@/hooks/useWishlist";

interface ProductImagesProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
}

interface ReviewsProps {
  rate: number;
  totalReviewers: string;
}

interface PriceProps {
  value?: number | null;
  currency?: string;
}

interface ProductInfoProps {
  info?: Array<{
    label: string;
    value: string;
  }>;
}

interface ProductDetailProps {
  className?: string;
  funko: Funko;
}

const MAX_STARS = 5;
const PLACEHOLDER_IMAGE = "https://placehold.co/500x500";
const HARD_CODED_REVIEWS = {
  rate: 4.4,
  totalReviewers: "128",
};

const ProductDetail = ({ className, funko }: ProductDetailProps) => {
  const { addItem, isInCart, items, updateQuantity, removeItem } = useCartContext();
  const { user } = useAuthContext();
  const { isInWishlist, toggleWishlist } = useWishlistContext();
  const navigate = useNavigate();
  const wishlisted = isInWishlist(funko.id);

  const images = funko.imgSrc.map((img, index) => {
    return {
      src: img || PLACEHOLDER_IMAGE,
      alt: `${funko.name} | Foto ${index + 1}`,
    };
  });
  const isInStock = (funko.stock ?? 0) > 0;

  return (
    <section className={cn("pb-4", className)}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="col-span-2 order-2 md:order-1 space-y-8 pt-8 h-full">
            <header>
              <div className="flex justify-between items-start">
                <h1 className="text-4xl leading-snug grow font-bold tracking-tight lg:text-5xl">
                  {funko.name}
                </h1>
                <Price value={funko.price} currency="USD" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Badge
                  variant={isInStock ? "default" : "destructive"}
                  className="cursor-default flex items-center"
                >
                  {isInStock ? (
                    <>
                      <CircleCheck />
                      <span className="text-white">En Stock</span>
                    </>
                  ) : (
                    <>
                      <CircleX />
                      <span>Sin Stock</span>
                    </>
                  )}
                </Badge>
                <Reviews
                  rate={HARD_CODED_REVIEWS.rate}
                  totalReviewers={HARD_CODED_REVIEWS.totalReviewers}
                />
              </div>
            </header>

            <p className=" text-muted-foreground max-w-[40ch] text-pretty">
              {funko.description ?? "Descripción no disponible."}
            </p>

            <div className="w-full flex flex-col md:flex-row items-center gap-2 md:gap-4 *:py-5">
              {isInCart(funko.id) ? (
                <div className="flex items-center gap-3">
                  <ShoppingCart className="size-4 text-primary shrink-0" />
                  <QuantityInput
                    className="max-w-36"
                    min={0}
                    max={funko.stock ?? 99}
                    inputProps={{ value: items.find((i) => i.id === funko.id)?.quantity ?? 1 }}
                    onValueChange={(qty) => {
                      if (qty <= 0) {
                        removeItem(funko.id);
                        toast.info("Eliminado del carrito", { description: funko.name });
                      } else {
                        updateQuantity(funko.id, qty);
                      }
                    }}
                  />
                </div>
              ) : (
                <Button
                  onClick={() => {
                    addItem({
                      id: funko.id,
                      name: funko.name,
                      image: funko.imgSrc?.[0],
                      price: funko.price,
                    });
                    toast.success("Agregado al carrito", {
                      description: funko.name,
                    });
                  }}
                  variant="default"
                  size="lg"
                  disabled={!isInStock}
                  className="hover:opacity-75 transition-opacity duration-200"
                >
                  Agregar al Carrito
                </Button>
              )}
              <Button
                variant={wishlisted ? "default" : "outline"}
                size="lg"
                className={cn(
                  "gap-2",
                  wishlisted && "bg-red-500 hover:bg-red-600 border-red-500",
                )}
                onClick={() => {
                  if (!user) {
                    toast.info("Iniciá sesión para agregar favoritos");
                    navigate("/login");
                    return;
                  }
                  toggleWishlist(funko.id)
                    .then(() => {
                      toast.success(
                        wishlisted
                          ? "Eliminado de favoritos"
                          : "Agregado a favoritos",
                        {
                          description: funko.name,
                          icon: (
                            <Heart
                              className={cn(
                                "size-4",
                                !wishlisted && "fill-red-500 text-red-500",
                              )}
                            />
                          ),
                        },
                      );
                    })
                    .catch(() => {
                      toast.error("Error al actualizar favoritos");
                    });
                }}
              >
                <Heart className={cn("size-4", wishlisted && "fill-current")} />
                {wishlisted ? "En Favoritos" : "Añadir a Favoritos"}
              </Button>
            </div>

            <ProductInfo
              info={[
                {
                  label: "Categoría",
                  value: sentenceCase(funko.category ?? "No disponible"),
                },
                {
                  label: "Unidades disponibles",
                  value: isInStock ? String(funko.stock ?? 0) : "Sin stock",
                },
              ]}
            />

            <Incentives />
          </div>
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <ProductImages images={images} />
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductInfo = ({ info }: ProductInfoProps) => {
  if (!info?.length) return null;
  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">Detalles del Producto</h2>
      <dl>
        {info.map((item, index) => (
          <div
            key={`product-detail-1-info-${index}`}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <dt className="text-sm font-medium text-muted-foreground">
              {item.label}
            </dt>
            <dd className="text-sm font-medium italic">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const ProductImages = ({ images }: ProductImagesProps) => {
  return (
    <Carousel
      opts={{
        breakpoints: {
          "(min-width: 768px)": {
            active: false,
          },
        },
        align: "start",
        loop: true,
        skipSnaps: true,
      }}
    >
      <CarouselContent className="gap-3 md:m-0 md:grid md:grid-cols-3">
        {images.map((img, index) => (
          <CarouselItem
            className="first:col-span-3 md:p-0"
            key={`product-detail-1-image-${index}`}
          >
            <AspectRatio ratio={1} className="overflow-hidden rounded-lg">
              <img
                src={img.src}
                alt={img.alt}
                className="block size-full object-cover object-center lg:hover:scale-105 transition-transform duration-500"
              />
            </AspectRatio>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="md:hidden">
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </div>
    </Carousel>
  );
};

const Reviews = ({ rate, totalReviewers }: ReviewsProps) => {
  const renderStars = () => {
    const fullStars = Math.floor(rate);
    const hasHalfStar = rate % 1 >= 0.5;
    const emptyStars = MAX_STARS - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`product-detail-1-star-full-${i}`}
          className="size-4 fill-yellow-500 stroke-yellow-500"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="product-detail-1-half-star" className="relative size-4">
          <StarHalf className="absolute top-0 right-0 size-full fill-yellow-500 stroke-yellow-500" />
          <StarHalf className="absolute top-0 left-0 size-full -scale-x-100 fill-black/15 stroke-black/15 dark:invert" />
        </div>,
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`product-detail-1-star-empty-${i}`}
          className="size-4 fill-black/15 stroke-black/15 dark:invert"
        />,
      );
    }

    return stars;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">{renderStars()}</div>
      {totalReviewers && (
        <p className="text-base leading-none font-medium whitespace-nowrap text-muted-foreground">
          {totalReviewers} Calificaciones
        </p>
      )}
    </div>
  );
};
const Price = ({ value, currency = "USD" }: PriceProps) => {
  if (value == null) {
    return (
      <span className="text-right text-2xl font-bold text-muted-foreground">
        Precio no disponible
      </span>
    );
  }

  const formatCurrency = (
    value: number,
    currency: string,
    locale: string = "en-US",
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  };

  return (
    <span className="text-right text-3xl text-muted-foreground bg-muted font-bold p-2 rounded-lg">
      {formatCurrency(value, currency)}
    </span>
  );
};

export { ProductDetail };

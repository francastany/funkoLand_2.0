import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Funko } from "@/types";
import { useCartContext } from "@/hooks/useCart";

const categoryColors: Record<string, string> = {
  /*   
  Marvel: "bg-red-400",
  "Star Wars": "bg-yellow-400",
  DC: "bg-blue-400",
  Disney: "bg-sky-300",
  Anime: "bg-green-400",
  "Harry Potter": "bg-amber-500",
  Gaming: "bg-purple-400", 
  */
  movies: "bg-orange-100",
  icons: "bg-pink-100",
  sports: "bg-indigo-100",
  disney: "bg-fuchsia-100",
  heroes: "bg-sky-100",
};

const getCategoryColor = (category?: string | null) => {
  if (!category) return "bg-gray-200";
  return categoryColors[category] || "bg-primary";
};

export function FunkoCard({
  className,
  funko,
  onSelect,
  onCategorySelect,
}: {
  className?: string;
  funko: Funko;
  onSelect?: (funko: Funko) => void;
  onCategorySelect?: (category: string) => void;
}) {
  const navigate = useNavigate();
  const { addItem, isInCart, removeItem } = useCartContext();
  const priceLabel =
    funko.price != null ? `$${funko.price.toFixed(2)}` : "Price unavailable";
  const imageSrc = funko.imgSrc?.[0] ?? "https://placehold.co/500x500";
  const categorySlug = funko.category?.trim().toLowerCase();
  const categoryLabel = funko.category
    ? funko.category.slice(0, 1).toUpperCase() +
      funko.category.slice(1).toLowerCase()
    : null;
  const isAlreadyInCart = isInCart(funko.id);

  return (
    <article
      className={cn("max-w-sm group cursor-pointer", className)}
      role="link"
      tabIndex={0}
      onClick={() => {
        if (onSelect) {
          onSelect(funko);
          return;
        }
        navigate(`/funkos/${funko.id}`);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (onSelect) {
            onSelect(funko);
            return;
          }
          navigate(`/funkos/${funko.id}`);
        }
      }}
    >
      <div className="relative rounded-xl block overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            alert("Added to wishlist!");
          }}
          className="absolute inset-e-4 top-4 z-10 rounded-full bg-white p-2 text-gray-900 hover:text-secondary transition"
        >
          <span className="sr-only">Añadir a favoritos</span>
          <Heart className="size-4" />
        </button>

        <img
          src={imageSrc}
          alt={funko.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64"
        />

        <div className="relative border border-gray-100 bg-white p-4">
          {funko.category && categorySlug && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (onCategorySelect) {
                  onCategorySelect(categorySlug);
                  return;
                }
                navigate(`/funkos/${categorySlug}`);
              }}
              className={cn(
                "px-2 py-1.5 text-xs rounded-xs italic font-medium whitespace-nowrap hover:opacity-70 transition",
                getCategoryColor(funko.category),
              )}
            >
              {categoryLabel}
            </button>
          )}

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {funko.name}
          </h3>

          <p className="mt-1.5 text-base font-semibold text-gray-700">
            {priceLabel}
          </p>

          <form className="mt-4">
            <button
              type="button"
              disabled={isAlreadyInCart}
              onClick={(e) => {
                e.stopPropagation();
                if (funko.price == null) return;
                if (isAlreadyInCart) return;
                addItem({
                  id: funko.id,
                  name: funko.name,
                  image: funko.imgSrc?.[0],
                  price: funko.price,
                  details: categoryLabel
                    ? `Category: ${categoryLabel}`
                    : undefined,
                });
                toast.success("Agregado al carrito", {
                  description: funko.name,
                  icon: <ShoppingCart className="size-4 text-primary" />,
                  action: {
                    label: "Deshacer",
                    onClick: () => removeItem(funko.id),
                  },
                });
              }}
              className={cn(
                "block w-full rounded-sm border p-2 text-sm font-medium transition-all",
                isAlreadyInCart
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500"
                  : "border-primary bg-primary text-white hover:bg-white hover:text-primary",
              )}
            >
              {/* <ShoppingCart className="size-4 ml-2" /> */}
              {isAlreadyInCart ? "En el Carrito" : "Añadir al Carrito"}
            </button>
          </form>
        </div>
      </div>
    </article>
  );

  {
    /*  
    <article className={cn("max-w-sm p-4 rounded-2xl bg-white", className)}>
      <div className="text-start mb-4">
        <a href="#">
          <img
            src={imageSrc}
            alt={funko.name}
            className="mb-2 border w-full aspect-square object-cover"
          />
          <h3 className="text-xl font-semibold">{funko.name}</h3>
        </a>

        <div className="flex justify-center gap-2">
          {funko.category && (
            <span className="badge badge-soft badge-success">
              {funko.category}
            </span>
          )}
          <span className="badge badge-soft badge-success">Funko</span>
        </div>

        <hr className="border-stone-800/20 w-[90%] mx-auto dark:border-white"></hr>

        <div className="flex items-center justify-between">
          <span className="text-base-content text-xl font-semibold">
            {priceLabel}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="btn btn-circle btn-text btn-secondary"
              aria-label="Add to favorites"
              type="button"
            >
              <Heart className="size-5.5 shrink-0" />
            </button>
            <button
              className="btn btn-circle btn-text btn-secondary"
              aria-label="Add to cart"
              type="button"
            >
              <ShoppingCart className="size-5.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </article>
    */
  }
}

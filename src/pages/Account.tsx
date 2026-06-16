import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Save,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBag,
  CalendarDays,
  Hash,
  Heart,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Price, PriceValue } from "@/components/price";
import { useAuthContext } from "@/hooks/useAuth";
import { useWishlistContext } from "@/hooks/useWishlist";
import { fetchProfile, updateProfile } from "@/services/profile.service";
import { fetchOrdersByUser } from "@/services/order.service";
import { fetchWishlistWithFunkos } from "@/services/wishlist.service";
import type { Profile, Order, CartItem, Funko } from "@/types";

export function Account() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthContext();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistFunkos, setWishlistFunkos] = useState<Funko[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { removeFromWishlist } = useWishlistContext();

  // Form state
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Guard to prevent re-fetching on auth state re-fires
  const fetchedRef = useRef(false);

  // Load profile and orders (runs once)
  useEffect(() => {
    if (!user || fetchedRef.current) return;
    fetchedRef.current = true;

    fetchProfile(user.id)
      .then((p) => {
        setProfile(p);
        setForm({
          full_name: p.full_name || "",
          phone: p.phone || "",
          address: p.address || "",
          city: p.city || "",
          country: p.country || "",
          postal_code: p.postal_code || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoadingProfile(false));

    fetchOrdersByUser(user.id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoadingOrders(false));

    fetchWishlistWithFunkos(user.id)
      .then(setWishlistFunkos)
      .catch(console.error)
      .finally(() => setLoadingWishlist(false));
  }, [user]);

  const handleField =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, form);
      setProfile(updated);
      toast.success("Perfil actualizado", {
        description: "Tus datos se guardaron correctamente.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al guardar", { description: message });
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getOrderItems(order: Order): CartItem[] {
    try {
      return order.items as unknown as CartItem[];
    } catch {
      return [];
    }
  }

  if (authLoading) {
    return (
      <section className="mx-auto max-w-4xl pb-16 pt-6">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="mx-auto max-w-7xl pb-16 pt-6">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-4xl max-md:leading-snug font-bold tracking-tight">
          Mi Cuenta
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gestioná tu información personal y revisá tu historial de pedidos.
        </p>
      </header>

      <div className="grid gap-8">
        {/* ──────────────────── Profile Section ──────────────────── */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          {/* Profile Header Gradient */}
          <div className="relative h-28 bg-linear-to-br from-primary/90 via-primary/70 to-primary/50">
            <div className="absolute -bottom-10 left-6">
              <Avatar className="size-20 border-4 border-white shadow-lg">
                <AvatarImage
                  src={
                    profile?.avatar_url || user.user_metadata?.avatar_url || ""
                  }
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {(form.full_name || user.email || "U")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="px-6 pt-14 pb-8">
            {/* Name & Email */}
            <header className="mb-1">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {form.full_name || user.email?.split("@")[0] || "Usuario"}
              </h2>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-3.5" />
                {user.email}
              </p>
            </header>

            <Separator className="my-6" />

            {loadingProfile ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                {/* Profile Form */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="size-4 text-primary" />
                    Información Personal
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Nombre Completo
                      </span>
                      <Input
                        id="profile-full-name"
                        placeholder="Juan Pérez"
                        className="h-11"
                        value={form.full_name}
                        onChange={handleField("full_name")}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <Phone className="size-3.5" />
                        Teléfono
                      </span>
                      <Input
                        id="profile-phone"
                        type="tel"
                        placeholder="+54 11 1234-5678"
                        className="h-11"
                        value={form.phone}
                        onChange={handleField("phone")}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <Mail className="size-3.5" />
                        Email
                      </span>
                      <Input
                        id="profile-email"
                        type="email"
                        className="h-11"
                        value={user.email}
                        disabled
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mt-2">
                    <MapPin className="size-4 text-primary" />
                    Dirección
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1.5 sm:col-span-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Dirección
                      </span>
                      <Input
                        id="profile-address"
                        placeholder="Av. Corrientes 1234, Piso 3"
                        className="h-11"
                        value={form.address}
                        onChange={handleField("address")}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium text-muted-foreground">
                        Ciudad
                      </span>
                      <Input
                        id="profile-city"
                        placeholder="Buenos Aires"
                        className="h-11"
                        value={form.city}
                        onChange={handleField("city")}
                      />
                    </label>
                    <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                      <label className="grid gap-1.5">
                        <span className="text-sm font-medium text-muted-foreground">
                          País
                        </span>
                        <Input
                          id="profile-country"
                          placeholder="Argentina"
                          className="h-11"
                          value={form.country}
                          onChange={handleField("country")}
                        />
                      </label>
                      <label className="grid gap-1.5">
                        <span className="text-sm font-medium text-muted-foreground">
                          C.P.
                        </span>
                        <Input
                          id="profile-postal-code"
                          placeholder="1043"
                          className="h-11"
                          value={form.postal_code}
                          onChange={handleField("postal_code")}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 px-6"
                    size="lg"
                  >
                    {saving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ──────────────────── Wishlist Section ──────────────────── */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-red-500" />
                <h2 className="text-xl font-bold text-foreground">
                  Mis Favoritos
                </h2>
              </div>
              {!loadingWishlist && (
                <Badge variant="secondary" className="text-xs">
                  {wishlistFunkos.length}{" "}
                  {wishlistFunkos.length === 1 ? "favorito" : "favoritos"}
                </Badge>
              )}
            </div>

            <Separator className="my-5" />

            {loadingWishlist ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : wishlistFunkos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Heart className="size-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  Sin favoritos aún
                </p>
                <p className="mt-1 max-w-[32ch] text-sm text-muted-foreground">
                  Explorá nuestra colección y agregá tus Funkos favoritos.
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <a href="/funkos">Explorar Funkos</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishlistFunkos.map((funko) => (
                  <div
                    key={funko.id}
                    className="group relative flex items-center gap-4 rounded-xl border bg-background/50 p-4 transition-all duration-200 hover:shadow-sm cursor-pointer"
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/funkos/${funko.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/funkos/${funko.id}`);
                      }
                    }}
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
                      <img
                        src={funko.imgSrc?.[0] ?? "https://placehold.co/96x96"}
                        alt={funko.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {funko.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {funko.category
                          ? funko.category.charAt(0).toUpperCase() +
                            funko.category.slice(1)
                          : "Sin categoría"}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        ${funko.price?.toFixed(2) ?? "—"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(funko.id).then(() => {
                          setWishlistFunkos((prev) =>
                            prev.filter((f) => f.id !== funko.id),
                          );
                          toast.success("Eliminado de favoritos", {
                            description: funko.name,
                          });
                        }).catch(() => {
                          toast.error("Error al eliminar de favoritos");
                        });
                      }}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Eliminar de favoritos</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ──────────────────── Order History ──────────────────── */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Historial de Pedidos
                </h2>
              </div>
              {!loadingOrders && (
                <Badge variant="secondary" className="text-xs">
                  {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
                </Badge>
              )}
            </div>

            <Separator className="my-5" />

            {loadingOrders ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                  <ShoppingBag className="size-7 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold text-foreground">
                  Sin pedidos aún
                </p>
                <p className="mt-1 max-w-[32ch] text-sm text-muted-foreground">
                  Cuando realices tu primera compra, el pedido aparecerá aquí.
                </p>
                <Button asChild className="mt-6" variant="outline">
                  <a href="/funkos">Explorar Funkos</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const items = getOrderItems(order);
                  const isExpanded = expandedOrder === order.id;

                  return (
                    <div
                      key={order.id}
                      className="rounded-xl border bg-background/50 transition-all duration-200 hover:shadow-sm"
                    >
                      {/* Order Row */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order.id)
                        }
                        className="flex w-full items-center justify-between gap-4 p-4 text-left"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Order icon with item count */}
                          <div className="relative flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="size-5 text-primary" />
                            {items.length > 0 && (
                              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {items.length}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                                <Hash className="size-3" />
                                {order.id.slice(0, 8)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                              <CalendarDays className="size-3" />
                              {formatDate(order.created_at)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Price className="text-base font-bold text-foreground">
                            <PriceValue price={order.total} currency="USD" />
                          </Price>
                          {isExpanded ? (
                            <ChevronUp className="size-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {/* Expanded items */}
                      {isExpanded && items.length > 0 && (
                        <div className="border-t px-4 pb-4 pt-3">
                          <div className="space-y-3">
                            {items.map((item, idx) => (
                              <div
                                key={`${order.id}-${item.id ?? idx}`}
                                className="flex items-center gap-3"
                              >
                                <div className="size-12 shrink-0 overflow-hidden rounded-lg border bg-muted">
                                  <img
                                    src={
                                      item.image ?? "https://placehold.co/96x96"
                                    }
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex flex-1 items-center justify-between min-w-0">
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Cant: {item.quantity}
                                    </p>
                                  </div>
                                  <Price className="text-sm font-semibold text-foreground shrink-0 ml-2">
                                    <PriceValue
                                      price={item.price * item.quantity}
                                      currency="USD"
                                    />
                                  </Price>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Account;

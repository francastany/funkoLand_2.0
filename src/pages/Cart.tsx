import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuantityInput from "@/components/quantity-input";
import { Price, PriceValue } from "@/components/price";
import { useCartContext } from "@/hooks/useCart";
import { useAuthContext } from "@/hooks/useAuth";

import { createOrder } from "@/services/order.service";

export function CartPage() {
  const { items, addItem, updateQuantity, removeItem, clearCart, subtotal, taxes, total } =
    useCartContext();
  const { user, signOut } = useAuthContext();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasItems = items.length > 0;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isGuestFormComplete =
    !!form.name &&
    !!form.lastName &&
    isEmailValid &&
    !!form.country &&
    !!form.city &&
    !!form.address &&
    !!form.postalCode;

  const isFormComplete = hasItems && (user ? true : isGuestFormComplete);

  const handleField = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleCheckout() {
    setIsSubmitting(true);
    const email = user?.email ?? form.email;
    const name = user?.email
      ? user.email.split("@")[0]
      : `${form.name} ${form.lastName}`;

    try {
      await createOrder({ buyer: { name, email }, items, total });
      clearCart();
      toast.success("¡Pedido realizado!", {
        description: `Enviamos el resumen a ${email}.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      toast.error("Error al procesar el pedido", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl pb-16 pt-6">
      <header className="mb-8">
        <h1 className="text-4xl max-md:leading-snug font-bold tracking-tight">
          Finalizar la Compra
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Completá tus datos y procesá tu compra de manera segura. ¡Gracias por
          elegirnos!
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <aside className="rounded-xl bg-white shadow-sm p-6 border">
          <h2 className="text-lg font-semibold">Resumen</h2>

          {!hasItems ? (
            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <p>Tu carrito está vacío.</p>
              <Button asChild variant="secondary">
                <Link to="/funkos">Explorar Funkos</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-2">
                  <div className="size-22 overflow-hidden rounded-lg border bg-gray-50">
                    <img
                      src={item.image ?? "https://placehold.co/96x96"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm truncate font-semibold text-gray-900">
                          {item.name}
                        </p>
                        {item.details && (
                          <p className="text-xs text-muted-foreground">
                            {item.details}
                          </p>
                        )}
                      </div>
                      <Price>
                        <PriceValue price={item.price} currency="USD" />
                      </Price>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-28">
                        <QuantityInput
                          min={1}
                          inputProps={{ value: item.quantity }}
                          onValueChange={(value) =>
                            updateQuantity(item.id, value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => {
                          const removedItem = item;
                          removeItem(item.id);
                          toast("Eliminado del carrito", {
                            description: removedItem.name,
                            icon: <Trash2 className="size-4 text-primary" />,
                            action: {
                              label: "Deshacer",
                              onClick: () =>
                                addItem({
                                  id: removedItem.id,
                                  name: removedItem.name,
                                  image: removedItem.image,
                                  price: removedItem.price,
                                  quantity: removedItem.quantity,
                                  details: removedItem.details,
                                }),
                            },
                          });
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <footer className="border-t mt-6 pt-4 flex flex-col gap-2">
                <div className="flex bg-white items-center justify-between text-muted-foreground/90 text-sm font-semibold">
                  <span>Subtotal</span>
                  <Price>
                    <PriceValue price={subtotal} currency="USD" />
                  </Price>
                </div>
                <div className="flex bg-white items-center justify-between text-muted-foreground/90 text-sm font-semibold">
                  <span>Taxes</span>
                  <Price>
                    <PriceValue price={taxes} currency="USD" />
                  </Price>
                </div>
                <div className="flex bg-white items-center justify-between text-lg border-t border-muted mt-2 pt-4 font-semibold">
                  <span>Total</span>
                  <Price>
                    <PriceValue price={total} currency="USD" />
                  </Price>
                </div>
              </footer>
            </div>
          )}

          <footer className="mt-6 flex flex-col gap-2">
            <Button
              disabled={!isFormComplete || isSubmitting}
              type="button"
              size="lg"
              variant="default"
              className="w-full"
              onClick={handleCheckout}
            >
              {isSubmitting ? "Procesando..." : "Realizar Pedido"}
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link to="/funkos">Seguir comprando</Link>
            </Button>
          </footer>
        </aside>
        <div className="space-y-4">
          <section className="rounded-xl border bg-white px-6 py-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Información de Contacto</h2>
            </div>
            {user ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Conectado como <strong> ({user.email})</strong>
                </p>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                <p className="mt-2 text-sm text-muted-foreground">
                  ¿Ya tenés una cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold italic hover:underline"
                  >
                    Iniciá sesión
                  </Link>
                </p>

                <div className="mt-2 grid sm:grid-cols-2 gap-2">
                  <label className="text-sm font-medium" htmlFor="cart-name">
                    Nombre
                    <Input
                      id="cart-name"
                      placeholder="Jane"
                      className="h-10"
                      value={form.name}
                      onChange={handleField("name")}
                    />
                  </label>
                  <label className="text-sm font-medium" htmlFor="last-name">
                    Apellido
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      className="h-10"
                      value={form.lastName}
                      onChange={handleField("lastName")}
                    />
                  </label>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="cart-email">
                    Email
                    <Input
                      id="cart-email"
                      type="email"
                      placeholder="jane@funkoland.com"
                      className="h-10"
                      value={form.email}
                      onChange={handleField("email")}
                    />
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <label className="text-sm font-medium" htmlFor="cart-country">
                    País
                    <Input
                      id="cart-country"
                      placeholder="Argentina"
                      className="h-10"
                      value={form.country}
                      onChange={handleField("country")}
                    />
                  </label>
                  <label className="text-sm font-medium" htmlFor="cart-city">
                    Ciudad
                    <Input
                      id="cart-city"
                      placeholder="Buenos Aires"
                      className="h-10"
                      value={form.city}
                      onChange={handleField("city")}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-[1.5fr_0.5fr] gap-2">
                  <label className="text-sm font-medium" htmlFor="cart-address">
                    Dirección
                    <Input
                      id="cart-address"
                      placeholder="123 Main St"
                      className="h-10"
                      value={form.address}
                      onChange={handleField("address")}
                    />
                  </label>
                  <label
                    className="text-sm font-medium"
                    htmlFor="cart-postal-code"
                  >
                    <span className="truncate">C.P.</span>
                    <Input
                      type="number"
                      id="cart-postal-code"
                      placeholder="1234"
                      className="h-10"
                      value={form.postalCode}
                      onChange={handleField("postalCode")}
                    />
                  </label>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border bg-white px-6 py-8 shadow-sm">
            <h2 className="text-lg font-semibold">Método de pago</h2>
            <p className="mt-2 text-xs text-muted-foreground">
              El procesamiento de pagos aún no está habilitado. Realizá tu
              pedido y te contactaremos a la brevedad. ¡Gracias por tu
              comprensión!
            </p>
            <fieldset className="mt-4 grid gap-4 opacity-60" disabled>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="payment-name">
                  Cardholder Name
                </label>
                <Input id="payment-name" placeholder="Jane Doe" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="payment-number">
                  Card Number
                </label>
                <Input id="payment-number" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="payment-expiry"
                  >
                    Expiry Date
                  </label>
                  <Input id="payment-expiry" placeholder="MM/YY" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="payment-cvc">
                    CVC
                  </label>
                  <Input id="payment-cvc" placeholder="123" />
                </div>
              </div>
            </fieldset>
          </section>
        </div>
      </div>
    </section>
  );
}

export default CartPage;

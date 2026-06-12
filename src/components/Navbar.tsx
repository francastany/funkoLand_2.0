// import { Book, Sunset, Trees, Zap } from "lucide-react";
import {
  Menu,
  Volleyball,
  Star,
  Clapperboard,
  BicepsFlexed,
  BookUser,
  CircleUserRound,
  LogOut,
  ShoppingBasket,
  X,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/hooks/useCart";
import { useAuthContext } from "@/hooks/useAuth";
import { Price, PriceValue } from "@/components/price";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  actions?: {
    login: {
      title: string;
      url: string;
      icon?: React.ReactNode;
    };
    cart: {
      title: string;
      url: string;
      icon?: React.ReactNode;
    };
  };
}

const Navbar = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "Funkoland Logo",
    title: "funkoLand",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Funkos",
      url: "/funkos",
      items: [
        {
          title: "All Funkos",
          description: "Explora el catálogo completo de todas nuestras figuras",
          icon: <BookUser className="size-5 shrink-0" />,
          url: "/funkos",
        },
        {
          title: "Movies",
          description: "Tus personajes favoritos de la gran pantalla",
          icon: <Clapperboard className="size-5 shrink-0" />,
          url: "/funkos?category=movies",
        },
        {
          title: "Sports",
          description: "Las leyendas y estrellas del deporte",
          icon: <Volleyball className="size-5 shrink-0" />,
          url: "/funkos?category=sports",
        },
        {
          title: "Icons",
          description: "Grandes iconos y famosos de la cultura pop",
          icon: <Star className="size-5 shrink-0" />,
          url: "/funkos?category=icons",
        },
        {
          title: "Heros",
          description: "Superhéroes y villanos del mundo de los cómics",
          icon: <BicepsFlexed className="size-5 shrink-0" />,
          url: "/funkos?category=heroes",
        },
      ],
    },
    {
      title: "Nosotros",
      url: "/about",
    },
    {
      title: "Contacto",
      url: "/contact",
    },
  ],
  actions = {
    login: {
      title: "Login",
      url: "/login",
      icon: <CircleUserRound className="size-5 shrink-0" />,
    },
    cart: {
      title: "Cart",
      url: "/cart",
      icon: <ShoppingBasket className="size-5 shrink-0" />,
    },
  },
  className,
}: NavbarProps) => {
  const { user, signOut } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
  };

  return (
    <section className={cn("py-4", className)}>
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <span className="text-lg italic font-black tracking-tighter">
                {logo.title}
              </span>
            </a>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="rounded-full outline-none">
                  <Avatar className="size-10">
                    <AvatarImage src={user.user_metadata?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.email?.slice(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="truncate">
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/account")}
                    className="cursor-pointer"
                  >
                    <UserRound className="mr-2 size-4" />
                    <span>Mi Cuenta</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50 dark:focus:text-red-600"
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" className="size-10 rounded-md">
                <a href={actions.login.url}>{actions.login.icon}</a>
              </Button>
            )}
            <CartDrawer
              icon={actions.cart.icon}
              title={actions.cart.title}
              triggerVariant="default"
              triggerClassName="size-10 rounded-md"
            />
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="fixed inset-x-0 top-0 z-50 block border-b backdrop-blur-md bg-background/80 lg:hidden">
          <div className="container px-6 grid grid-cols-3 items-center pt-4 pb-3">
            <div className="justify-self-start">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="size-5 rounded-md flex items-center justify-center"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2">
                        <span className="text-xl italic font-black tracking-tighter">
                          {logo.title}
                        </span>
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    <div className="border-t pt-4">
                      {user ? (
                        <div className="flex flex-col gap-2">
                          <a
                            href="/account"
                            className="text-md font-semibold py-2 flex items-center gap-2"
                          >
                            <UserRound className="size-4" />
                            Mi Cuenta
                          </a>
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="text-md font-semibold py-2 flex items-center gap-2 text-red-600"
                          >
                            <LogOut className="size-4" />
                            Cerrar sesión
                          </button>
                        </div>
                      ) : (
                        <a
                          href={actions.login.url}
                          className="text-md font-semibold py-2 flex items-center gap-2"
                        >
                          <CircleUserRound className="size-4" />
                          Iniciar sesión
                        </a>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            {/* Logo */}
            <a
              href={logo.url}
              className="flex items-center justify-self-center gap-2"
            >
              <span className="text-xl italic font-black tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="justify-self-end">
              <CartDrawer
                icon={actions.cart.icon}
                title={actions.cart.title}
                triggerVariant="ghost"
                triggerClassName="size-10 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type CartDrawerProps = {
  icon?: React.ReactNode;
  title: string;
  triggerVariant: React.ComponentProps<typeof Button>["variant"];
  triggerClassName?: string;
};

const CartDrawer = ({
  icon,
  title,
  triggerVariant,
  triggerClassName,
}: CartDrawerProps) => {
  const navigate = useNavigate();
  const { items, itemCount, subtotal, taxes, total } = useCartContext();
  const hasItems = items.length > 0;

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant={triggerVariant}
          className={cn("relative", triggerClassName)}
          aria-label={title}
        >
          {icon}
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary/20 bg-white text-[10px] font-semibold text-primary shadow-sm">
              {itemCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="inset-y-0 right-0 h-full w-full max-w-sm border-l pt-4">
        <DrawerHeader>
          <div className="flex items-center justify-between gap-4">
            <DrawerTitle className="text-xl text-primary font-semibold">
              Tu carrito
            </DrawerTitle>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm" className="size-8">
                <X className="size-5" />
              </Button>
            </DrawerTrigger>
          </div>
          <DrawerDescription>
            Revisa tus productos antes de continuar.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 space-y-4 overflow-y-auto mt-4 px-4 pb-4">
          {!hasItems ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Tu carrito esta vacio.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="size-16 overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={item.image ?? "https://placehold.co/96x96"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="text-base font-semibold text-foreground">
                    {item.name}
                  </div>
                  {item.details && (
                    <div className="text-xs text-accent italic">
                      {item.details.slice(10, item.details.length)}
                    </div>
                  )}
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Cantidad: {item.quantity}</span>
                    <Price className="font-semibold">
                      <PriceValue price={item.price} currency="USD" />
                    </Price>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <DrawerFooter className="border-t">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <Price>
                <PriceValue price={subtotal} currency="USD" />
              </Price>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Impuestos</span>
              <Price>
                <PriceValue price={taxes} currency="USD" />
              </Price>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <Price>
                <PriceValue price={total} currency="USD" />
              </Price>
            </div>
          </div>
          <DrawerClose asChild className="mt-4">
            <Button
              className="w-full py-6 border border-primary hover:bg-white hover:text-primary"
              size="lg"
              onClick={() => navigate("/cart")}
              disabled={!hasItems}
            >
              Finalizar compra
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">
              Seguir comprando
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink
              asChild
              key={subItem.title}
              className="w-80 py-4"
            >
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-4 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-2 font-semibold font-sans hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2 [&_a]:no-underline h-fit">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold py-2">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };

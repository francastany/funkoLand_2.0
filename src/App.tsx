import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Navbar } from "@/components/Navbar";
import { Funkos } from "@/pages/Funkos";
import { NotFound } from "@/pages/NotFound";
import { FunkoDetail } from "@/pages/FunkoDetail";
import { CartPage } from "@/pages/Cart";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Account } from "@/pages/Account";
import { Contact } from "@/pages/Contact";
import { About } from "./pages/About";
import { Information } from "@/pages/Information";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/hooks/useAuth";
import { WishlistProvider } from "@/hooks/useWishlist";
import { CartProvider } from "@/hooks/useCart";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <header>
              <div className="bg-primary w-full py-2">
                <p className="text-xs text-primary-foreground italic text-center">
                  Bienvenido a Funkoland. ¡Disfruta de nuestra colección de
                  Funkos!
                </p>
              </div>
              <Navbar />
            </header>
            <div className="App">
              <main className="max-w-6xl mx-auto py-8 px-6 xl:px-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/funkos" element={<Funkos />} />
                  <Route path="/funkos/:id" element={<FunkoDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/information" element={<Information />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Footer />
            <Toaster />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

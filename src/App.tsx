import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  BenefitsSection,
  HowItWorksSection,
  OurStorySection,
  FinalCTASection,
} from "@/components/sections";
import OrderPage from "@/pages/OrderPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import AdminOrdersPage from "@/pages/AdminOrdersPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  return null;
}

function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <OurStorySection />
      <FinalCTASection />
    </>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-gutter-mobile py-2xl">
      <h1 className="font-display text-headline-lg uppercase text-on-surface tracking-[0.03em] mb-4">
        {title}
      </h1>
      <p className="text-on-surface-variant text-body-md">
        This page is coming soon.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToHash />
        <Routes>
          <Route
            path="/admin/login"
            element={<AdminLoginPage />}
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col bg-surface-container-lowest text-on-surface">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/order" element={<OrderPage />} />
                  <Route path="/order/confirmation" element={<ConfirmationPage />} />
                  <Route path="/terms" element={<PlaceholderPage title="Terms & Privacy" />} />
                  <Route path="/contact" element={<PlaceholderPage title="Atelier Contact" />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Footer />
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

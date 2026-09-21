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
import { TermsPage } from "@/pages/TermsPage";
import { ContactPage } from "@/pages/ContactPage";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LanguageProvider } from "@/lib/i18n";

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

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
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
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

/**
 * Admin Login Page
 *
 * Email + password login for admin users.
 * Only accessible when NOT already logged in.
 * Redirects to /admin/orders on success.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Icon } from "@/components/ui/Icon";

export default function AdminLoginPage() {
  const { signIn, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in as admin
  if (!loading && user && isAdmin) {
    navigate("/admin/orders", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    console.log("[AdminLogin] Attempting sign-in for:", email.trim());
    const result = await signIn(email.trim(), password);
    if (result.error) {
      console.error("[AdminLogin] Sign-in failed:", result.error);
      // Show the actual Supabase error for debugging (remove in production)
      setError(`Login failed: ${result.error}`);
      setSubmitting(false);
    } else {
      console.log("[AdminLogin] Sign-in successful, navigating to /admin/orders");
      navigate("/admin/orders", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-headline-md uppercase text-on-surface tracking-[0.03em] mb-2">
            Admin Access
          </h1>
          <p className="font-body text-body-sm text-on-surface-variant">
            Sign in to access the orders dashboard.
          </p>
        </div>

        <div className="bg-surface-container-low p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant mb-1.5"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vareno.com"
                required
                className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 font-body text-body-md placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant mb-1.5"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-surface-container-lowest text-on-surface px-4 py-3 font-body text-body-md placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
              />
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/30 p-3 flex items-center gap-2">
                <Icon name="error_outline" size="md" className="text-error shrink-0" />
                <p className="font-body text-body-sm text-error">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !email || !password}
              className="w-full py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

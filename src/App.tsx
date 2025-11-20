import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Core pages that exist
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Common pages that exist
import SiteSettingsForm from "./pages/common/SiteSettingsForm";
import SocialMediaList from "./pages/common/SocialMediaList";
import SocialMediaForm from "./pages/common/SocialMediaForm";
import CommonFaqList from "./pages/common/CommonFaqList";
import CommonFaqForm from "./pages/common/CommonFaqForm";
import { MetaTagsList } from "./pages/common/MetaTagsList";

// Home pages that exist

const queryClient = new QueryClient();
// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("goec_auth") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />

          {/* Site Settings Route */}
          <Route
            path="/site-settings"
            element={
              <ProtectedRoute>
                <SiteSettingsForm />
              </ProtectedRoute>
            }
          />

          {/* Social Media Routes */}
          <Route
            path="/social-media"
            element={
              <ProtectedRoute>
                <SocialMediaList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/social-media/new"
            element={
              <ProtectedRoute>
                <SocialMediaForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/social-media/:id/edit"
            element={
              <ProtectedRoute>
                <SocialMediaForm />
              </ProtectedRoute>
            }
          />

          {/* Common FAQ Management Routes */}
          <Route
            path="/common-faq"
            element={
              <ProtectedRoute>
                <CommonFaqList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/common-faq/new"
            element={
              <ProtectedRoute>
                <CommonFaqForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/common-faq/:id/edit"
            element={
              <ProtectedRoute>
                <CommonFaqForm />
              </ProtectedRoute>
            }
          />

            {/* Meta Tags Routes */}
          <Route
            path="/meta-tags"
            element={
              <ProtectedRoute>
                <MetaTagsList />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { isAuthenticated } from "@/services/auth/authApi";

// Core pages that exist
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Common pages that exist
import SiteSettingsForm from "./pages/common/SiteSettingsForm";
import SocialMediaList from "./pages/common/SocialMediaList";
import SocialMediaForm from "./pages/common/SocialMediaForm";
import { MetaTagsList } from "./pages/common/MetaTagsList";

// Home pages that exist
import HomeCmsForm from "./pages/home/HomeCmsForm";
import HomeBannerSliderList from "./pages/home/HomeBannerSliderList";
import HomeBannerSliderForm from "./pages/home/HomeBannerSliderForm";

// FAQ pages
import FaqCmsForm from "./pages/faq/FaqCmsForm";

// Contact pages
import ContactCmsForm from "./pages/contact/ContactCmsForm";

const queryClient = new QueryClient();
// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const authenticated = isAuthenticated();
  if (!authenticated) {
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

            {/* Meta Tags Routes */}
          <Route
            path="/meta-tags"
            element={
              <ProtectedRoute>
                <MetaTagsList />
              </ProtectedRoute>
            }
          />

          {/* Home CMS Routes */}
          <Route
            path="/home-cms"
            element={
              <ProtectedRoute>
                <HomeCmsForm />
              </ProtectedRoute>
            }
          />

          {/* Home Banner Slider Routes */}
          <Route
            path="/home-banner-slider"
            element={
              <ProtectedRoute>
                <HomeBannerSliderList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home-banner-slider/create"
            element={
              <ProtectedRoute>
                <HomeBannerSliderForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home-banner-slider/edit/:id"
            element={
              <ProtectedRoute>
                <HomeBannerSliderForm />
              </ProtectedRoute>
            }
          />

          {/* FAQ CMS Route */}
          <Route
            path="/faq-cms"
            element={
              <ProtectedRoute>
                <FaqCmsForm />
              </ProtectedRoute>
            }
          />

              {/* CONTACT CMS Route */}
          <Route
            path="/contact-cms"
            element={
              <ProtectedRoute>
                <ContactCmsForm />
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

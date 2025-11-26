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
import HomeCmsForm from "./pages/cms/home/HomeCmsForm";
import HomeBannerSliderList from "./pages/cms/home/HomeBannerSliderList";
import HomeBannerSliderForm from "./pages/cms/home/HomeBannerSliderForm";
import HomeBrandsList from "./pages/cms/home/HomeBrandsList";
import HomeBrandsForm from "./pages/cms/home/HomeBrandsForm";

// FAQ pages
import FaqCmsForm from "./pages/cms/faq/FaqCmsForm";
import FaqCategoryList from "./pages/cms/faq/FaqCategoryList";
import FaqCategoryForm from "./pages/cms/faq/FaqCategoryForm";
import FaqListList from "./pages/cms/faq/FaqListList";
import FaqListForm from "./pages/cms/faq/FaqListForm";

// Contact pages
import ContactCmsForm from "./pages/cms/contact/ContactCmsForm";

// About pages
import AboutCmsForm from "./pages/cms/about/aboutCmsForm";

// Blog pages
import BlogCmsForm from "./pages/blog/BlogCmsForm";
import BlogsList from "./pages/blog/BlogsList";
import BlogsForm from "./pages/blog/BlogsForm";

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

          {/* Home Brands Routes */}
          <Route
            path="/home-brands"
            element={
              <ProtectedRoute>
                <HomeBrandsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home-brands/create"
            element={
              <ProtectedRoute>
                <HomeBrandsForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/home-brands/edit/:id"
            element={
              <ProtectedRoute>
                <HomeBrandsForm />
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

          {/* FAQ Category Routes */}
          <Route
            path="/faq-category"
            element={
              <ProtectedRoute>
                <FaqCategoryList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq-category/create"
            element={
              <ProtectedRoute>
                <FaqCategoryForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq-category/edit/:id"
            element={
              <ProtectedRoute>
                <FaqCategoryForm />
              </ProtectedRoute>
            }
          />

          {/* FAQ List Routes */}
          <Route
            path="/faq-list"
            element={
              <ProtectedRoute>
                <FaqListList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq-list/create"
            element={
              <ProtectedRoute>
                <FaqListForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq-list/edit/:id"
            element={
              <ProtectedRoute>
                <FaqListForm />
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

          {/* ABOUT CMS Route */}
          <Route
            path="/about-cms"
            element={
              <ProtectedRoute>
                <AboutCmsForm />
              </ProtectedRoute>
            }
          />

          {/* Blog CMS Route */}
          <Route
            path="/blog-cms"
            element={
              <ProtectedRoute>
                <BlogCmsForm />
              </ProtectedRoute>
            }
          />

          {/* Blogs Routes */}
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <BlogsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/create"
            element={
              <ProtectedRoute>
                <BlogsForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/edit/:id"
            element={
              <ProtectedRoute>
                <BlogsForm />
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

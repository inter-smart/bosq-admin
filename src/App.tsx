import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { isAuthenticated } from "@/services/auth/authApi";

import { lazy } from "react";

// Core pages
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Common pages
const SiteSettingsForm = lazy(() => import("./pages/common/SiteSettingsForm"));
const SocialMediaList = lazy(() => import("./pages/common/SocialMediaList"));
const SocialMediaForm = lazy(() => import("./pages/common/SocialMediaForm"));
const MetaTagsList = lazy(() => import("./pages/common/MetaTagsList"));
const MetaTagsForm = lazy(() => import("./pages/common/MetaTagsForm"));

// coupons
const CouponsList = lazy(() => import("./pages/coupons/CouponsList"));
const CouponsForm = lazy(() => import("./pages/coupons/CouponsForm"));

// Product pages
const ProductCategoriesList = lazy(
  () => import("./pages/product/ProductCategoriesList"),
);
const ProductCategoriesForm = lazy(
  () => import("./pages/product/ProductCategoriesForm"),
);
const ProductAttributesList = lazy(
  () => import("./pages/product/ProductAttributesList"),
);
const ProductAttributesForm = lazy(
  () => import("./pages/product/ProductAttributesForm"),
);
const AttributeValuesList = lazy(
  () => import("./pages/product/AttributeValuesList"),
);
const AttributeValuesForm = lazy(
  () => import("./pages/product/AttributeValuesForm"),
);
const ProductSectoresList = lazy(
  () => import("./pages/product/ProductSectorsList"),
);
const ProductSectorsForm = lazy(
  () => import("./pages/product/ProductSectorsForm"),
);
const ProductSellingPointsList = lazy(
  () => import("./pages/product/ProductSellingPointList"),
);
const ProductSellingPointsForm = lazy(
  () => import("./pages/product/ProductSellingPointForm"),
);
const BaseProductList = lazy(() => import("./pages/product/BaseProductList"));
const BaseProductForm = lazy(() => import("./pages/product/BaseProductForm"));
const ProductModelList = lazy(() => import("./pages/product/ProductModelList"));
const ProductModelForm = lazy(() => import("./pages/product/ProductModelForm"));
const ProductVariantList = lazy(
  () => import("./pages/product/ProductVariantList"),
);
const ProductVariantForm = lazy(
  () => import("./pages/product/ProductVariantForm"),
);
const ProductVariantImagesList = lazy(
  () => import("./pages/product/ProductVariantImagesList"),
);
const ProductVariantImagesForm = lazy(
  () => import("./pages/product/ProductVariantImagesForm"),
);
const ProductProjectImagesList = lazy(
  () => import("./pages/product/ProductProjectImagesList"),
);
const ProductProjectImagesForm = lazy(
  () => import("./pages/product/ProductProjectImagesForm"),
);
const AllProductModelsList = lazy(
  () => import("./pages/product/AllProductModelsList"),
);
const AllProductVariantsList = lazy(
  () => import("./pages/product/AllProductVariantsList"),
);
const ManageBoughtTogether = lazy(
  () => import("./pages/product/ManageBoughtTogether"),
);
const ProductBulkUpload = lazy(
  () => import("./pages/product/ProductBulkUpload"),
);
const ProductBulkImageUpload = lazy(
  () => import("./pages/product/ProductBulkImageUpload"),
);

// Home pages
const HomeCmsForm = lazy(() => import("./pages/cms/home/HomeCmsForm"));
const HomeBannerSliderList = lazy(
  () => import("./pages/cms/home/HomeBannerSliderList"),
);
const HomeBannerSliderForm = lazy(
  () => import("./pages/cms/home/HomeBannerSliderForm"),
);
const HomeBrandsList = lazy(() => import("./pages/cms/home/HomeBrandsList"));
const HomeBrandsForm = lazy(() => import("./pages/cms/home/HomeBrandsForm"));
const SmartSpaceCalculatorList = lazy(
  () => import("./pages/cms/home/SmartSpaceCalculatorList"),
);
const SmartSpaceCalculatorForm = lazy(
  () => import("./pages/cms/home/SmartSpaceCalculatorForm"),
);
const FindYourFitsList = lazy(
  () => import("./pages/cms/home/FindYourFitsList"),
);
const FindYourFitsForm = lazy(
  () => import("./pages/cms/home/FindYourFitsForm"),
);

// Customization pages
const CustomizationFeaturesList = lazy(
  () => import("./pages/customization/CustomizationFeaturesList"),
);
const CustomizationFeaturesForm = lazy(
  () => import("./pages/customization/CustomizationFeaturesForm"),
);
const CustomizationProcessList = lazy(
  () => import("./pages/customization/CustomizationProcessList"),
);
const CustomizationProcessForm = lazy(
  () => import("./pages/customization/CustomizationProcessForm"),
);
const CustomizationOptionsList = lazy(
  () => import("./pages/customization/CustomizationOptionsList"),
);
const CustomizationOptionsForm = lazy(
  () => import("./pages/customization/CustomizationOptionsForm"),
);

// FAQ pages
const FaqCmsForm = lazy(() => import("./pages/cms/faq/FaqCmsForm"));
const FaqCategoryList = lazy(() => import("./pages/cms/faq/FaqCategoryList"));
const FaqCategoryForm = lazy(() => import("./pages/cms/faq/FaqCategoryForm"));
const FaqListList = lazy(() => import("./pages/cms/faq/FaqListList"));
const FaqListForm = lazy(() => import("./pages/cms/faq/FaqListForm"));

// Contact pages
const ContactCmsForm = lazy(() => import("./pages/cms/contact/ContactCmsForm"));

// Contact Enquiries pages
const ContactEnquiriesList = lazy(
  () => import("./pages/enquiries/ContactEnquiriesList"),
);
const ContactEnquiryDetails = lazy(
  () => import("./pages/enquiries/ContactEnquiryDetails"),
);

// Product Enquiries pages
const ProductEnquiriesList = lazy(
  () => import("./pages/enquiries/ProductEnquiriesList"),
);
const ProductEnquiryDetails = lazy(
  () => import("./pages/enquiries/ProductEnquiryDetails"),
);

// General Enquiries pages
const CustomizationEnquiriesList = lazy(
  () => import("./pages/enquiries/CustomizationEnquiriesList"),
);
const CustomizationEnquiryDetails = lazy(
  () => import("./pages/enquiries/CustomizationEnquiryDetails"),
);

// Lead Generation pages
const LeadGenerationList = lazy(
  () => import("./pages/enquiries/LeadGenerationList"),
);
const LeadGenerationDetails = lazy(
  () => import("./pages/enquiries/LeadGenerationDetails"),
);

// Newsletter Subscription pages
const NewsletterSubscriptionsList = lazy(
  () => import("./pages/enquiries/NewsletterSubscriptionsList"),
);
const NewsletterSubscriptionDetails = lazy(
  () => import("./pages/enquiries/NewsletterSubscriptionDetails"),
);

// Project Enquiries pages
const ProjectEnquiriesList = lazy(
  () => import("./pages/enquiries/ProjectEnquiriesList"),
);
const ProjectEnquiryDetails = lazy(
  () => import("./pages/enquiries/ProjectEnquiryDetails"),
);

// Users pages
const UsersList = lazy(() => import("./pages/users/UsersList"));
const UserDetails = lazy(() => import("./pages/users/UserDetails"));

// Orders pages
const OrdersList = lazy(() => import("./pages/orders/OrdersList"));
const OrderDetails = lazy(() => import("./pages/orders/OrderDetails"));

// Projects pages
const ProjectsCmsForm = lazy(
  () => import("./pages/cms/projects/ProjectsCmsForm"),
);
const ProjectCategoryList = lazy(
  () => import("./pages/cms/projects/ProjectCategoryList"),
);
const ProjectCategoryForm = lazy(
  () => import("./pages/cms/projects/ProjectCategoryForm"),
);
const ProjectsList = lazy(() => import("./pages/cms/projects/ProjectsList"));
const ProjectsForm = lazy(() => import("./pages/cms/projects/ProjectsForm"));
const SpecialisedAreasList = lazy(
  () => import("./pages/cms/projects/SpecialisedAreasList"),
);
const SpecialisedAreasForm = lazy(
  () => import("./pages/cms/projects/SpecialisedAreasForm"),
);
// Project images
const ProjectImagesList = lazy(
  () => import("./pages/cms/projects/ProjectImagesList"),
);
const ProjectImagesForm = lazy(
  () => import("./pages/cms/projects/ProjectImagesForm"),
);

// Master pages
const EnquiryDropdownList = lazy(() => import("./pages/master/enquiryDropdown/EnquiryDropdownList"));
const EnquiryDropdownForm = lazy(() => import("./pages/master/enquiryDropdown/EnquiryDropdownForm"));

// Login/Register pages
const LoginRegisterCmsForm = lazy(
  () => import("./pages/cms/login-register/LoginRegisterCmsForm"),
);

// Auth pages
const AuthCmsForm = lazy(() => import("./pages/cms/auth/AuthCmsForm"));

// About pages
const AboutCmsForm = lazy(() => import("./pages/cms/about/aboutCmsForm"));
const AboutTestimonialsList = lazy(
  () => import("./pages/cms/about/AboutTestimonialsList"),
);

// Materials pages
const MaterialsCmsForm = lazy(
  () => import("./pages/cms/materials/MaterialsCmsForm"),
);
const MaterialsCategoryList = lazy(
  () => import("./pages/cms/materials/MaterialsCategoryList"),
);
const MaterialsCategoryForm = lazy(
  () => import("./pages/cms/materials/MaterialsCategoryForm"),
);
const MaterialsList = lazy(() => import("./pages/cms/materials/MaterialsList"));
const MaterialsForm = lazy(() => import("./pages/cms/materials/MaterialsForm"));
const ExtraMaterialsList = lazy(
  () => import("./pages/cms/materials/ExtraMaterialsList"),
);
const ExtraMaterialsForm = lazy(
  () => import("./pages/cms/materials/ExtraMaterialsForm"),
);

// Delivery pages
const DeliveryCmsForm = lazy(
  () => import("./pages/cms/delivery/DeliveryCmsForm"),
);
const DeliveryTimeList = lazy(
  () => import("./pages/cms/delivery/DeliveryTimeList"),
);
const DeliveryTimeForm = lazy(
  () => import("./pages/cms/delivery/DeliveryTimeForm"),
);
const DeliveryMethodList = lazy(
  () => import("./pages/cms/delivery/DeliveryMethodList"),
);
const DeliveryMethodForm = lazy(
  () => import("./pages/cms/delivery/DeliveryMethodForm"),
);

const AboutTestimonialsForm = lazy(
  () => import("./pages/cms/about/AboutTestimonialsForm"),
);
const AboutJourneysList = lazy(
  () => import("./pages/cms/about/AboutJourneysList"),
);
const AboutJourneysForm = lazy(
  () => import("./pages/cms/about/AboutJourneysForm"),
);
const AboutOurClientsList = lazy(
  () => import("./pages/cms/about/AboutOurClientsList"),
);
const AboutOurClientsForm = lazy(
  () => import("./pages/cms/about/AboutOurClientsForm"),
);
const WhyBosqList = lazy(() => import("./pages/cms/about/WhyBosqList"));
const WhyBosqForm = lazy(() => import("./pages/cms/about/WhyBosqForm"));

// ERGONOMICS
const ErgonomicGuideCmsForm = lazy(
  () => import("./pages/cms/ergonomic-guide/ErgoGuideForm"),
);
// ergogomicsfeatures
const ErgonomicFeaturesList = lazy(
  () => import("./pages/cms/ergonomic-guide/ErgonomicsChairFeatureList"),
);
const ErgonomicFeaturesForm = lazy(
  () => import("./pages/cms/ergonomic-guide/ErgonomicsChairFeatureForm"),
);

// Blog pages
const BlogCmsForm = lazy(() => import("./pages/blog/BlogCmsForm"));
const BlogsList = lazy(() => import("./pages/blog/BlogsList"));
const BlogsForm = lazy(() => import("./pages/blog/BlogsForm"));

const NewsCmsForm = lazy(() => import("./pages/news/NewsCmsForm"));
const NewsList = lazy(() => import("./pages/news/NewsList"));
const NewsForm = lazy(() => import("./pages/news/NewsForm"));

// Customization pages
const CustomizationCmsForm = lazy(
  () => import("./pages/customization/CustomizationCmsForm"),
);

// Policy pages
const PrivacyPolicyCmsForm = lazy(
  () => import("./pages/policy/PrivacyPolicyCmsForm"),
);
const PrivacyPolicyForm = lazy(
  () => import("./pages/policy/PrivacyPolicyForm"),
);
const PrivacyPolicyList = lazy(
  () => import("./pages/policy/PrivacyPolicyList"),
);

const WarrantyPolicyList = lazy(
  () => import("./pages/policy/WarrantyPolicyList"),
);
const WarrantyPolicyForm = lazy(
  () => import("./pages/policy/WarrantyPolicyForm"),
);

const TermsAndConditionsCmsForm = lazy(
  () => import("./pages/policy/TermsAndConditionsCmsForm"),
);
const TermsAndConditionsFaqListForm = lazy(
  () => import("./pages/policy/TermsAndConditionsFaqListForm"),
);
const TermsAndConditionsList = lazy(
  () => import("./pages/policy/TermsAndConditionsList"),
);

// Return Policy pages
const ReturnPolicyCmsForm = lazy(
  () => import("./pages/policy/ReturnPolicyCmsForm"),
);
const ReturnPolicyForm = lazy(() => import("./pages/policy/ReturnPolicyForm"));
const ReturnPolicyList = lazy(() => import("./pages/policy/ReturnPolicyList"));

import { Suspense } from "react";
import PageLoader from "@/components/common/PageLoader";
import SustainabilityCmsForm from "./pages/cms/sustainability/SustainabilityCmsForm";
import SustainabilityList from "./pages/cms/sustainability/SustainabilityList";
import SustainabilityForm from "./pages/cms/sustainability/SustainabilityForm";
import PaymentMethodsForm from "./pages/common/PaymentMethodsForm";
import PaymentMethodsList from "./pages/common/PaymentMethodsList";

const LandingPageForm = lazy(
  () => import("./pages/landingPage/LandingPageForm"),
);

const LandingPageList = lazy(
  () => import("./pages/landingPage/LandingPageList"),
);

const ProductTypeList = lazy(
  () => import("./pages/landingPage/ProductTypeList"),
);
const ProductTypeForm = lazy(
  () => import("./pages/landingPage/ProductTypeForm"),
);

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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

            {/* Payment methods Routes */}
            <Route
              path="/payment-methods"
              element={
                <ProtectedRoute>
                  <PaymentMethodsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment-methods/new"
              element={
                <ProtectedRoute>
                  <PaymentMethodsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment-methods/:id/edit"
              element={
                <ProtectedRoute>
                  <PaymentMethodsForm />
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
            <Route
              path="/meta-tags/:id/edit"
              element={
                <ProtectedRoute>
                  <MetaTagsForm />
                </ProtectedRoute>
              }
            />

            {/* Product Categories Routes */}
            <Route
              path="/product-categories"
              element={
                <ProtectedRoute>
                  <ProductCategoriesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-categories/create"
              element={
                <ProtectedRoute>
                  <ProductCategoriesForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-categories/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductCategoriesForm />
                </ProtectedRoute>
              }
            />

            {/* Product Attributes Routes */}
            <Route
              path="/product-attributes"
              element={
                <ProtectedRoute>
                  <ProductAttributesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-attributes/create"
              element={
                <ProtectedRoute>
                  <ProductAttributesForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-attributes/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductAttributesForm />
                </ProtectedRoute>
              }
            />

            {/* Attribute Values Routes */}
            <Route
              path="/product-attributes/:attributeId/values"
              element={
                <ProtectedRoute>
                  <AttributeValuesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-attributes/:attributeId/values/create"
              element={
                <ProtectedRoute>
                  <AttributeValuesForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-attributes/:attributeId/values/edit/:id"
              element={
                <ProtectedRoute>
                  <AttributeValuesForm />
                </ProtectedRoute>
              }
            />

            {/* Product Sectors Routes */}
            <Route
              path="/product-sectors"
              element={
                <ProtectedRoute>
                  <ProductSectoresList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-sectors/create"
              element={
                <ProtectedRoute>
                  <ProductSectorsForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-sectors/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductSectorsForm />
                </ProtectedRoute>
              }
            />

            {/* Product Selling points Routes */}
            <Route
              path="/product-selling-points"
              element={
                <ProtectedRoute>
                  <ProductSellingPointsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-selling-points/create"
              element={
                <ProtectedRoute>
                  <ProductSellingPointsForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-selling-points/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductSellingPointsForm />
                </ProtectedRoute>
              }
            />

            {/* Base Product Routes */}
            <Route
              path="/base-products"
              element={
                <ProtectedRoute>
                  <BaseProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/base-products/create"
              element={
                <ProtectedRoute>
                  <BaseProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/base-products/edit/:id"
              element={
                <ProtectedRoute>
                  <BaseProductForm />
                </ProtectedRoute>
              }
            />

            {/* Product Model Routes */}
            <Route
              path="/product-models/:productId/list"
              element={
                <ProtectedRoute>
                  <ProductModelList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-models/:productId/create"
              element={
                <ProtectedRoute>
                  <ProductModelForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-models/:productId/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductModelForm />
                </ProtectedRoute>
              }
            />

            {/* Product Variant Routes */}
            <Route
              path="/product-variants/:productId/list"
              element={
                <ProtectedRoute>
                  <ProductVariantList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-variants/:productId/create"
              element={
                <ProtectedRoute>
                  <ProductVariantForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-variants/:productId/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductVariantForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product-models/all"
              element={
                <ProtectedRoute>
                  <AllProductModelsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product-variants/all"
              element={
                <ProtectedRoute>
                  <AllProductVariantsList />
                </ProtectedRoute>
              }
            />

            {/* Bought Together */}
            <Route
              path="/product-variants/:variantId/bought-together"
              element={
                <ProtectedRoute>
                  <ManageBoughtTogether />
                </ProtectedRoute>
              }
            />

            {/* Bulk Upload */}
            <Route
              path="/product-bulk-upload"
              element={
                <ProtectedRoute>
                  <ProductBulkUpload />
                </ProtectedRoute>
              }
            />

            {/* Bulk Image & Video Upload */}
            <Route
              path="/product-bulk-image-upload"
              element={
                <ProtectedRoute>
                  <ProductBulkImageUpload />
                </ProtectedRoute>
              }
            />

            {/* Product Variant Images Routes */}
            <Route
              path="/product-variant-images/:variantId"
              element={
                <ProtectedRoute>
                  <ProductVariantImagesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-variant-images/:variantId/add"
              element={
                <ProtectedRoute>
                  <ProductVariantImagesForm />
                </ProtectedRoute>
              }
            />

            {/* Product Project Images Routes */}
            <Route
              path="/product-project-images/:productId/list"
              element={
                <ProtectedRoute>
                  <ProductProjectImagesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-project-images/:productId/create"
              element={
                <ProtectedRoute>
                  <ProductProjectImagesForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-project-images/:productId/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductProjectImagesForm />
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

            {/* Smart Space Calculator Routes */}
            <Route
              path="/smart-space-calculator"
              element={
                <ProtectedRoute>
                  <SmartSpaceCalculatorList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/smart-space-calculator/create"
              element={
                <ProtectedRoute>
                  <SmartSpaceCalculatorForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/smart-space-calculator/edit/:id"
              element={
                <ProtectedRoute>
                  <SmartSpaceCalculatorForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/find-your-fits"
              element={
                <ProtectedRoute>
                  <FindYourFitsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/find-your-fits/create"
              element={
                <ProtectedRoute>
                  <FindYourFitsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/find-your-fits/edit/:id"
              element={
                <ProtectedRoute>
                  <FindYourFitsForm />
                </ProtectedRoute>
              }
            />

            {/* Customization Features Routes */}
            <Route
              path="/customization-features"
              element={
                <ProtectedRoute>
                  <CustomizationFeaturesList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customization-features/create"
              element={
                <ProtectedRoute>
                  <CustomizationFeaturesForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customization-features/edit/:id"
              element={
                <ProtectedRoute>
                  <CustomizationFeaturesForm />
                </ProtectedRoute>
              }
            />

            {/* Customization Process Routes */}
            <Route
              path="/customization-process"
              element={
                <ProtectedRoute>
                  <CustomizationProcessList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customization-process/create"
              element={
                <ProtectedRoute>
                  <CustomizationProcessForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customization-process/edit/:id"
              element={
                <ProtectedRoute>
                  <CustomizationProcessForm />
                </ProtectedRoute>
              }
            />

            {/* Customization Options Routes */}
            <Route
              path="/customization-options"
              element={
                <ProtectedRoute>
                  <CustomizationOptionsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customization-options/create"
              element={
                <ProtectedRoute>
                  <CustomizationOptionsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customization-options/edit/:id"
              element={
                <ProtectedRoute>
                  <CustomizationOptionsForm />
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

            {/* Contact Enquiries Routes */}
            <Route
              path="/contact-enquiries"
              element={
                <ProtectedRoute>
                  <ContactEnquiriesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-enquiries/:id"
              element={
                <ProtectedRoute>
                  <ContactEnquiryDetails />
                </ProtectedRoute>
              }
            />

            {/* Product Enquiries Routes */}
            <Route
              path="/product-enquiries"
              element={
                <ProtectedRoute>
                  <ProductEnquiriesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-enquiries/:id"
              element={
                <ProtectedRoute>
                  <ProductEnquiryDetails />
                </ProtectedRoute>
              }
            />

            {/* General Enquiries Routes */}
            <Route
              path="/customization-enquiries"
              element={
                <ProtectedRoute>
                  <CustomizationEnquiriesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customization-enquiries/:id"
              element={
                <ProtectedRoute>
                  <CustomizationEnquiryDetails />
                </ProtectedRoute>
              }
            />

            {/* Lead Generation Routes */}
            <Route
              path="/lead-generation"
              element={
                <ProtectedRoute>
                  <LeadGenerationList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lead-generation/:id"
              element={
                <ProtectedRoute>
                  <LeadGenerationDetails />
                </ProtectedRoute>
              }
            />

            {/* Newsletter Subscriptions Routes */}
            <Route
              path="/newsletter-subscriptions"
              element={
                <ProtectedRoute>
                  <NewsletterSubscriptionsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/newsletter-subscriptions/:id"
              element={
                <ProtectedRoute>
                  <NewsletterSubscriptionDetails />
                </ProtectedRoute>
              }
            />

            {/* Project Enquiries Routes */}
            <Route
              path="/project-enquiries"
              element={
                <ProtectedRoute>
                  <ProjectEnquiriesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project-enquiries/:id"
              element={
                <ProtectedRoute>
                  <ProjectEnquiryDetails />
                </ProtectedRoute>
              }
            />

            {/* PROJECTS CMS Route */}
            <Route
              path="/projects-cms"
              element={
                <ProtectedRoute>
                  <ProjectsCmsForm />
                </ProtectedRoute>
              }
            />

            {/* Project Category Routes */}
            <Route
              path="/project-category"
              element={
                <ProtectedRoute>
                  <ProjectCategoryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project-category/create"
              element={
                <ProtectedRoute>
                  <ProjectCategoryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project-category/edit/:id"
              element={
                <ProtectedRoute>
                  <ProjectCategoryForm />
                </ProtectedRoute>
              }
            />

            {/* Projects List Routes */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <ProjectsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <ProtectedRoute>
                  <ProjectsForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/edit/:id"
              element={
                <ProtectedRoute>
                  <ProjectsForm />
                </ProtectedRoute>
              }
            />

            {/* Specialised Areas Routes */}
            <Route
              path="/specialised-areas"
              element={
                <ProtectedRoute>
                  <SpecialisedAreasList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/specialised-areas/create"
              element={
                <ProtectedRoute>
                  <SpecialisedAreasForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/specialised-areas/edit/:id"
              element={
                <ProtectedRoute>
                  <SpecialisedAreasForm />
                </ProtectedRoute>
              }
            />

            {/* Project Images Routes */}
            <Route
              path="/project-images"
              element={
                <ProtectedRoute>
                  <ProjectImagesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project-images/create"
              element={
                <ProtectedRoute>
                  <ProjectImagesForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project-images/edit/:id"
              element={
                <ProtectedRoute>
                  <ProjectImagesForm />
                </ProtectedRoute>
              }
            />

            {/* LOGIN/REGISTER CMS Route */}
            <Route
              path="/login-register-cms"
              element={
                <ProtectedRoute>
                  <LoginRegisterCmsForm />
                </ProtectedRoute>
              }
            />

            {/* AUTH CMS Route */}
            <Route
              path="/auth-cms"
              element={
                <ProtectedRoute>
                  <AuthCmsForm />
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

            {/* Ergonomic Guide CMS Route */}
            <Route
              path="/ergonomic-guide-cms"
              element={
                <ProtectedRoute>
                  <ErgonomicGuideCmsForm />
                </ProtectedRoute>
              }
            />

            {/* Ergomnemic chair features */}
            <Route
              path="/ergonomic-chair-features"
              element={
                <ProtectedRoute>
                  <ErgonomicFeaturesList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ergonomic-chair-features/create"
              element={
                <ProtectedRoute>
                  <ErgonomicFeaturesForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ergonomic-chair-features/edit/:id"
              element={
                <ProtectedRoute>
                  <ErgonomicFeaturesForm />
                </ProtectedRoute>
              }
            />

            {/* MATERIALS CMS Route */}
            <Route
              path="/materials-cms"
              element={
                <ProtectedRoute>
                  <MaterialsCmsForm />
                </ProtectedRoute>
              }
            />

            {/* DELIVERY CMS Route */}
            <Route
              path="/delivery-cms"
              element={
                <ProtectedRoute>
                  <DeliveryCmsForm />
                </ProtectedRoute>
              }
            />

            {/* Delivery Time Routes */}
            <Route
              path="/delivery-time"
              element={
                <ProtectedRoute>
                  <DeliveryTimeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery-time/create"
              element={
                <ProtectedRoute>
                  <DeliveryTimeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery-time/edit/:id"
              element={
                <ProtectedRoute>
                  <DeliveryTimeForm />
                </ProtectedRoute>
              }
            />

            {/* Delivery Method Routes */}
            <Route
              path="/delivery-method"
              element={
                <ProtectedRoute>
                  <DeliveryMethodList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery-method/create"
              element={
                <ProtectedRoute>
                  <DeliveryMethodForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delivery-method/edit/:id"
              element={
                <ProtectedRoute>
                  <DeliveryMethodForm />
                </ProtectedRoute>
              }
            />

            {/* Material Category Routes */}
            <Route
              path="/materials-category"
              element={
                <ProtectedRoute>
                  <MaterialsCategoryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials-category/create"
              element={
                <ProtectedRoute>
                  <MaterialsCategoryForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials-category/edit/:id"
              element={
                <ProtectedRoute>
                  <MaterialsCategoryForm />
                </ProtectedRoute>
              }
            />

            {/* Materials Routes */}
            <Route
              path="/materials"
              element={
                <ProtectedRoute>
                  <MaterialsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials/create"
              element={
                <ProtectedRoute>
                  <MaterialsForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/materials/edit/:id"
              element={
                <ProtectedRoute>
                  <MaterialsForm />
                </ProtectedRoute>
              }
            />

            {/* Extra Materials Routes */}
            <Route
              path="/extra-materials"
              element={
                <ProtectedRoute>
                  <ExtraMaterialsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/extra-materials/create"
              element={
                <ProtectedRoute>
                  <ExtraMaterialsForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/extra-materials/edit/:id"
              element={
                <ProtectedRoute>
                  <ExtraMaterialsForm />
                </ProtectedRoute>
              }
            />

            {/* About Testimonials Routes */}
            <Route
              path="/about-testimonials"
              element={
                <ProtectedRoute>
                  <AboutTestimonialsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about-testimonials/create"
              element={
                <ProtectedRoute>
                  <AboutTestimonialsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about-testimonials/edit/:id"
              element={
                <ProtectedRoute>
                  <AboutTestimonialsForm />
                </ProtectedRoute>
              }
            />

            {/* About Journeys Routes */}
            <Route
              path="/about-journeys"
              element={
                <ProtectedRoute>
                  <AboutJourneysList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about-journeys/create"
              element={
                <ProtectedRoute>
                  <AboutJourneysForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about-journeys/edit/:id"
              element={
                <ProtectedRoute>
                  <AboutJourneysForm />
                </ProtectedRoute>
              }
            />

            {/* About Our Clients Routes */}
            <Route
              path="/about-our-clients"
              element={
                <ProtectedRoute>
                  <AboutOurClientsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about-our-clients/create"
              element={
                <ProtectedRoute>
                  <AboutOurClientsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about-our-clients/edit/:id"
              element={
                <ProtectedRoute>
                  <AboutOurClientsForm />
                </ProtectedRoute>
              }
            />

            {/* Why BOSQ Routes */}
            <Route
              path="/why-bosq"
              element={
                <ProtectedRoute>
                  <WhyBosqList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/why-bosq/create"
              element={
                <ProtectedRoute>
                  <WhyBosqForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/why-bosq/edit/:id"
              element={
                <ProtectedRoute>
                  <WhyBosqForm />
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

            {/* Customization CMS Route */}
            <Route
              path="/customization-cms"
              element={
                <ProtectedRoute>
                  <CustomizationCmsForm />
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

            {/* News CMS Route */}
            <Route
              path="/news-cms"
              element={
                <ProtectedRoute>
                  <NewsCmsForm />
                </ProtectedRoute>
              }
            />

            {/* Customization CMS Route */}
            <Route
              path="/customization-cms"
              element={
                <ProtectedRoute>
                  <CustomizationCmsForm />
                </ProtectedRoute>
              }
            />

            {/* News Routes */}
            <Route
              path="/news"
              element={
                <ProtectedRoute>
                  <NewsList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/news/create"
              element={
                <ProtectedRoute>
                  <NewsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/news/edit/:id"
              element={
                <ProtectedRoute>
                  <NewsForm />
                </ProtectedRoute>
              }
            />

            {/* Privacy Policy CMS Route */}
            <Route
              path="/privacy-policy-cms"
              element={
                <ProtectedRoute>
                  <PrivacyPolicyCmsForm />
                </ProtectedRoute>
              }
            />

            {/* Privacy Policy CRUD Routes */}

            <Route
              path="/privacy-policy"
              element={
                <ProtectedRoute>
                  <PrivacyPolicyList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/privacy-policy/new"
              element={
                <ProtectedRoute>
                  <PrivacyPolicyForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/privacy-policy/:id/edit"
              element={
                <ProtectedRoute>
                  <PrivacyPolicyForm />
                </ProtectedRoute>
              }
            />

            {/* Warranty Policy CRUD Routes */}
            <Route
              path="/warranty-policy"
              element={
                <ProtectedRoute>
                  <WarrantyPolicyList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warranty-policy/new"
              element={
                <ProtectedRoute>
                  <WarrantyPolicyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warranty-policy/:id/edit"
              element={
                <ProtectedRoute>
                  <WarrantyPolicyForm />
                </ProtectedRoute>
              }
            />

            {/* Terms and Conditions CMS Route */}
            <Route
              path="/terms-and-conditions-cms"
              element={
                <ProtectedRoute>
                  <TermsAndConditionsCmsForm />
                </ProtectedRoute>
              }
            />

            {/* terms and conditions faq */}
            <Route
              path="/terms-and-conditions-faq"
              element={
                <ProtectedRoute>
                  <TermsAndConditionsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/terms-and-conditions-faq/create"
              element={
                <ProtectedRoute>
                  <TermsAndConditionsFaqListForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/terms-and-conditions-faq/:id/edit"
              element={
                <ProtectedRoute>
                  <TermsAndConditionsFaqListForm />
                </ProtectedRoute>
              }
            />

            {/* Return Policy CMS Route */}
            <Route
              path="/return-policy-cms"
              element={
                <ProtectedRoute>
                  <ReturnPolicyCmsForm />
                </ProtectedRoute>
              }
            />

            {/* Return Policy CRUD Routes */}
            <Route
              path="/return-policy"
              element={
                <ProtectedRoute>
                  <ReturnPolicyList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/return-policy/new"
              element={
                <ProtectedRoute>
                  <ReturnPolicyForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/return-policy/:id/edit"
              element={
                <ProtectedRoute>
                  <ReturnPolicyForm />
                </ProtectedRoute>
              }
            />

            {/* Sustainability Cms */}
            <Route
              path="/sustainability-cms"
              element={
                <ProtectedRoute>
                  <SustainabilityCmsForm />
                </ProtectedRoute>
              }
            />

            {/* Enquiry Dropdown Routes */}
            <Route
              path="/master/enquiry-dropdown"
              element={
                <ProtectedRoute>
                  <EnquiryDropdownList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/master/enquiry-dropdown/create"
              element={
                <ProtectedRoute>
                  <EnquiryDropdownForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/master/enquiry-dropdown/edit/:id"
              element={
                <ProtectedRoute>
                  <EnquiryDropdownForm />
                </ProtectedRoute>
              }
            />

            {/* Sustainability */}
            <Route
              path="/sustainability"
              element={
                <ProtectedRoute>
                  <SustainabilityList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sustainability/create"
              element={
                <ProtectedRoute>
                  <SustainabilityForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sustainability/:id/edit"
              element={
                <ProtectedRoute>
                  <SustainabilityForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />

            {/* Orders Routes */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/coupons"
              element={
                <ProtectedRoute>
                  <CouponsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coupons/create"
              element={
                <ProtectedRoute>
                  <CouponsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/coupons/edit/:id"
              element={
                <ProtectedRoute>
                  <CouponsForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/landing-page"
              element={
                <ProtectedRoute>
                  <LandingPageList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/landing-page/create"
              element={
                <ProtectedRoute>
                  <LandingPageForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/landing-page/edit/:id"
              element={
                <ProtectedRoute>
                  <LandingPageForm />
                </ProtectedRoute>
              }
            />

            {/* Product Type Routes (nested under Landing Page) */}
            <Route
              path="/product-types/:landingPageId/list"
              element={
                <ProtectedRoute>
                  <ProductTypeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-types/:landingPageId/create"
              element={
                <ProtectedRoute>
                  <ProductTypeForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product-types/:landingPageId/edit/:id"
              element={
                <ProtectedRoute>
                  <ProductTypeForm />
                </ProtectedRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

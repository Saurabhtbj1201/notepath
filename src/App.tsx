import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CookieConsent } from "./components/CookieConsent";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthModal } from "./components/AuthModal";
import { Skeleton } from "./components/ui/skeleton";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Blog = lazy(() => import("./pages/Blog"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const SubmitArticle = lazy(() => import("./pages/SubmitArticle"));
const EditArticle = lazy(() => import("./pages/EditArticle"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const Achievements = lazy(() => import("./pages/Achievements"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  </div>
);

const AuthModalWrapper = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    // Only show modal if user is not logged in
    if (!user) {
      const timer = setTimeout(() => {
        // Check if user has dismissed the modal before
        const dismissed = sessionStorage.getItem('authModalDismissed');
        if (!dismissed) {
          setShowAuthModal(true);
        }
      }, 5000); // 5 seconds delay

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleOpenChange = (open: boolean) => {
    setShowAuthModal(open);
    if (!open) {
      sessionStorage.setItem('authModalDismissed', 'true');
    }
  };

  return <AuthModal open={showAuthModal} onOpenChange={handleOpenChange} />;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/submit-article" element={<SubmitArticle />} />
                      <Route path="/edit-article/:id" element={<EditArticle />} />
                      <Route path="/article/:id" element={<ArticleDetail />} />
                      <Route path="/profile/:id" element={<PublicProfile />} />
                      <Route path="/achievements" element={<Achievements />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <CookieConsent />
                <AuthModalWrapper />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
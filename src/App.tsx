import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Products from "./pages/Products";
import StarkLedger from "./pages/products/StarkLedger";
import CompetitiveHabitTracker from "./pages/products/CompetitiveHabitTracker";
import NeuralTarot from "./pages/products/NeuralTarot";
import FutureAiClubProduct from "./pages/products/FutureAiClub";
import FutureAiClub from "./pages/FutureAiClub";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import PageLoader from "./components/PageLoader";
import ScrollProgress from "./components/ScrollProgress";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PageLoader />
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <ScrollToTop />
          <ScrollProgress />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/starkledger" element={<StarkLedger />} />
            <Route path="/products/competitive-habit-tracker" element={<CompetitiveHabitTracker />} />
            <Route path="/products/neural-tarot" element={<NeuralTarot />} />
            <Route path="/products/future-ai-club" element={<FutureAiClubProduct />} />
            <Route path="/future-ai-club" element={<FutureAiClub />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

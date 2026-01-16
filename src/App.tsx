import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import StarkLedger from "./pages/products/StarkLedger";
import CompetitiveHabitTracker from "./pages/products/CompetitiveHabitTracker";
import NeuralTarot from "./pages/products/NeuralTarot";
import NotFound from "./pages/NotFound";
import ReactorIgnition from "./components/ReactorIgnition";
import CustomCursor from "./components/CustomCursor";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isLoading && <CustomCursor />}
        <AnimatePresence mode="wait">
          {isLoading && (
            <ReactorIgnition onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/starkledger" element={<StarkLedger />} />
            <Route path="/products/competitive-habit-tracker" element={<CompetitiveHabitTracker />} />
            <Route path="/products/neural-tarot" element={<NeuralTarot />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

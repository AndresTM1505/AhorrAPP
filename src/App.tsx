import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import Main from "./pages/Main";
import NewExpense from "./pages/NewExpense";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TransactionsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/main" element={<Main />} />
            <Route path="/new-expense" element={<NewExpense />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TransactionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

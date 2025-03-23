
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Chats from "./pages/Chats";
import Contacts from "./pages/Contacts";
import Stories from "./pages/Stories";
import Calls from "./pages/Calls";
import VideoCalls from "./pages/VideoCalls";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ChatDetail from "./pages/ChatDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route path="/chats" element={<Chats />} />
            <Route path="/chats/:id" element={<ChatDetail />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/video-calls" element={<VideoCalls />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

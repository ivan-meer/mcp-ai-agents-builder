import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AgentEditor from "./components/AgentBuilder/AgentEditor";
import TemplateSelector from "./components/AgentBuilder/TemplateSelector";
import SettingsScreen from "./components/Settings/SettingsScreen";
import ChatInterface from "./components/Chat/ChatInterface";
import { Button } from "./components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { Moon, Sun } from "lucide-react";
import routes from "tempo-routes";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Button
          variant="outline"
          size="icon"
          className="theme-toggle"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agent-editor/:id?" element={<AgentEditor />} />
          <Route path="/templates" element={<TemplateSelector />} />
          <Route path="/my-agents" element={<Home />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/chat" element={<ChatInterface />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Toaster />
      </>
    </Suspense>
  );
}

export default App;

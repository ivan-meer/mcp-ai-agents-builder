import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Settings,
  Layout,
  FolderOpen,
  LayoutTemplate,
  Home as HomeIcon,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCreateNewAgent = () => {
    navigate("/templates");
  };

  const handleOpenChat = () => {
    navigate("/chat");
  };

  const handleEditAgent = (agentId: string) => {
    navigate(`/agent-editor/${agentId}`);
  };

  const handleUseTemplate = (templateId: string) => {
    navigate(`/agent-editor/new?template=${templateId}`);
  };

  // Mock data for recently edited agents
  const recentAgents = [
    {
      id: "1",
      name: "Customer Support Agent",
      description: "Handles customer inquiries and support tickets",
      lastEdited: "2 hours ago",
      type: "Chat",
    },
    {
      id: "2",
      name: "Data Analysis Assistant",
      description: "Helps analyze and visualize data from various sources",
      lastEdited: "1 day ago",
      type: "Sidebar",
    },
    {
      id: "3",
      name: "Task Manager",
      description: "Helps organize and prioritize tasks",
      lastEdited: "3 days ago",
      type: "Popup",
    },
  ];

  // Mock data for templates
  const templates = [
    {
      id: "1",
      name: "Customer Support",
      description: "Pre-configured agent for handling customer inquiries",
      type: "Chat",
      image:
        "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80",
    },
    {
      id: "2",
      name: "Data Analysis",
      description: "Agent for analyzing and visualizing data",
      type: "Sidebar",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    },
    {
      id: "3",
      name: "Task Management",
      description: "Agent for organizing and prioritizing tasks",
      type: "Popup",
      image:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80",
    },
    {
      id: "4",
      name: "Knowledge Base",
      description: "Agent for accessing and searching knowledge base",
      type: "Chat",
      image:
        "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=600&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-card border-r
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b lg:border-b-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">
                    AB
                  </span>
                </div>
                <h1 className="text-lg lg:text-xl font-bold truncate">
                  Agent Builder
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent text-accent-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HomeIcon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Dashboard</span>
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Chat</span>
              </Link>
              <Link
                to="/my-agents"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FolderOpen className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">My Agents</span>
              </Link>
              <Link
                to="/templates"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutTemplate className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Templates</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">Settings</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">
                    Manage your AI agents and templates
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
              {/* Action Buttons */}
              <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="gap-2 flex-1 sm:flex-none"
                  onClick={handleCreateNewAgent}
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Create New Agent</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 flex-1 sm:flex-none"
                  onClick={handleOpenChat}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Open Chat</span>
                </Button>
              </div>

              {/* Tabs for Recent and Templates */}
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="mb-6 w-full sm:w-auto">
                  <TabsTrigger value="recent" className="flex-1 sm:flex-none">
                    <span className="hidden sm:inline">Recently Edited</span>
                    <span className="sm:hidden">Recent</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="templates"
                    className="flex-1 sm:flex-none"
                  >
                    Templates
                  </TabsTrigger>
                </TabsList>

                {/* Recently Edited Agents */}
                <TabsContent value="recent" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {recentAgents.map((agent) => (
                      <Card
                        key={agent.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-base lg:text-lg line-clamp-2">
                              {agent.name}
                            </CardTitle>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted whitespace-nowrap flex-shrink-0">
                              {agent.type}
                            </span>
                          </div>
                          <CardDescription className="text-sm line-clamp-2">
                            {agent.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Last edited: {agent.lastEdited}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleEditAgent(agent.id)}
                          >
                            Edit
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Templates */}
                <TabsContent value="templates" className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={template.image}
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-2">
                            <CardTitle className="text-base lg:text-lg line-clamp-2">
                              {template.name}
                            </CardTitle>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted whitespace-nowrap flex-shrink-0">
                              {template.type}
                            </span>
                          </div>
                          <CardDescription className="text-sm line-clamp-3">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <Button
                            className="w-full"
                            onClick={() => handleUseTemplate(template.id)}
                          >
                            Use Template
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowLeft } from "lucide-react";

interface TemplateProps {
  id: string;
  title: string;
  description: string;
  category: string;
  uiType: "Chat" | "Popup" | "Sidebar";
  imageUrl: string;
  onSelect?: (id: string) => void;
}

const TemplateCard = ({
  template,
  onSelect = () => {},
}: {
  template: TemplateProps;
  onSelect?: (id: string) => void;
}) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full bg-card hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={template.imageUrl}
          alt={template.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <Badge className="absolute top-2 right-2" variant="secondary">
          {template.uiType}
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-base lg:text-lg line-clamp-2">
          {template.title}
        </CardTitle>
        <CardDescription className="text-xs">
          {template.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {template.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={() => onSelect(template.id)} className="w-full">
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};

const TemplateSelector = ({
  onSelectTemplate,
}: {
  onSelectTemplate?: (id: string) => void;
}) => {
  const navigate = useNavigate();

  const handleSelectTemplate = (id: string) => {
    if (onSelectTemplate) {
      onSelectTemplate(id);
    } else {
      navigate(`/agent-editor/new?template=${id}`);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Mock template data
  const templates: TemplateProps[] = [
    {
      id: "1",
      title: "Customer Support Agent",
      description:
        "AI assistant that helps answer customer questions and resolve issues with predefined actions.",
      category: "Customer Support",
      uiType: "Chat",
      imageUrl:
        "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80",
    },
    {
      id: "2",
      title: "Task Manager",
      description:
        "Create, organize and track tasks with AI assistance for prioritization and scheduling.",
      category: "Productivity",
      uiType: "Sidebar",
      imageUrl:
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    },
    {
      id: "3",
      title: "Data Analyzer",
      description:
        "Analyze and visualize data with AI-powered insights and recommendations.",
      category: "Data Analysis",
      uiType: "Popup",
      imageUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    },
    {
      id: "4",
      title: "Content Writer",
      description:
        "Generate and edit content with AI assistance for blogs, social media, and more.",
      category: "Content Creation",
      uiType: "Sidebar",
      imageUrl:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    },
    {
      id: "5",
      title: "Sales Assistant",
      description:
        "Help sales teams with lead qualification, follow-ups, and deal management.",
      category: "Sales",
      uiType: "Chat",
      imageUrl:
        "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800&q=80",
    },
    {
      id: "6",
      title: "Knowledge Base",
      description:
        "Create an AI-powered knowledge base that answers questions based on your documentation.",
      category: "Documentation",
      uiType: "Popup",
      imageUrl:
        "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=800&q=80",
    },
  ];

  // Get unique categories for filtering
  const categories = ["all", ...new Set(templates.map((t) => t.category))];

  // Filter templates based on search query and active category
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || template.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              Choose a Template
            </h2>
            <p className="text-muted-foreground">
              Select a template to get started with your AI agent
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              <span className="text-sm whitespace-nowrap">Filter by:</span>
            </div>
            <Tabs
              defaultValue="all"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="capitalize text-xs sm:text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectTemplate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                No templates found matching your criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;

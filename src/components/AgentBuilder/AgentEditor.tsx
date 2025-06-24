import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Download, Play, Settings, ArrowLeft } from "lucide-react";
import ConfigurationTabs from "./ConfigurationTabs";
import AgentPreview from "./AgentPreview";

interface AgentEditorProps {
  agentId?: string;
  initialData?: AgentConfig;
}

interface AgentConfig {
  name: string;
  description: string;
  state: Record<string, any>;
  actions: Array<{
    name: string;
    description: string;
    parameters: Record<string, any>;
  }>;
  uiType: "chat" | "popup" | "sidebar";
  styling: Record<string, any>;
}

const AgentEditor: React.FC<AgentEditorProps> = ({
  initialData = {
    name: "New Agent",
    description: "A helpful AI assistant",
    state: {},
    actions: [],
    uiType: "chat",
    styling: {
      primaryColor: "#0091ff",
      textColor: "#333333",
      fontFamily: "Inter, sans-serif",
    },
  },
}) => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("template");

  const [activeTab, setActiveTab] = useState("state");
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (templateId) {
      // Load template data based on templateId
      const templateConfigs = {
        "1": {
          name: "Customer Support Agent",
          description: "Handles customer inquiries and support tickets",
          state: { userRole: "customer", supportLevel: "basic" },
          actions: [
            {
              name: "searchFAQ",
              description: "Search FAQ database",
              parameters: {},
            },
          ],
          uiType: "chat" as const,
          styling: {
            primaryColor: "#3b82f6",
            textColor: "#1f2937",
            fontFamily: "Inter, sans-serif",
          },
        },
        "2": {
          name: "Task Manager",
          description: "Helps organize and prioritize tasks",
          state: { currentProject: "", taskCount: 0 },
          actions: [
            {
              name: "createTask",
              description: "Create a new task",
              parameters: {},
            },
          ],
          uiType: "sidebar" as const,
          styling: {
            primaryColor: "#10b981",
            textColor: "#1f2937",
            fontFamily: "Inter, sans-serif",
          },
        },
      };

      const templateConfig =
        templateConfigs[templateId as keyof typeof templateConfigs];
      if (templateConfig) {
        setAgentConfig(templateConfig);
      }
    } else if (id && id !== "new") {
      // Load existing agent data
      // This would typically fetch from an API
    }
  }, [id, templateId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Here you would save to your backend
      console.log("Saving agent config:", agentConfig);
      // Show success message
    } catch (error) {
      console.error("Failed to save agent:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate React component code
      const componentCode = `
import React from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';

const ${agentConfig.name.replace(/\s+/g, "")}Agent = () => {
  return (
    <CopilotKit>
      <CopilotChat
        instructions="${agentConfig.description}"
        // Add your custom actions here
      />
    </CopilotKit>
  );
};

export default ${agentConfig.name.replace(/\s+/g, "")}Agent;
      `;

      // Create and download file
      const blob = new Blob([componentCode], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${agentConfig.name.replace(/\s+/g, "")}.tsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export agent:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleTest = () => {
    setIsTesting(true);
    setActiveTab("preview");
    setTimeout(() => setIsTesting(false), 500);
  };

  const updateAgentConfig = (key: keyof AgentConfig, value: any) => {
    setAgentConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full h-full bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl lg:text-2xl font-bold truncate">
                {agentConfig.name}
              </h1>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {agentConfig.description}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("preview")}
              className="flex-1 sm:flex-none"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={isTesting}
              className="flex-1 sm:flex-none"
            >
              <Play className="h-4 w-4 mr-2" />
              {isTesting ? "Testing..." : "Test"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
          <Tabs
            defaultValue="state"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="state">State</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <Card className="border rounded-lg overflow-hidden">
              <TabsContent value="state" className="mt-0 p-0">
                <div className="p-4 lg:p-6">
                  <ConfigurationTabs
                    initialTab="state"
                    onTabChange={() => {}}
                  />
                </div>
              </TabsContent>

              <TabsContent value="actions" className="mt-0 p-0">
                <div className="p-4 lg:p-6">
                  <ConfigurationTabs
                    initialTab="actions"
                    onTabChange={() => {}}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0 p-0">
                <div className="h-[600px] lg:h-[700px]">
                  <AgentPreview
                    agentName={agentConfig.name}
                    agentDescription={agentConfig.description}
                    uiType={agentConfig.uiType}
                    primaryColor={agentConfig.styling.primaryColor}
                  />
                </div>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AgentEditor;

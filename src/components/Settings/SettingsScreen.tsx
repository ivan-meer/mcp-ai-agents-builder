import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Key,
  Bot,
  Zap,
  Shield,
  Server,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Globe,
  Brain,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MCPServer {
  id: string;
  name: string;
  url: string;
  connectionType: "SSE" | "STDIO";
  authToken?: string;
  description?: string;
  status: "connected" | "disconnected" | "error";
  tools?: Array<{
    name: string;
    description: string;
  }>;
  resources?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  prompts?: Array<{
    name: string;
    description: string;
  }>;
}

interface SettingsScreenProps {
  onBack?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    // API Settings
    defaultProvider: "perplexity",
    defaultModel: "sonar",
    temperature: 0.7,
    maxTokens: 1000,

    // Agent Settings
    defaultSystemPrompt:
      "You are a helpful AI assistant. Be concise and accurate in your responses.",
    enableMemory: true,
    enableTools: true,

    // UI Settings
    theme: "system",
    compactMode: false,
    showTimestamps: true,

    // Security Settings
    requireConfirmation: false,
    logConversations: true,
  });

  const [mcpServers, setMcpServers] = useState<MCPServer[]>([
    {
      id: "1",
      name: "Local File System",
      url: "stdio://mcp-server-filesystem",
      connectionType: "STDIO",
      description: "Access local file system operations",
      status: "connected",
      tools: [
        { name: "read_file", description: "Read contents of a file" },
        { name: "write_file", description: "Write content to a file" },
        { name: "list_directory", description: "List directory contents" },
      ],
      resources: [
        {
          name: "file://",
          type: "file",
          description: "Local file system access",
        },
      ],
      prompts: [
        {
          name: "analyze_code",
          description: "Analyze code structure and quality",
        },
      ],
    },
    {
      id: "2",
      name: "Web Search MCP",
      url: "https://mcp-server.example.com/sse",
      connectionType: "SSE",
      authToken: "sk-...",
      description: "Web search capabilities via MCP",
      status: "disconnected",
      tools: [
        { name: "web_search", description: "Search the web for information" },
        {
          name: "get_page_content",
          description: "Extract content from web pages",
        },
      ],
      resources: [
        { name: "web://", type: "web", description: "Web content access" },
      ],
      prompts: [
        {
          name: "research_topic",
          description: "Research a topic comprehensively",
        },
      ],
    },
  ]);

  const [showMcpForm, setShowMcpForm] = useState(false);
  const [selectedMcpServer, setSelectedMcpServer] = useState<MCPServer | null>(
    null,
  );
  const [newMcpServer, setNewMcpServer] = useState<Partial<MCPServer>>({
    name: "",
    url: "",
    connectionType: "SSE",
    authToken: "",
    description: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const providers = {
    perplexity: {
      name: "Perplexity",
      icon: <Search className="h-4 w-4" />,
      models: [
        { id: "sonar", name: "Sonar" },
        { id: "r1-1776", name: "R1-1776" },
        { id: "sonar-reasoning-pro", name: "Sonar Reasoning Pro" },
        { id: "sonar-reasoning", name: "Sonar Reasoning" },
        { id: "sonar-pro", name: "Sonar Pro" },
      ],
    },
    openai: {
      name: "OpenAI",
      icon: <Brain className="h-4 w-4" />,
      models: [
        { id: "gpt-4o", name: "GPT-4o" },
        { id: "gpt-4o-mini", name: "GPT-4o Mini" },
        { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
        { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
      ],
    },
    anthropic: {
      name: "Anthropic",
      icon: <MessageSquare className="h-4 w-4" />,
      models: [
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
        { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
        { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
        { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
      ],
    },
  };

  const availableTools = [
    {
      id: "search",
      name: "Web Search",
      description: "Search the web using Tavily",
      provider: "Tavily",
      icon: <Search className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "crawl",
      name: "Web Crawling",
      description: "Extract content from websites using Firecrawl",
      provider: "Firecrawl",
      icon: <Globe className="h-4 w-4" />,
      enabled: true,
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving to backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage for now
      localStorage.setItem("agentBuilderSettings", JSON.stringify(settings));

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddMcpServer = () => {
    if (!newMcpServer.name || !newMcpServer.url) return;

    const server: MCPServer = {
      id: Date.now().toString(),
      name: newMcpServer.name,
      url: newMcpServer.url,
      connectionType: newMcpServer.connectionType || "SSE",
      authToken: newMcpServer.authToken,
      description: newMcpServer.description,
      status: "disconnected",
      tools: [],
      resources: [],
      prompts: [],
    };

    setMcpServers((prev) => [...prev, server]);
    setNewMcpServer({
      name: "",
      url: "",
      connectionType: "SSE",
      authToken: "",
      description: "",
    });
    setShowMcpForm(false);
  };

  const handleRemoveMcpServer = (id: string) => {
    setMcpServers((prev) => prev.filter((server) => server.id !== id));
    if (selectedMcpServer?.id === id) {
      setSelectedMcpServer(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Configure your AI agent builder preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">
              <Bot className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="tools">
              <Zap className="h-4 w-4 mr-2" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="mcp">
              <Server className="h-4 w-4 mr-2" />
              MCP
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Defaults</CardTitle>
                <CardDescription>
                  Default settings for new agents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">Default System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={settings.defaultSystemPrompt}
                    onChange={(e) =>
                      updateSetting("defaultSystemPrompt", e.target.value)
                    }
                    placeholder="Enter default system prompt..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Memory</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow agents to remember conversation context
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableMemory}
                    onCheckedChange={(checked) =>
                      updateSetting("enableMemory", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Tools</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow agents to use external tools and integrations
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableTools}
                    onCheckedChange={(checked) =>
                      updateSetting("enableTools", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interface</CardTitle>
                <CardDescription>Customize the user interface</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSetting("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use a more compact interface layout
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) =>
                      updateSetting("compactMode", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Timestamps</Label>
                    <p className="text-sm text-muted-foreground">
                      Display timestamps in chat messages
                    </p>
                  </div>
                  <Switch
                    checked={settings.showTimestamps}
                    onCheckedChange={(checked) =>
                      updateSetting("showTimestamps", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Provider & Model</CardTitle>
                <CardDescription>
                  Set default AI provider and model for new chats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Select
                      value={settings.defaultProvider}
                      onValueChange={(value) =>
                        updateSetting("defaultProvider", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(providers).map(([key, provider]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {provider.icon}
                              {provider.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={settings.defaultModel}
                      onValueChange={(value) =>
                        updateSetting("defaultModel", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {providers[
                          settings.defaultProvider as keyof typeof providers
                        ]?.models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generation Parameters</CardTitle>
                <CardDescription>
                  Fine-tune AI response generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Temperature: {settings.temperature}</Label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) =>
                      updateSetting("temperature", parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower values make responses more focused, higher values more
                    creative
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) =>
                      updateSetting("maxTokens", parseInt(e.target.value))
                    }
                    min="1"
                    max="4000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of tokens in the response
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Settings */}
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Tools</CardTitle>
                <CardDescription>
                  Manage external integrations and tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {tool.icon}
                          <h4 className="font-medium">{tool.name}</h4>
                          <Badge variant="outline">{tool.provider}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                      <Switch checked={tool.enabled} disabled />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tool Configuration</CardTitle>
                <CardDescription>
                  Configure how tools are used by agents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-detect Tool Usage</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically use appropriate tools based on user queries
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Tool Usage</Label>
                    <p className="text-sm text-muted-foreground">
                      Display which tools were used in responses
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MCP Servers */}
          <TabsContent value="mcp" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>MCP Servers</CardTitle>
                    <CardDescription>
                      Manage Model Context Protocol servers for extended
                      capabilities
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowMcpForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Server
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showMcpForm && (
                  <Card className="mb-4">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Server Name</Label>
                            <Input
                              placeholder="My MCP Server"
                              value={newMcpServer.name || ""}
                              onChange={(e) =>
                                setNewMcpServer((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Connection Type</Label>
                            <Select
                              value={newMcpServer.connectionType || "SSE"}
                              onValueChange={(value: "SSE" | "STDIO") =>
                                setNewMcpServer((prev) => ({
                                  ...prev,
                                  connectionType: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SSE">
                                  SSE (Server-Sent Events)
                                </SelectItem>
                                <SelectItem value="STDIO">
                                  STDIO (Standard I/O)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Server URL</Label>
                          <Input
                            placeholder="https://mcp-server.example.com or stdio://command"
                            value={newMcpServer.url || ""}
                            onChange={(e) =>
                              setNewMcpServer((prev) => ({
                                ...prev,
                                url: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Auth Token (Optional)</Label>
                          <Input
                            type="password"
                            placeholder="Bearer token or API key"
                            value={newMcpServer.authToken || ""}
                            onChange={(e) =>
                              setNewMcpServer((prev) => ({
                                ...prev,
                                authToken: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe what this server provides..."
                            value={newMcpServer.description || ""}
                            onChange={(e) =>
                              setNewMcpServer((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddMcpServer}>
                            Add Server
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowMcpForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {mcpServers.map((server) => (
                    <div
                      key={server.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{server.name}</h4>
                          <Badge
                            variant={
                              server.status === "connected"
                                ? "default"
                                : server.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {server.status}
                          </Badge>
                          <Badge variant="outline">
                            {server.connectionType}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {server.description}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {server.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMcpServer(server)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveMcpServer(server.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedMcpServer && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{selectedMcpServer.name} Details</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMcpServer(null)}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="tools" className="w-full">
                    <TabsList>
                      <TabsTrigger value="tools">Tools</TabsTrigger>
                      <TabsTrigger value="resources">Resources</TabsTrigger>
                      <TabsTrigger value="prompts">Prompts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tools" className="space-y-2">
                      {selectedMcpServer.tools?.length ? (
                        selectedMcpServer.tools.map((tool, index) => (
                          <div key={index} className="p-3 border rounded">
                            <h5 className="font-medium">{tool.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {tool.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No tools available
                        </p>
                      )}
                    </TabsContent>
                    <TabsContent value="resources" className="space-y-2">
                      {selectedMcpServer.resources?.length ? (
                        selectedMcpServer.resources.map((resource, index) => (
                          <div key={index} className="p-3 border rounded">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium">{resource.name}</h5>
                              <Badge variant="outline">{resource.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {resource.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No resources available
                        </p>
                      )}
                    </TabsContent>
                    <TabsContent value="prompts" className="space-y-2">
                      {selectedMcpServer.prompts?.length ? (
                        selectedMcpServer.prompts.map((prompt, index) => (
                          <div key={index} className="p-3 border rounded">
                            <h5 className="font-medium">{prompt.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {prompt.description}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          No prompts available
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Control data handling and security features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Ask for confirmation before sending sensitive data
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireConfirmation}
                    onCheckedChange={(checked) =>
                      updateSetting("requireConfirmation", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log Conversations</Label>
                    <p className="text-sm text-muted-foreground">
                      Save conversation history for debugging and improvement
                    </p>
                  </div>
                  <Switch
                    checked={settings.logConversations}
                    onCheckedChange={(checked) =>
                      updateSetting("logConversations", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your data and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Export All Data
                </Button>
                <Button variant="outline" className="w-full">
                  Clear Conversation History
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete All Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

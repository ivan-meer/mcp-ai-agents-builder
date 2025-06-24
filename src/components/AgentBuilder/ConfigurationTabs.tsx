import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Trash2,
  Code,
  Settings,
  Eye,
  Database,
  Zap,
  Search,
  Globe,
} from "lucide-react";

interface ConfigurationTabsProps {
  onTabChange?: (tab: string) => void;
  initialTab?: string;
}

const ConfigurationTabs = ({
  onTabChange = () => {},
  initialTab = "state",
}: ConfigurationTabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <div className="w-full h-full bg-background">
      <Tabs
        defaultValue={activeTab}
        onValueChange={handleTabChange}
        className="w-full h-full flex flex-col"
      >
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="state"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
            >
              <Database className="mr-2 h-4 w-4" />
              State
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
            >
              <Code className="mr-2 h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <TabsContent value="state" className="h-full mt-0">
            <StateTabContent />
          </TabsContent>

          <TabsContent value="actions" className="h-full mt-0">
            <ActionsTabContent />
          </TabsContent>

          <TabsContent value="preview" className="h-full mt-0">
            <PreviewTabContent />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const StateTabContent = () => {
  const [contextItems, setContextItems] = useState([
    { id: "1", key: "user", value: '{ name: "John Doe", role: "Admin" }' },
    {
      id: "2",
      key: "settings",
      value: '{ theme: "dark", notifications: true }',
    },
  ]);

  const addContextItem = () => {
    const newId = String(Date.now());
    setContextItems([...contextItems, { id: newId, key: "", value: "" }]);
  };

  const removeContextItem = (id: string) => {
    if (contextItems.length > 1) {
      setContextItems(contextItems.filter((item) => item.id !== id));
    }
  };

  const updateContextItem = (
    id: string,
    field: "key" | "value",
    value: string,
  ) => {
    setContextItems(
      contextItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Agent Context</h2>
        <p className="text-muted-foreground mb-6">
          Define the state and context that your agent can access and reference
          during conversations.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Agent Properties</h3>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agent Name</Label>
                <Input
                  id="agentName"
                  placeholder="My Assistant"
                  defaultValue="Customer Support Agent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentRole">Agent Role</Label>
                <Input
                  id="agentRole"
                  placeholder="Assistant"
                  defaultValue="Customer Support Specialist"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentDescription">Description</Label>
              <Textarea
                id="agentDescription"
                placeholder="Describe what your agent does..."
                defaultValue="A helpful customer support agent that can answer questions about products, handle returns, and escalate issues when necessary."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                placeholder="Instructions for your agent..."
                defaultValue="You are a customer support specialist for an e-commerce store. Be friendly, helpful, and concise. Always try to resolve the customer's issue, but escalate to a human agent when necessary."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Context Variables</h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="enableMemory" className="cursor-pointer">
                  Enable Memory
                </Label>
                <Switch id="enableMemory" defaultChecked />
              </div>
            </div>

            <Separator />

            {contextItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4">
                <div className="col-span-3">
                  <Input
                    placeholder="Variable name"
                    value={item.key}
                    onChange={(e) =>
                      updateContextItem(item.id, "key", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-8">
                  <Textarea
                    placeholder="Value (JSON, string, or number)"
                    value={item.value}
                    onChange={(e) =>
                      updateContextItem(item.id, "value", e.target.value)
                    }
                    className="min-h-[60px]"
                  />
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeContextItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addContextItem}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Context Variable
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ActionsTabContent = () => {
  const [actions, setActions] = useState([
    {
      id: "1",
      name: "searchProducts",
      description: "Search for products in the catalog",
      parameters: [
        { name: "query", type: "string", description: "Search query" },
        {
          name: "category",
          type: "string",
          description: "Product category",
          optional: true,
        },
      ],
      code: 'async function searchProducts({ query, category }) {\n  // Implementation would go here\n  console.log(`Searching for ${query} in ${category || "all categories"}");\n  return { results: [] };\n}',
    },
    {
      id: "2",
      name: "createReturn",
      description: "Create a return request for a purchased item",
      parameters: [
        { name: "orderId", type: "string", description: "Order ID" },
        { name: "reason", type: "string", description: "Reason for return" },
      ],
      code: 'async function createReturn({ orderId, reason }) {\n  // Implementation would go here\n  console.log(`Creating return for order ${orderId} with reason: ${reason}");\n  return { success: true, returnId: "RET-123" };\n}',
    },
  ]);

  const [availableTools, setAvailableTools] = useState([
    {
      id: "search",
      name: "Web Search",
      description: "Search the web for information using Tavily",
      icon: Search,
      provider: "Tavily",
      enabled: false,
    },
    {
      id: "crawl",
      name: "Web Crawling",
      description: "Extract content from websites using Firecrawl",
      icon: Globe,
      provider: "Firecrawl",
      enabled: false,
    },
  ]);

  const [selectedAction, setSelectedAction] = useState(actions[0]);

  const addAction = () => {
    const newAction = {
      id: String(Date.now()),
      name: `newAction${actions.length + 1}`,
      description: "Description for the new action",
      parameters: [],
      code: `async function newAction${actions.length + 1}(params) {\n  // Implementation goes here\n  console.log('Action executed with params:', params);\n  return { success: true };\n}`,
    };
    setActions([...actions, newAction]);
    setSelectedAction(newAction);
  };

  const removeAction = (id: string) => {
    if (actions.length > 1) {
      const updatedActions = actions.filter((action) => action.id !== id);
      setActions(updatedActions);
      if (selectedAction.id === id) {
        setSelectedAction(updatedActions[0] || actions[0]);
      }
    }
  };

  const updateAction = (id: string, field: string, value: any) => {
    const updatedActions = actions.map((action) =>
      action.id === id ? { ...action, [field]: value } : action,
    );
    setActions(updatedActions);
    if (selectedAction.id === id) {
      setSelectedAction({ ...selectedAction, [field]: value });
    }
  };

  const addParameter = () => {
    const newParam = {
      name: `param${selectedAction.parameters.length + 1}`,
      type: "string",
      description: "Parameter description",
      optional: false,
    };
    const updatedParams = [...selectedAction.parameters, newParam];
    updateAction(selectedAction.id, "parameters", updatedParams);
  };

  const removeParameter = (index: number) => {
    const updatedParams = selectedAction.parameters.filter(
      (_, i) => i !== index,
    );
    updateAction(selectedAction.id, "parameters", updatedParams);
  };

  const toggleTool = (toolId: string) => {
    setAvailableTools((tools) =>
      tools.map((tool) =>
        tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool,
      ),
    );
  };

  return (
    <div className="h-full flex">
      <div className="w-1/4 border-r pr-4 h-full overflow-y-auto">
        <div className="space-y-6">
          {/* Tools Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Tools
              </h3>
            </div>
            <div className="space-y-2">
              {availableTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      tool.enabled
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleTool(tool.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{tool.name}</span>
                      </div>
                      <Switch checked={tool.enabled} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Actions Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Custom Actions</h3>
              <Button variant="ghost" size="sm" onClick={addAction}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant={
                    selectedAction.id === action.id ? "secondary" : "ghost"
                  }
                  className="w-full justify-start text-left"
                  onClick={() => setSelectedAction(action)}
                >
                  {action.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pl-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Tools Configuration */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Agent Tools & Actions</h2>
            <p className="text-muted-foreground mb-6">
              Configure tools and custom actions to extend your agent's
              capabilities.
            </p>
          </div>

          {/* Enabled Tools Summary */}
          {availableTools.some((tool) => tool.enabled) && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Enabled Tools</h3>
                <div className="grid grid-cols-1 gap-4">
                  {availableTools
                    .filter((tool) => tool.enabled)
                    .map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <div
                          key={tool.id}
                          className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                        >
                          <IconComponent className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <h4 className="font-medium">{tool.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {tool.description}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            via {tool.provider}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Actions */}
          {selectedAction && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">{selectedAction.name}</h3>
                    <p className="text-muted-foreground">
                      Configure this custom action to extend your agent's
                      capabilities.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="actionName">Action Name</Label>
                      <Input
                        id="actionName"
                        value={selectedAction.name}
                        onChange={(e) =>
                          updateAction(
                            selectedAction.id,
                            "name",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actionDescription">Description</Label>
                      <Textarea
                        id="actionDescription"
                        value={selectedAction.description}
                        onChange={(e) =>
                          updateAction(
                            selectedAction.id,
                            "description",
                            e.target.value,
                          )
                        }
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Parameters</Label>
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          {selectedAction.parameters.map((param, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-12 gap-4"
                            >
                              <div className="col-span-3">
                                <Input
                                  placeholder="Name"
                                  value={param.name}
                                  onChange={(e) => {
                                    const updatedParams = [
                                      ...selectedAction.parameters,
                                    ];
                                    updatedParams[index] = {
                                      ...param,
                                      name: e.target.value,
                                    };
                                    updateAction(
                                      selectedAction.id,
                                      "parameters",
                                      updatedParams,
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  placeholder="Type"
                                  value={param.type}
                                  onChange={(e) => {
                                    const updatedParams = [
                                      ...selectedAction.parameters,
                                    ];
                                    updatedParams[index] = {
                                      ...param,
                                      type: e.target.value,
                                    };
                                    updateAction(
                                      selectedAction.id,
                                      "parameters",
                                      updatedParams,
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-span-6">
                                <Input
                                  placeholder="Description"
                                  value={param.description}
                                  onChange={(e) => {
                                    const updatedParams = [
                                      ...selectedAction.parameters,
                                    ];
                                    updatedParams[index] = {
                                      ...param,
                                      description: e.target.value,
                                    };
                                    updateAction(
                                      selectedAction.id,
                                      "parameters",
                                      updatedParams,
                                    );
                                  }}
                                />
                              </div>
                              <div className="col-span-1 flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeParameter(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addParameter}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Parameter
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actionCode">Implementation</Label>
                      <Textarea
                        id="actionCode"
                        value={selectedAction.code}
                        onChange={(e) =>
                          updateAction(
                            selectedAction.id,
                            "code",
                            e.target.value,
                          )
                        }
                        className="min-h-[200px] font-mono text-sm"
                        placeholder="Enter your action implementation here..."
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAction(selectedAction.id)}
                        disabled={actions.length <= 1}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Action
                      </Button>
                      <div className="flex space-x-2">
                        <Button variant="outline">Test Action</Button>
                        <Button>Save Action</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const PreviewTabContent = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Agent Preview</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Test your agent in a sandbox environment to see how it responds to
          different inputs.
        </p>
        <Button>
          <Eye className="mr-2 h-4 w-4" />
          Open Preview
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationTabs;

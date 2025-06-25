import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Send,
  Bot,
  User,
  Settings,
  Loader2,
  X,
  ArrowLeft,
  Zap,
  Search,
  Globe,
  Brain,
  MessageSquare,
  Paperclip,
  Server,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
}

interface ChatInterfaceProps {
  agentConfig?: {
    name: string;
    description: string;
    systemPrompt?: string;
    tools?: string[];
  };
  onSettingsClick?: () => void;
  onClose?: () => void;
  onBack?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agentConfig = {
    name: "AI Assistant",
    description: "A helpful AI assistant",
    systemPrompt: "You are a helpful AI assistant.",
    tools: [],
  },
  onSettingsClick,
  onClose,
  onBack,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello! I'm ${agentConfig.name}. ${agentConfig.description} How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("perplexity");
  const [selectedModel, setSelectedModel] = useState("sonar");
  const [availableModels, setAvailableModels] = useState<Record<string, any[]>>(
    {},
  );
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>(["search"]);
  const [selectedAgent, setSelectedAgent] = useState("default");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      description: "Search the web for information",
      icon: <Search className="h-4 w-4" />,
      provider: "Tavily",
    },
    {
      id: "crawl",
      name: "Web Crawl",
      description: "Extract content from websites",
      icon: <Globe className="h-4 w-4" />,
      provider: "Firecrawl",
    },
  ];

  const availableAgents = [
    {
      id: "default",
      name: "Default Assistant",
      description: "General purpose AI assistant",
    },
    {
      id: "customer-support",
      name: "Customer Support",
      description: "Specialized for customer inquiries",
    },
    {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Helps with data analysis tasks",
    },
    {
      id: "task-manager",
      name: "Task Manager",
      description: "Organizes and prioritizes tasks",
    },
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    loadModels();
  }, [selectedProvider]);

  const loadModels = async () => {
    if (availableModels[selectedProvider]) return;

    setLoadingModels(true);
    try {
      let functionName = "";
      switch (selectedProvider) {
        case "openai":
          functionName = "supabase-functions-openai-models";
          break;
        case "anthropic":
          functionName = "supabase-functions-anthropic-models";
          break;
        default:
          // Perplexity uses static models
          setAvailableModels((prev) => ({
            ...prev,
            [selectedProvider]:
              providers[selectedProvider as keyof typeof providers].models,
          }));
          setLoadingModels(false);
          return;
      }

      const { data, error } = await supabase.functions.invoke(functionName);

      if (error) throw error;

      let models = [];
      if (selectedProvider === "openai") {
        models =
          data.data?.map((model: any) => ({
            id: model.id,
            name: model.id,
          })) || [];
      } else if (selectedProvider === "anthropic") {
        models =
          data.data?.map((model: any) => ({
            id: model.id,
            name: model.display_name || model.id,
          })) || [];
      }

      setAvailableModels((prev) => ({
        ...prev,
        [selectedProvider]: models,
      }));

      if (
        models.length > 0 &&
        !models.find((m: any) => m.id === selectedModel)
      ) {
        setSelectedModel(models[0].id);
      }
    } catch (error) {
      console.error("Failed to load models:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить модели",
        variant: "destructive",
      });
    } finally {
      setLoadingModels(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTool = (toolId: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId],
    );
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Check if we need to use tools first
      const shouldUseSearch =
        selectedTools.includes("search") &&
        (inputValue.toLowerCase().includes("search") ||
          inputValue.toLowerCase().includes("find") ||
          inputValue.toLowerCase().includes("найди") ||
          inputValue.toLowerCase().includes("поиск"));

      let searchResults = null;
      if (shouldUseSearch) {
        try {
          const { data: searchData } = await supabase.functions.invoke(
            "supabase-functions-search",
            {
              body: { query: inputValue },
            },
          );
          searchResults = searchData;
        } catch (searchError) {
          console.warn("Search failed:", searchError);
        }
      }

      // Prepare agent-specific system prompt
      const selectedAgentConfig = availableAgents.find(
        (a) => a.id === selectedAgent,
      );
      const systemPrompt = selectedAgentConfig
        ? `You are ${selectedAgentConfig.name}. ${selectedAgentConfig.description}. ${agentConfig.systemPrompt}`
        : agentConfig.systemPrompt;

      // Prepare messages for the chat completion
      const chatMessages = [
        {
          role: "system",
          content:
            systemPrompt +
            (searchResults
              ? `\n\nSearch results: ${JSON.stringify(searchResults)}`
              : "") +
            (attachedFiles.length > 0
              ? `\n\nAttached files: ${attachedFiles.map((f) => f.name).join(", ")}`
              : ""),
        },
        ...messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
        { role: "user", content: inputValue },
      ];

      // Create streaming assistant message
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        provider: selectedProvider,
        model: selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-chat-completions",
        {
          body: {
            provider: selectedProvider,
            model: selectedModel,
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: 1000,
            stream: true,
          },
        },
      );

      if (error) {
        throw error;
      }

      // Handle streaming response
      if (data.choices && data.choices[0]?.message?.content) {
        const content = data.choices[0].message.content;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content } : msg,
          ),
        );
      }

      // Clear attached files after sending
      setAttachedFiles([]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-full flex flex-col bg-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=agent" />
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{agentConfig.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {agentConfig.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {agentConfig.tools && agentConfig.tools.length > 0 && (
              <div className="flex gap-1">
                {agentConfig.tools.map((tool) => {
                  const toolInfo = availableTools.find((t) => t.id === tool);
                  return toolInfo ? (
                    <Badge
                      key={tool}
                      variant="secondary"
                      className="text-xs flex items-center gap-1"
                    >
                      {toolInfo.icon}
                      {toolInfo.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {onSettingsClick && (
              <Button variant="ghost" size="icon" onClick={onSettingsClick}>
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Агент:</span>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Провайдер:</span>
            <Select
              value={selectedProvider}
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger className="w-32 h-8">
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

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Модель:</span>
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={loadingModels}
            >
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {loadingModels ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Загрузка...
                    </div>
                  </SelectItem>
                ) : (
                  (
                    availableModels[selectedProvider] ||
                    providers[selectedProvider as keyof typeof providers]
                      ?.models ||
                    []
                  ).map((model: any) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Инструменты:</span>
            <div className="flex gap-1">
              {availableTools.map((tool) => (
                <div key={tool.id} className="flex items-center space-x-1">
                  <Checkbox
                    id={tool.id}
                    checked={selectedTools.includes(tool.id)}
                    onCheckedChange={() => toggleTool(tool.id)}
                  />
                  <label htmlFor={tool.id} className="text-xs cursor-pointer">
                    {tool.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          div: ({ children }) => (
                            <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                              {children}
                            </div>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          h1: ({ children }) => (
                            <h1 className="text-lg font-bold mb-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-base font-semibold mb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-medium mb-1">
                              {children}
                            </h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-2">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                          code: ({ children, inline }) =>
                            inline ? (
                              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-muted p-2 rounded text-xs overflow-x-auto">
                                {children}
                              </code>
                            ),
                          pre: ({ children }) => (
                            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto mb-2">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-muted-foreground pl-4 italic mb-2">
                              {children}
                            </blockquote>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              className="text-primary underline hover:no-underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {message.content || "Думаю..."}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1 text-xs opacity-70">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.provider && message.model && (
                      <span className="ml-2">
                        {
                          providers[message.provider as keyof typeof providers]
                            ?.name
                        }{" "}
                        • {message.model}
                      </span>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          {attachedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs"
                >
                  <span>{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleFileAttach}
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите ваше сообщение..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;

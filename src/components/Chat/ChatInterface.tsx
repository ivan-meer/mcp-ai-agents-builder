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
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
        agentConfig.tools?.includes("search") &&
        (inputValue.toLowerCase().includes("search") ||
          inputValue.toLowerCase().includes("find"));

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

      // Prepare messages for the chat completion
      const chatMessages = [
        {
          role: "system",
          content:
            agentConfig.systemPrompt +
            (searchResults
              ? `\n\nSearch results: ${JSON.stringify(searchResults)}`
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

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-chat-completions",
        {
          body: {
            provider: selectedProvider,
            model: selectedModel,
            messages: chatMessages,
            temperature: 0.7,
            max_tokens: 1000,
          },
        },
      );

      if (error) {
        throw error;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.choices[0]?.message?.content ||
          "I apologize, but I couldn't generate a response.",
        timestamp: new Date(),
        provider: selectedProvider,
        model: selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Provider:</span>
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
            <span className="text-muted-foreground">Model:</span>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers[
                  selectedProvider as keyof typeof providers
                ]?.models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
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
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
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

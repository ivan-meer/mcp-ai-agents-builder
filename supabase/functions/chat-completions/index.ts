import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { provider, model, messages, ...options } = await req.json();

    let url = "";
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
    };
    let body: any = {};

    switch (provider) {
      case "perplexity":
        url = "https://api.picaos.com/v1/passthrough/chat/completions";
        headers["x-pica-connection-key"] = Deno.env.get(
          "PICA_PERPLEXITY_CONNECTION_KEY",
        )!;
        headers["x-pica-action-id"] =
          "conn_mod_def::GCY0iK-iGks::TKAh9sv2Ts2HJdLJc5a60A";
        body = {
          model: model || "sonar",
          messages,
          ...options,
        };
        break;
      case "openai":
        url = "https://api.picaos.com/v1/passthrough/chat/completions";
        headers["x-pica-connection-key"] = Deno.env.get(
          "PICA_OPENAI_CONNECTION_KEY",
        )!;
        headers["x-pica-action-id"] =
          "conn_mod_def::GDzgi1QfvM4::4OjsWvZhRxmAVuLAuWgfVA";
        body = {
          model: model || "gpt-4o",
          messages,
          ...options,
        };
        break;
      case "anthropic":
        url = "https://api.picaos.com/v1/passthrough/messages";
        headers["x-pica-connection-key"] = Deno.env.get(
          "PICA_ANTHROPIC_CONNECTION_KEY",
        )!;
        headers["x-pica-action-id"] =
          "conn_mod_def::GDyeI7iyqgY::Hh1TshKFQXeRbeJUfVVNuw";
        headers["anthropic-version"] = "2023-06-01";

        // Convert OpenAI format to Anthropic format
        const systemMessage = messages.find((m: any) => m.role === "system");
        const conversationMessages = messages.filter(
          (m: any) => m.role !== "system",
        );

        body = {
          model: model || "claude-3-5-sonnet-20241022",
          max_tokens:
            options.max_tokens || options.max_completion_tokens || 1000,
          messages: conversationMessages,
          ...(systemMessage && { system: systemMessage.content }),
          ...options,
        };
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Normalize response format for Anthropic
    if (provider === "anthropic") {
      return new Response(
        JSON.stringify({
          id: data.id,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: data.model,
          choices: [
            {
              index: 0,
              message: {
                role: "assistant",
                content: data.content?.[0]?.text || data.content || "",
              },
              finish_reason: data.stop_reason || "stop",
            },
          ],
          usage: data.usage,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat completion error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

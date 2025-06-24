import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit");
    const before_id = url.searchParams.get("before_id");
    const after_id = url.searchParams.get("after_id");

    const params = new URLSearchParams();
    if (limit) params.append("limit", limit);
    if (before_id) params.append("before_id", before_id);
    if (after_id) params.append("after_id", after_id);

    const response = await fetch(
      `https://api.picaos.com/v1/passthrough/models?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
          "x-pica-connection-key": Deno.env.get(
            "PICA_ANTHROPIC_CONNECTION_KEY",
          )!,
          "x-pica-action-id":
            "conn_mod_def::GDyeI7iyqgY::Hh1TshKFQXeRbeJUfVVNuw",
          "anthropic-version": "2023-06-01",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Anthropic models error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

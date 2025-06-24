import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query, ...options } = await req.json();

    const url = "https://api.picaos.com/v1/passthrough/search";
    const headers = {
      "Content-Type": "application/json",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_TAVILY_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GCMZGXIH9aE::u-LjTRVgSdC0O_VGbS317w",
    };

    const body = {
      query,
      search_depth: "basic",
      max_results: 5,
      ...options,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

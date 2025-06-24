import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!id || !token) {
      throw new Error("Missing crawl ID or authorization token");
    }

    const apiUrl = `https://api.picaos.com/v1/passthrough/crawl/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_FIRECRAWL_CONNECTION_KEY")!,
      "x-pica-action-id": "conn_mod_def::GClH9Ur5poM::iGbIOuOOTyKBHnSEyhykPA",
    };

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Crawl status request failed: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Crawl status error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

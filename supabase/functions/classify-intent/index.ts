import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INTENT_CLASSES = [
  "Physiological Need",
  "Emotional Expression",
  "Question / Inquiry",
  "General Statement",
  "Urgent / Alert",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    if (!input || typeof input !== "string") {
      return new Response(JSON.stringify({ error: "Missing input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are an intent classification and sentiment analysis system for a privacy-preserving AI pipeline. Analyze the user's message and respond using the provided tool.

Intent classes: ${INTENT_CLASSES.join(", ")}

Sentiment must be one of: Positive, Negative, Neutral.

For the response field, provide a genuinely helpful, empathetic, and specific reply to the user's message. Be warm but concise (2-4 sentences). If they express distress, offer practical advice. If they ask a question, provide a thoughtful answer. If they share something positive, celebrate with them.`,
            },
            { role: "user", content: input },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "classify_intent",
                description:
                  "Classify the user message intent, sentiment, and generate a helpful response",
                parameters: {
                  type: "object",
                  properties: {
                    intent: {
                      type: "string",
                      enum: INTENT_CLASSES,
                      description: "The classified intent of the message",
                    },
                    confidence: {
                      type: "number",
                      description:
                        "Confidence score between 0.0 and 1.0",
                    },
                    sentiment: {
                      type: "string",
                      enum: ["Positive", "Negative", "Neutral"],
                      description: "Overall sentiment of the message",
                    },
                    response: {
                      type: "string",
                      description:
                        "A helpful, empathetic response to the user's message",
                    },
                  },
                  required: ["intent", "confidence", "sentiment", "response"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "classify_intent" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-intent error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

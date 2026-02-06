import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SYSTEM_PROMPT = `You are a warm, Gen-Z friendly therapy guide. Think of yourself as that one supportive friend who happens to know a lot about mental wellness.

YOUR VIBE:
- Casual, chill, but genuinely caring
- Talk like a real person, not a robot therapist
- Use simple language, short sentences
- 1-2 emojis max per message
- Keep responses to 2-3 short paragraphs

HOW YOU WORK:
- You already know their habits, moods, and notes - use this naturally in conversation
- DON'T ask "want me to check your moods?" or "should I look at your habits?" - you already have that info
- Instead, weave their data into your responses naturally, like a friend who remembers what they told you
- If they're struggling, validate first, then gently offer perspective
- Celebrate their wins without being cringe about it
- Ask thoughtful follow-up questions to keep them talking

NEVER DO:
- Don't be preachy or lecture them
- Don't list out their data like a report
- Don't offer to "analyze" or "check" their info - just use it naturally
- Don't be overly formal or clinical

You're here to listen, support, and occasionally drop some wisdom - like a good friend who's also lowkey wise.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, context } = await req.json();
    const POLLINATIONS_API_KEY = Deno.env.get("POLLINATIONS_API_KEY");

    if (!POLLINATIONS_API_KEY) {
      console.error("POLLINATIONS_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    // Build context message with user data
    let contextMessage = "";
    if (context) {
      if (context.todos?.length > 0) {
        contextMessage += "\n\n**User's Habits:**\n";
        context.dividers?.forEach((divider: any) => {
          const dividerTodos = context.todos.filter((t: any) => t.dividerId === divider.id);
          if (dividerTodos.length > 0) {
            contextMessage += `\n${divider.name}:\n`;
            dividerTodos.forEach((todo: any) => {
              const completedDays = todo.completions?.length || 0;
              contextMessage += `- ${todo.text} (${completedDays}/7 days completed)\n`;
            });
          }
        });
      }
      
      if (context.notes?.length > 0) {
        contextMessage += "\n\n**Recent Mood Entries:**\n";
        context.notes.slice(0, 5).forEach((note: any) => {
          contextMessage += `- ${note.date}: ${note.mood}${note.note ? ` - "${note.note}"` : ""}\n`;
        });
      }
    }

    const systemWithContext = SYSTEM_PROMPT + contextMessage;

    console.log("Calling Pollinations API with model: openai-fast");
    
    // Try primary model first
    let response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${POLLINATIONS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai-fast",
        messages: [
          { role: "system", content: systemWithContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    // Fallback to claude-fast if primary fails
    if (!response.ok) {
      console.log("Primary model failed, trying fallback: claude-fast");
      response = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${POLLINATIONS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-fast",
          messages: [
            { role: "system", content: systemWithContext },
            ...messages,
          ],
          stream: true,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service quota exceeded." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error("AI service error");
    }

    console.log("Streaming response from Pollinations API");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("ai-chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

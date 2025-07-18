import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "@/lib/gemini-service";
import { saveChatMessage } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: "Missing userId or message in request body." },
        { status: 400 }
      );
    }

    console.log("[API] Saving user message...");
    await saveChatMessage(userId, {
      text: message,
      sender: "user",
      timestamp: new Date(),
      userId,
    });

    console.log("[API] Generating Gemini response...");
    const replyText = await getGeminiResponse(message);

    console.log("[API] Saving bot message...");
    await saveChatMessage(userId, {
      text: replyText,
      sender: "bot",
      timestamp: new Date(),
      userId,
    });

    return NextResponse.json({ reply: replyText }, { status: 200 });
  } catch (error) {
    console.error("[API] Error handling chat flow:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error generating response.",
      },
      { status: 500 }
    );
  }
}

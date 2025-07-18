export async function getGeminiResponse(prompt: string): Promise<string> {
  const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your key
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    console.error("[Gemini API] Error response:", await response.text());
    throw new Error(`Gemini API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const candidates = data.candidates;
  if (!candidates || candidates.length === 0 || !candidates[0].content) {
    throw new Error("No candidates returned from Gemini.");
  }

  return candidates[0].content.parts[0].text || "I'm sorry, I couldn't generate a response.";
}

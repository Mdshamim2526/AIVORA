export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "শুধু POST অনুরোধ গ্রহণ করা হয়।" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "MAIRA AI চালু করতে সার্ভারে OPENAI_API_KEY সেট করতে হবে। API key কখনো ব্রাউজারের কোডে দিও না।"
    });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const safeMessages = messages
    .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
    .slice(-12)
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (!safeMessages.length || safeMessages[safeMessages.length - 1].role !== "user") {
    return res.status(400).json({ error: "একটি user message পাঠাতে হবে।" });
  }

  const language = typeof req.body?.language === "string" ? req.body.language.slice(0, 20) : "bn-BD";
  const languageNames = {
    "bn-BD": "বাংলা", "en-US": "English", "hi-IN": "Hindi", "ar-SA": "Arabic",
    "ur-PK": "Urdu", "es-ES": "Spanish", "fr-FR": "French", "de-DE": "German",
    "zh-CN": "Chinese", "ja-JP": "Japanese", "ko-KR": "Korean", "pt-BR": "Portuguese",
    "ru-RU": "Russian", "it-IT": "Italian", "tr-TR": "Turkish"
  };
  const selectedLanguage = languageNames[language] || "বাংলা";

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.5",
        instructions: "তোমার নাম MAIRA। তুমি বন্ধুসুলভ, নিরাপদ ও সহায়ক বহুভাষিক AI সহকারী। ব্যবহারকারী যে ভাষায় লিখবে, তার ভাষা বুঝে উত্তর দেবে। তবে ব্যবহারকারীর নির্বাচিত উত্তর-ভাষা হলো " + selectedLanguage + "। সেই ভাষায় উত্তর দাও; নির্বাচিত ভাষা বাংলা হলে সবসময় প্রাঞ্জল বাংলায় উত্তর দেবে। কোনো কাজ বাস্তবে করতে না পারলে তা স্পষ্ট করে বলবে; কাজ করে ফেলেছ বলে মিথ্যা বলবে না।",
        input: safeMessages,
        max_output_tokens: 700,
        store: false
      })
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("OpenAI API error:", data?.error?.message || upstream.status);
      return res.status(502).json({ error: "AI সার্ভার থেকে উত্তর পাওয়া যায়নি। সার্ভার লগ পরীক্ষা করো।" });
    }

    const answer = (data.output || [])
      .filter(item => item.type === "message")
      .flatMap(item => item.content || [])
      .filter(part => part.type === "output_text")
      .map(part => part.text)
      .join("\n")
      .trim();

    if (!answer) return res.status(502).json({ error: "AI কোনো পাঠযোগ্য উত্তর দেয়নি।" });
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("MAIRA API route error:", error);
    return res.status(500).json({ error: "সার্ভারের সঙ্গে সংযোগে সমস্যা হয়েছে।" });
  }
}

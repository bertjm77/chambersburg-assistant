const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function (context, req) {
  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: "Method Not Allowed",
    };
    return;
  }

  try {
    const userMessage = req.body?.message || "";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful community assistant for Chambersburg, PA." },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { reply },
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    context.res = {
      status: 500,
      body: { error: "Something went wrong." },
    };
  }
};

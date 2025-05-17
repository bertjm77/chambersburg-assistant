const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function (context, req) {
  try {
    const userMessage = req.body?.message || "";

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful community assistant for Chambersburg, PA." },
        { role: "user", content: userMessage },
      ],
    });

    context.res = {
      status: 200,
      body: { reply: completion.choices[0].message.content },
    };
  } catch (error) {
    context.log("Error:", error);
    context.res = {
      status: 500,
      body: { reply: "Internal server error." },
    };
  }
};

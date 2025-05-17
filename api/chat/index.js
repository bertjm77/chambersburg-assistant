const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function (context, req) {
  try {
    const messages = req.body?.messages;

    if (!messages || !Array.isArray(messages)) {
      context.res = {
        status: 400,
        body: { reply: "Invalid request. 'messages' array is required." },
      };
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Or "gpt-3.5-turbo"
      messages: [
        { role: "system", content: "You are a helpful community assistant for Chambersburg, PA." },
        ...messages,
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

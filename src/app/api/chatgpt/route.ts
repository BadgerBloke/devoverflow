const POST = async (req: Request) => {
  const { question } = await req.json();

  try {
    const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable assistant that provides quality information.",
          },
          {
            role: "user",
            content: `Tell me ${question}`,
          },
        ],
      }),
    });

    const resData = await res.json();
    const reply = resData.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: (error as Error).message });
  }
};

export { POST };

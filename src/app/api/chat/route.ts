import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await request.json();

		const result = streamText({
			model: openai("gpt-4.1-mini"),
			messages: convertToModelMessages(messages),
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Error streaming chat completion: ", error);
		return new Response("Failed to stream chat completion", {
			status: 500,
		});
	}
}

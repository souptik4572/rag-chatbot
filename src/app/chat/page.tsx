"use client";

import { useState, Fragment } from "react";
import { useChat } from "@ai-sdk/react";

import {
	PromptInput,
	PromptInputBody,
	type PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";

export default function RAGChatBot() {
	const [input, setInput] = useState("");
	const { messages, sendMessage, status } = useChat();
	const handleSubmit = (message: PromptInputMessage) => {
		if (!message.text) {
			return;
		}
		sendMessage({
			text: message.text,
		});
		setInput("");
	};

	return (
		<div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh)]">
			<div className="flex flex-col h-full">
				<Conversation className="h-full">
					<ConversationContent>
						{messages.map((message) => (
							<div key={message.id}>
								{message.parts.map((part, index) => {
									switch (part.type) {
										case "text":
											return (
												<Fragment
													key={`${message.id}-${index}`}
												>
													<Message
														from={message.role}
													>
														<MessageContent>
															<Response>
																{part.text}
															</Response>
														</MessageContent>
													</Message>
												</Fragment>
											);
										default:
											return null;
									}
								})}
							</div>
						))}
						{(status === "submitted" || status === "streaming") && (
							<Loader />
						)}
					</ConversationContent>
					<ConversationScrollButton />
				</Conversation>

				<PromptInput className="mt-4" onSubmit={handleSubmit}>
					<PromptInputBody>
						<PromptInputTextarea
							value={input}
							onChange={(event) => setInput(event.target.value)}
						/>
					</PromptInputBody>
          <PromptInputSubmit disabled={!input && !status} status={status} />
				</PromptInput>
			</div>
		</div>
	);
}

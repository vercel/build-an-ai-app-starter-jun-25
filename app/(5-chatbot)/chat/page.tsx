'use client'

import { useChat } from '@ai-sdk/react'

export default function Chat() {
	// useChat hook manages messages, input state, submission
	const { messages, input, handleInputChange, handleSubmit } = useChat()

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{/* Render messages */}
			{messages.map(
				(
					message
				) => (
					<div key={message.id} className="whitespace-pre-wrap">
						{message.role === 'user' ? 'User: ' : 'AI: '}
						{message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
					</div>
				),
			)}

			{/* Input form */}
			<form onSubmit={handleSubmit}>
				<input
					className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
					value={input}
					placeholder="Say something..."
					onChange={handleInputChange}
				/>
				{/* Submission triggers handleSubmit */}
			</form>
		</div>
	)
}
const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    isUser
                        ? 'bg-emerald-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
            >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            </div>
        </div>
    );
};

export default ChatMessage;

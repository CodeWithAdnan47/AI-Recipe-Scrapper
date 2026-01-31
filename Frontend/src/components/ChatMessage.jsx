const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}>
            <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${isUser
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-white border border-secondary-100 text-secondary-800 rounded-tl-sm'
                    }`}
            >
                <div className="flex items-center gap-2 mb-1 opacity-80">
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                        {isUser ? 'You' : 'Chef AI'}
                    </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
            </div>
        </div>
    );
};

export default ChatMessage;

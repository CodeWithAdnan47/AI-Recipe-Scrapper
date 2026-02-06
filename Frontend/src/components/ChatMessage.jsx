import ReactMarkdown from 'react-markdown';

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
                <div className="text-sm leading-relaxed break-words">
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1 pl-1" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;

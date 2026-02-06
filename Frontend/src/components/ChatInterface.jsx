import { useEffect, useRef, useState } from 'react';
import API_BASE_URL from '../config';
import { useAuth } from '../context/AuthContext';
import ChatMessage from './ChatMessage';
import Button from './ui/Button';
import Card from './ui/Card';

const ChatInterface = ({ recipeId }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed || loading || !currentUser) return;

        const userMessage = { role: 'user', content: trimmed };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ message: trimmed }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || 'Failed to get response');
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, I encountered an issue. Please try asking again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px] shadow-xl shadow-primary-900/5">
            <div className="border-b border-secondary-100 bg-secondary-50 p-4 -mx-6 -mt-6 mb-0 rounded-t-xl flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-display font-bold text-secondary-900 flex items-center gap-2">
                        <span className="text-2xl">🤖</span> Ask AI Chef
                    </h2>
                    <p className="text-sm text-secondary-500 mt-0.5">
                        Get help with substitutions, cooking tips, and nutrition.
                    </p>
                </div>
                {/* Optional: Clear chat button could go here */}
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-8 space-y-4 -mx-6 px-6 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
                        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-secondary-500 text-sm font-medium">No messages yet.</p>
                            <p className="text-secondary-400 text-xs mt-1">Start by asking about ingredients or steps!</p>
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-secondary-50 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-secondary-500 text-sm shadow-sm">
                            <span className="flex space-x-1">
                                <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </span>
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-secondary-100 p-4 -mx-6 -mb-6 bg-white rounded-b-xl">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your question..."
                        className="flex-1 bg-secondary-50 text-secondary-900 placeholder-secondary-400 border border-transparent focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none"
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        disabled={loading || !inputValue.trim()}
                        variant="primary"
                        className="rounded-xl px-5"
                        icon={({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                    >
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-secondary-400">
                        AI can make mistakes. Verify important info.
                    </p>
                </div>
            </form>
        </Card>
    );
};

export default ChatInterface;

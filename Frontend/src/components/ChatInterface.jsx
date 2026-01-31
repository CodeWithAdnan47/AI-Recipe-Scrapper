import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatMessage from './ChatMessage';

const ChatInterface = ({ recipeId }) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

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
            const response = await fetch(`/api/recipes/${recipeId}/chat`, {
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
                { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Ask about this recipe</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    Ask anything (e.g. substitutions, cooking time).
                </p>
            </div>
            <div className="flex flex-col" style={{ minHeight: '280px' }}>
                <div className="flex-1 overflow-y-auto p-4 space-y-1 max-h-80">
                    {messages.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">
                            Ask anything about this recipe (e.g. substitutions, cooking time).
                        </p>
                    )}
                    {messages.map((msg, i) => (
                        <ChatMessage key={i} message={msg} />
                    ))}
                    {loading && (
                        <div className="flex justify-start mb-3">
                            <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                Thinking…
                            </div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type your question…"
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !inputValue.trim()}
                            className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;

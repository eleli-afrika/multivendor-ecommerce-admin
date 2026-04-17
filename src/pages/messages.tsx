import React, { useEffect, useState } from 'react';
import { adminChatAPI } from '../api/api';

interface Conversation {
    id: string;
    participant_one_id: string;
    participant_two_id: string;
    created_at: string;
}

interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    message_text: string;
    is_read: boolean;
    created_at: string;
}

const Messages: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConv, setSelectedConv] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false);

    useEffect(() => {
        adminChatAPI.getAll().then(res => {
            setConversations(res.data.data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleSelectConversation = async (convId: string) => {
        setSelectedConv(convId);
        setMsgLoading(true);
        try {
            const res = await adminChatAPI.getMessages(convId);
            setMessages(res.data.data || []);
        } catch { /* silent */ }
        setMsgLoading(false);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Chat Viewer</h1>
            <div className="flex gap-4 h-[600px]">
                {/* Conversations List */}
                <div className="w-72 flex-shrink-0 bg-white rounded-xl shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b font-semibold text-sm">All Conversations ({conversations.length})</div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : conversations.length === 0 ? (
                            <p className="text-center text-gray-500 text-sm py-8">No conversations</p>
                        ) : (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv.id)}
                                    className={`w-full text-left p-4 border-b hover:bg-gray-50 ${selectedConv === conv.id ? 'bg-blue-50' : ''}`}
                                >
                                    <p className="text-xs font-medium text-gray-700 truncate">Conv: {conv.id.slice(0, 12)}...</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(conv.created_at).toLocaleDateString()}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 bg-white rounded-xl shadow flex flex-col">
                    {!selectedConv ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                            Select a conversation to view messages
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b font-semibold text-sm">
                                Conversation: {selectedConv.slice(0, 16)}...
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {msgLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <p className="text-center text-gray-500 text-sm py-8">No messages</p>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="flex gap-2">
                                            <div className="text-xs text-gray-400 w-32 flex-shrink-0 pt-1">
                                                {msg.sender_id.slice(0, 8)}...
                                            </div>
                                            <div className="flex-1 bg-gray-50 rounded-lg p-3 text-sm">
                                                <p>{msg.message_text}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(msg.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;

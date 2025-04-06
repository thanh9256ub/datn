import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios';

const ChatBot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBJy-DswHgXLYZvyXhh3p49aZzdXTeCl-s" });

    const handleSendMessage = async () => {
        if (chatMessage.trim()) {
            setChatHistory([...chatHistory, { sender: 'user', message: chatMessage }]);
            setChatMessage('');
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: chatMessage,
                });
                setChatHistory(prev => [...prev, { sender: 'ai', message: response.text }]);
            } catch (error) {
                console.error("Error generating AI response:", error);
                setChatHistory(prev => [...prev, { sender: 'ai', message: "Xin lỗi, không thể trả lời ngay bây giờ." }]);
            }
        }
    };


    return (
        <div>
            {!isChatOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#1890ff',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => setIsChatOpen(true)}
                >
                    <MessageOutlined style={{ color: 'white', fontSize: '24px' }} />
                </div>
            )}
            {isChatOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        width: '300px',
                        height: '400px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            padding: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <span>Chat tư vấn khách hàng</span>
                        <CloseOutlined
                            style={{ cursor: 'pointer' }}
                            onClick={() => setIsChatOpen(false)}
                        />
                    </div>
                    <div
                        style={{
                            flex: 1,
                            padding: '10px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        {chatHistory.map((chat, index) => (
                            <div
                                key={index}
                                style={{
                                    alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: chat.sender === 'user' ? '#e6f7ff' : '#f5f5f5',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    maxWidth: '80%',
                                }}
                            >
                                {chat.message}
                            </div>
                        ))}
                    </div>
                    <div
                        style={{
                            padding: '10px',
                            borderTop: '1px solid #f0f0f0',
                            display: 'flex',
                            gap: '10px',
                        }}
                    >
                        <Input
                            value={chatMessage}
                            onChange={e => setChatMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            onPressEnter={handleSendMessage}
                            style={{ flex: 1 }}
                        />
                        <Button type="primary" onClick={handleSendMessage}>
                            Gửi
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ChatBot;

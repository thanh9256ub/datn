import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { GoogleGenAI, Type } from '@google/genai';

// Configure the Google GenAI client
const GOOGLE_API_KEY  = 'AIzaSyBJy-DswHgXLYZvyXhh3p49aZzdXTeCl-s';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const ChatBot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleSendMessage = async () => {
        if (chatMessage.trim()) {
            setChatHistory([...chatHistory, { sender: 'user', message: chatMessage }]);
            setChatMessage('');
            try {
                // Define the function declaration for scheduling meetings
                const scheduleMeetingFunctionDeclaration = {
                    name: 'schedule_meeting',
                    description: 'Schedules a meeting with specified attendees at a given time and date.',
                    parameters: {
                        type: Type.OBJECT,
                        properties: {
                            attendees: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: 'List of people attending the meeting.',
                            },
                            date: {
                                type: Type.STRING,
                                description: 'Date of the meeting (e.g., "2024-07-29")',
                            },
                            time: {
                                type: Type.STRING,
                                description: 'Time of the meeting (e.g., "15:00")',
                            },
                            topic: {
                                type: Type.STRING,
                                description: 'The subject or topic of the meeting.',
                            },
                        },
                        required: ['attendees', 'date', 'time', 'topic'],
                    },
                };

                // Send request to Google GenAI
                const aiResponse = await ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    contents: chatMessage,
                    config: {
                        tools: [{
                            functionDeclarations: [scheduleMeetingFunctionDeclaration]
                        }],
                    },
                });

                // Check for function calls in the response
                if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
                    const functionCall = aiResponse.functionCalls[0];
                    setChatHistory(prev => [...prev, { sender: 'ai', message: `Scheduled meeting: ${JSON.stringify(functionCall.args)}` }]);
                } else {
                    setChatHistory(prev => [...prev, { sender: 'ai', message: aiResponse.text }]);
                }
            } catch (error) {
                console.error("Error processing message:", error);
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
                                <strong>{chat.sender === 'ai' ? 'AI' : 'Người dùng'}:</strong> {chat.message}
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

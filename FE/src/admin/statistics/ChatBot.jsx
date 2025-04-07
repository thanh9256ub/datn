import React, { useEffect, useState } from 'react';
import { Input, Button, Spin } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const ChatBot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const [shoeKeywords, setShoeKeywords] = useState([]);
    const [brandKeywords, setBrandKeywords] = useState([]);
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBJy-DswHgXLYZvyXhh3p49aZzdXTeCl-s" });

    const storeInfo = {
        name: "H2TL",
        address: "Trịnh Văn Bô, Nam Từ Liêm  , Hà Nội",
        phone: "0123 456 789",
        hours: "8:00 - 22:00 hàng ngày",
        email: "H2TL@fpt.edu.vn"
    };

    const storeKeywords = ['địa chỉ', 'giờ mở cửa', 'số điện thoại', 'liên hệ', 'email'];

    useEffect(() => {
        const fetchShoeKeywords = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products/list`);
                const productNames = response.data.data.map(item => item.productName);
                setShoeKeywords(productNames);
               
            } catch (error) {
                console.error("Error fetching shoe keywords:", error);
            }
        };

        fetchShoeKeywords();
    }, []);

    useEffect(() => {
        const fetchBrandKeywords = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products/list`);
                const brandNames = response.data.data.map(item => item.brand.brandName);
                setBrandKeywords(brandNames);
           
            } catch (error) {
                console.error("Error fetching brand keywords:", error);
            }
        };

        fetchBrandKeywords();
    }, []);

    useEffect(async () => {
        if (isChatOpen && chatHistory.length === 0) {
            setChatHistory([{
                sender: 'ai',
                message: `Xin chào! Tôi là trợ lý ảo của shop giày ${storeInfo.name}. Tôi có thể giúp gì cho bạn? 
                \n- Tìm sản phẩm giày
                \n- Thông tin cửa hàng
                \n- Hỗ trợ khác`
            }]);
        }
        
    }, [isChatOpen]);

    // Hàm trích xuất từ khóa tìm kiếm từ câu hỏi
    const extractSearchQuery = (message) => {
        const lowerMessage = message.toLowerCase();

        // Kiểm tra câu hỏi về cửa hàng
        if (storeKeywords.some(keyword => lowerMessage.includes(keyword))) {
            return 'store_info';
        }

        // Tìm thương hiệu trong câu hỏi
        const foundBrand = brandKeywords.find(brand => lowerMessage.includes(brand));

        // Nếu có từ khóa giày và thương hiệu
        if (shoeKeywords.some(shoe => lowerMessage.includes(shoe))) {
            return foundBrand || shoeKeywords.find(shoe => lowerMessage.includes(shoe));
        }

        return foundBrand || null;
    };

    // Hàm trả lời thông tin cửa hàng
    const getStoreInfoResponse = (question) => {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('địa chỉ') || lowerQuestion.includes('ở đâu')) {
            return `🏠 ${storeInfo.name} nằm tại: ${storeInfo.address}`;
        }
        else if (lowerQuestion.includes('giờ') || lowerQuestion.includes('mở cửa')) {
            return `⏰ Cửa hàng mở cửa: ${storeInfo.hours}`;
        }
        else if (lowerQuestion.includes('điện thoại') || lowerQuestion.includes('liên hệ')) {
            return `📞 Số điện thoại: ${storeInfo.phone}`;
        }
        else if (lowerQuestion.includes('email')) {
            return `📧 Email: ${storeInfo.email}`;
        }
        else {
            return `Thông tin cửa hàng:
            \n🏠 Địa chỉ: ${storeInfo.address}
            \n⏰ Giờ mở cửa: ${storeInfo.hours}
            \n📞 Điện thoại: ${storeInfo.phone}
            \n📧 Email: ${storeInfo.email}`;
        }
    };

    // Hàm tìm kiếm giày
    const searchShoes = async (query) => {
        try {
            const response = await axios.get(`${BASE_URL}/products/search-ai?name=${encodeURIComponent(query)}`);
            console.log(response.data.data );
            return response.data?.data || []; // Giả sử API trả về data.data

        } catch (error) {
            console.error("Error searching shoes:", error);
            return [];
        }
    };

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        // Thêm câu hỏi vào lịch sử
        setChatHistory([...chatHistory, { sender: 'user', message: chatMessage }]);
        setChatMessage('');
        setLoading(true);

        // Trích xuất từ khóa tìm kiếm
        const searchQuery = extractSearchQuery(chatMessage);

        if (searchQuery === 'store_info') {
            const storeResponse = getStoreInfoResponse(chatMessage);
            setChatHistory(prev => [...prev, {
                sender: 'ai',
                message: storeResponse
            }]);
            setLoading(false);
            return;
        }

        if (searchQuery) {
            const shoes = await searchShoes(searchQuery);
console.log(shoes);
            if (shoes.length > 0) {
                // Hiển thị tối đa 3 sản phẩm
                const topProducts = shoes.slice(0, 3);
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    message: (
                        <div>
                            <p>Tìm thấy {shoes.length} sản phẩm phù hợp:</p>
                            {topProducts.map(product => (
                                <div key={product.id} style={{ marginBottom: '10px' }}>
                                    <a
                                        href={`/product/${product.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#1890ff', textDecoration: 'underline' }}
                                    >
                                        <img
                                            src={product.mainImage || 'https://via.placeholder.com/150?text=Ảnh+phụ'}
                                            // alt={product.productName}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                padding: 4
                                            }}
                                        />
                                        {product.productName} - {product.material.materialName}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )
                }]);
            } else {
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    message: `Hiện không có sản phẩm "${searchQuery}" trong cửa hàng. Bạn muốn xem các sản phẩm khác không?`
                }]);
            }
            setLoading(false);
            return;
        }

        // Nếu không phải câu hỏi về sản phẩm, dùng Gemini
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Bạn là trợ lý cửa hàng giày tên H2TL. Hãy trả lời ngắn gọn: ${chatMessage}`,
            });
            setChatHistory(prev => [...prev, { sender: 'ai', message: response.text }]);
        } catch (error) {
            console.error("Error generating AI response:", error);
            setChatHistory(prev => [...prev, {
                sender: 'ai',
                message: "Xin lỗi, không thể trả lời ngay bây giờ."
            }]);
        }

        setLoading(false);
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
                        width: '350px',
                        height: '500px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1000,
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
                        <span>Chat tư vấn giày</span>
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
                                    maxWidth: '90%',
                                }}
                            >
                                {chat.message}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'center' }}>
                                <Spin size="small" />
                            </div>
                        )}
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
                            placeholder="Nhập tên giày bạn muốn tìm..."
                            onPressEnter={handleSendMessage}
                            style={{ flex: 1 }}
                        />
                        <Button
                            type="primary"
                            onClick={handleSendMessage}
                            loading={loading}
                        >
                            Gửi
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
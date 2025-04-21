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
    const [colorKeywords, setColorKeywords] = useState([]);
    const [sizeKeywords, setSizeKeywords] = useState([]);
    const [priceKeywords, setPriceKeywords] = useState([]);
    const [descriptionKeywords, setDescriptionKeywords] = useState([]);
    const [materialKeywords, setMaterialKeywords] = useState([]);
    const [categoryKeywords, setCategoryKeywords] = useState([]);
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBJy-DswHgXLYZvyXhh3p49aZzdXTeCl-s" });

    const storeInfo = {
        name: "H2TL",
        address: "Trịnh Văn Bô, Nam Từ Liêm  , Hà Nội",
        phone: "0123 456 789",
        hours: "8:00 - 22:00 hàng ngày",
        email: "H2TL@fpt.edu.vn"
    };

    const storeKeywords = ['địa chỉ', 'giờ mở cửa', 'số điện thoại', 'liên hệ', 'email', 'thông tin shop', 'thông tin cửa hàng'];

    useEffect(() => {
        const fetchShoeKeywords = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/product-detail`);

                const productNames = Array.from(new Set(response.data.data.map(item => item.product?.productName || '')));
                setShoeKeywords(productNames);

                const brandNames = Array.from(new Set(response.data.data.map(item => item.product?.brand?.brandName || '')));
                setBrandKeywords(brandNames);

                const colorNames = Array.from(new Set(response.data.data.map(item => item.color?.colorName || '')));
                setColorKeywords(colorNames);

                const sizeNames = Array.from(new Set(response.data.data.map(item => item.size?.sizeName || '')));
                setSizeKeywords(sizeNames);

                const priceNames = Array.from(new Set(response.data.data.map(item => item.price?.price || '')));
                setPriceKeywords(priceNames);

                const descriptionNames = Array.from(new Set(response.data.data.map(item => item.product?.description || '')));
                setDescriptionKeywords(descriptionNames);

                const materialNames = Array.from(new Set(response.data.data.map(item => item.product?.material?.materialName || '')));
                setMaterialKeywords(materialNames);

                const categoryNames = Array.from(new Set(response.data.data.map(item => item.product?.category?.categoryName || '')));
                setCategoryKeywords(categoryNames);

                console.log("Category Keywords:", categoryNames);
                console.log("Material Keywords:", materialNames);
                console.log("Name  Keywords:", productNames);
                console.log("brandNames Keywords:", brandNames);
            } catch (error) {
                console.error("Error fetching shoe keywords:", error);
            }
        };

        fetchShoeKeywords();
    }, []);

    useEffect(() => {
        if (isChatOpen) {
            // Đợi một chút để DOM render xong rồi mới cuộn
            setTimeout(() => {
                const chatBox = document.getElementById('chat-box-container');
                if (chatBox) {
                    chatBox.scrollTo({
                        top: chatBox.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [isChatOpen, chatHistory]);

    useEffect(() => {
        const initializeChatHistory = async () => {
            if (isChatOpen && chatHistory.length === 0) {
                setChatHistory([{
                    sender: 'ai',
                    message: (
                        <div>
                            <p>Xin chào! Tôi là trợ lý ảo của shop giày <strong>{storeInfo.name}</strong>. Tôi có thể giúp gì cho bạn?</p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>Tìm sản phẩm giày</li>
                                <li>Thông tin cửa hàng</li>
                                <li>Hỗ trợ khác</li>
                            </ul>
                        </div>
                    )
                }]);
            }
        };

        initializeChatHistory();
    }, [isChatOpen, chatHistory.length]);

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase();
    };

    // Hàm trích xuất từ khóa tìm kiếm từ câu hỏi
    const extractSearchQuery = (message) => {
        const lowerMessage = normalizeText(message);

        // Kiểm tra câu hỏi về cửa hàng
        if (storeKeywords.some(keyword => lowerMessage.includes(normalizeText(keyword)))) {
            return 'store_info';
        }

        // Object chứa tất cả thông tin trích xuất
        const searchConditions = {
            type: 'combined',
            shoe: null,
            brand: null,
            color: null,
            size: null,
            price: null
        };

        const pricePatterns = [
            {
                regex: /(giá|gia)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?\s*(trở lên|lên)/i,
                type: 'above'
            },
            {
                regex: /(giá|gia)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?\s*(trở xuống|xuống)/i,
                type: 'below'
            },
            {
                regex: /(giá dưới|dưới|duoi|gia duoi|trở xuống)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?/i,
                type: 'below'
            },
            {
                regex: /(giá trên|trên|tren|gia tren|trở lên)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?/i,
                type: 'above'
            },
            {
                regex: /(khoảng giá|khoang gia|giá|gia|tầm|tam)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?/i,
                type: 'around'
            },
            {
                regex: /(từ|tu)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?\s*(đến|den)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?/i,
                type: 'range'
            },
            {
                regex: /(khoảng|khoang|tầm|tam)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?\s*-\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?/i,
                type: 'range'
            },
            {
                regex: /(từ|tu)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?\s*(trở lên|lên)/i,
                type: 'above'
            },
            {
                regex: /(từ|tu)\s*(\d+)(?:\s*(tr|triệu|nghìn|k|000))?\s*(trở xuống|xuống)/i,
                type: 'below'
            }
        ];

        for (const pattern of pricePatterns) {
            const match = lowerMessage.match(pattern.regex);
            if (match) {
                let minValue, maxValue;

                if (pattern.type === 'range') {
                    // Xử lý trường hợp "từ X đến Y"
                    if (match[1] === 'từ' || match[1] === 'tu') {
                        minValue = parseFloat(match[2]);
                        const minUnit = match[3] ? match[3].toLowerCase() : null;
                        maxValue = parseFloat(match[5]);
                        const maxUnit = match[6] ? match[6].toLowerCase() : null;

                        // Chuyển đổi đơn vị cho minValue
                        if (minUnit === 'tr' || minUnit === 'triệu') {
                            minValue *= 1000000;
                        } else if (minUnit === 'k' || minUnit === 'nghìn' || minUnit === '000') {
                            minValue *= 1000;
                        } else if (!minUnit && minValue < 1000) {
                            minValue *= 1000;
                        }

                        // Chuyển đổi đơn vị cho maxValue
                        if (maxUnit === 'tr' || maxUnit === 'triệu') {
                            maxValue *= 1000000;
                        } else if (maxUnit === 'k' || maxUnit === 'nghìn' || maxUnit === '000') {
                            maxValue *= 1000;
                        } else if (!maxUnit && maxValue < 1000) {
                            maxValue *= 1000;
                        }
                    }
                    // Xử lý trường hợp "khoảng X-Y"
                    else {
                        minValue = parseFloat(match[2]);
                        const minUnit = match[3] ? match[3].toLowerCase() : null;
                        maxValue = parseFloat(match[4]);
                        const maxUnit = match[5] ? match[5].toLowerCase() : null;

                        // Chuyển đổi đơn vị cho minValue
                        if (minUnit === 'tr' || minUnit === 'triệu') {
                            minValue *= 1000000;
                        } else if (minUnit === 'k' || minUnit === 'nghìn' || minUnit === '000') {
                            minValue *= 1000;
                        } else if (!minUnit && minValue < 1000) {
                            minValue *= 1000;
                        }

                        // Chuyển đổi đơn vị cho maxValue
                        if (maxUnit === 'tr' || maxUnit === 'triệu') {
                            maxValue *= 1000000;
                        } else if (maxUnit === 'k' || maxUnit === 'nghìn' || maxUnit === '000') {
                            maxValue *= 1000;
                        } else if (!maxUnit && maxValue < 1000) {
                            maxValue *= 1000;
                        }
                    }

                    searchConditions.price = {
                        type: 'price',
                        priceType: 'range',
                        minValue: minValue,
                        maxValue: maxValue
                    };
                } else {
                    let value = parseFloat(match[2]);
                    const unit = match[3] ? match[3].toLowerCase() : null;

                    // Chuyển đổi đơn vị
                    if (unit === 'tr' || unit === 'triệu') {
                        value *= 1000000;
                    } else if (unit === 'k' || unit === 'nghìn' || unit === '000') {
                        value *= 1000;
                    } else if (!unit && value < 1000) {
                        value *= 1000;
                    }

                    searchConditions.price = {
                        type: 'price',
                        priceType: pattern.type,
                        value: value
                    };
                }
                break;
            }
        }

        // 2. Trích xuất thương hiệu
        const foundBrand = brandKeywords.find(brand =>
            lowerMessage.includes(normalizeText(brand))
        );
        if (foundBrand) {
            searchConditions.brand = foundBrand;
        }

        // 3. Trích xuất tên giày
        const foundShoe = shoeKeywords.find(shoe =>
            lowerMessage.includes(normalizeText(shoe))
        );
        if (foundShoe) {
            searchConditions.shoe = foundShoe;
        }

        // 4. Trích xuất màu sắc
        const foundColor = colorKeywords.find(color =>
            lowerMessage.includes(normalizeText(color))
        );
        if (foundColor) {
            searchConditions.color = foundColor;
        }

        // 5. Trích xuất kích cỡ
        const sizeRegex = /(?:size|kích cỡ|cỡ)\s*(\d+)/i;
        const sizeMatch = lowerMessage.match(sizeRegex);
        if (sizeMatch) {
            const foundSize = sizeKeywords.find(size => size === sizeMatch[1]);
            if (foundSize) {
                searchConditions.size = foundSize;
            }
        }

        // Kiểm tra nếu có ít nhất một điều kiện thì trả về
        if (searchConditions.brand || searchConditions.shoe || searchConditions.color || searchConditions.size || searchConditions.price) {
            return searchConditions;
        }

        return null;
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
            return (
                <div>
                    <strong>Thông tin cửa hàng:</strong><br />
                    🏠 <strong>Địa chỉ:</strong> {storeInfo.address}<br />
                    ⏰ <strong>Giờ mở cửa:</strong> {storeInfo.hours}<br />
                    📞 <strong>Điện thoại:</strong> {storeInfo.phone}<br />
                    📧 <strong>Email:</strong> {storeInfo.email}
                </div>
            );
        }
    };

    const searchShoes = async (query) => {
        try {
            let params = {};

            if (query && query.type === 'combined') {
                if (query.shoe) {
                    params.productName = query.shoe;
                }
                if (query.brand) {
                    params.brandName = query.brand;
                }
                if (query.color) {
                    params.colorName = query.color;
                }
                if (query.size) {
                    params.sizeName = query.size;
                }
                if (query.price) {
                    if (query.price.priceType === 'below') {
                        params.maxPrice = query.price.value;
                    } else if (query.price.priceType === 'above') {
                        params.minPrice = query.price.value;
                    } else if (query.price.priceType === 'around') {
                        params.minPrice = query.price.value * 0.8;
                        params.maxPrice = query.price.value * 1.2;
                    } else if (query.price.priceType === 'range') {
                        params.minPrice = query.price.minValue;
                        params.maxPrice = query.price.maxValue;
                    }
                }
            } else if (query) {
                params.query = query;
            }

            // Thêm debug để kiểm tra params trước khi gửi request
            console.log("Search params:", params);

            const response = await axios.get(`${BASE_URL}/product-detail/search-ai`, {
                params: params
            });

            console.log("Raw products:", response.data?.data);

            const productDetails = response.data?.data || [];

            // Nhóm các chi tiết theo product.id và giữ nguyên các thông tin chi tiết
            const groupedProducts = productDetails.reduce((acc, item) => {
                if (!item || !item.product || !item.product.id) return acc;

                const existingProduct = acc.find(p => p.product.id === item.product.id);
                const variant = {
                    color: item.color || {}, // Giữ nguyên toàn bộ thông tin màu sắc
                    size: item.size || {},   // Giữ nguyên toàn bộ thông tin size
                    price: item.price,
                    quantity: item.quantity
                };

                if (existingProduct) {
                    existingProduct.variants.push(variant);
                    // Cập nhật thông tin nếu cần
                    existingProduct.product = { ...item.product };
                } else {
                    acc.push({
                        product: { ...item.product }, // Sao chép thông tin sản phẩm
                        variants: [variant]        // Thêm variant đầu tiên
                    });
                }
                return acc;
            }, []);

            console.log("Grouped products with variants:", groupedProducts);
            return groupedProducts;
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
        console.log("Tìm thấy từ khóa tìm kiếm:", searchQuery);

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
            let responseMessage = '';
            let products = [];

            if (searchQuery.type === 'combined') {
                // Tạo thông báo phản hồi chi tiết
                responseMessage = 'Tìm thấy sản phẩm phù hợp với:';
                if (searchQuery.shoe) responseMessage += ` sản phẩm "${searchQuery.shoe}"`;
                if (searchQuery.brand) responseMessage += ` hãng ${searchQuery.brand}`;
                if (searchQuery.color) responseMessage += ` màu ${searchQuery.color}`;
                if (searchQuery.size) responseMessage += ` size ${searchQuery.size}`;
                if (searchQuery.price) {
                    if (searchQuery.price.priceType === 'below') {
                        responseMessage += ` giá dưới ${searchQuery.price.value.toLocaleString()} VND`;
                    } else if (searchQuery.price.priceType === 'above') {
                        responseMessage += ` giá trên ${searchQuery.price.value.toLocaleString()} VND`;
                    } else if (searchQuery.price.priceType === 'around') {
                        responseMessage += ` giá khoảng ${searchQuery.price.value.toLocaleString()} VND`;
                    } else if (searchQuery.price.priceType === 'range') {
                        responseMessage += ` giá từ ${searchQuery.price.minValue.toLocaleString()} đến ${searchQuery.price.maxValue.toLocaleString()} VND`;
                    }
                }

                products = await searchShoes(searchQuery);
            }
            // Xử lý tìm kiếm theo giá đơn lẻ
            else if (typeof searchQuery === 'object' && searchQuery.type === 'price') {
                products = await searchShoes(searchQuery);

                if (searchQuery.priceType === 'below') {
                    responseMessage = `Các sản phẩm có giá dưới ${searchQuery.value.toLocaleString()} VND:`;
                } else if (searchQuery.priceType === 'above') {
                    responseMessage = `Các sản phẩm có giá trên ${searchQuery.value.toLocaleString()} VND:`;
                } else if (searchQuery.priceType === 'around') {
                    responseMessage = `Các sản phẩm trong khoảng giá ${(searchQuery.value * 0.8).toLocaleString()} - ${(searchQuery.value * 1.2).toLocaleString()} VND:`;
                } else if (searchQuery.priceType === 'range') {
                    responseMessage = `Các sản phẩm trong khoảng giá ${searchQuery.minValue.toLocaleString()} - ${searchQuery.maxValue.toLocaleString()} VND:`;
                }
            }
            // Xử lý tìm kiếm đơn giản (theo tên, thương hiệu, màu sắc...)
            else {
                products = await searchShoes(searchQuery);
                responseMessage = `Tìm thấy ${products.length} sản phẩm phù hợp với "${searchQuery}":`;
            }
            if (products.length > 0) {
                const topProducts = products.slice(0, 3); // Giới hạn hiển thị 3 sản phẩm
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    message: (
                        <div style={{ maxWidth: '100%' }}>
                            <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>{responseMessage}</p>
                            {topProducts.map(({ product, variants }) => (
                                <div key={product.id} style={{
                                    marginBottom: '15px',
                                    border: '1px solid #e8e8e8',
                                    borderRadius: '8px',
                                    padding: '10px',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <div style={{ display: 'flex', margin: '8px 0' }}>
                                        <img
                                            src={product.mainImage || 'https://via.placeholder.com/150?text=Ảnh+phụ'}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginRight: '10px'
                                            }}
                                            alt={product.productName}
                                        />
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                                                {product.productName}
                                            </h4>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                                                Thương hiệu: {product.brand?.brandName || 'Không rõ'}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                                Danh mục: {product.category?.categoryName || 'Không rõ'}
                                            </p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                                                Chất liệu: {product.material?.materialName || 'Không rõ'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hiển thị các phiên bản có sẵn */}
                                    <div style={{ marginTop: '10px' }}>
                                        <p style={{ marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                                            Các phiên bản có sẵn:
                                        </p>
                                        {variants.slice(0, 3).map((variant, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                                padding: '3px 0',
                                                borderBottom: '1px dashed #eee'
                                            }}>
                                                <span>Màu: {variant.color?.colorName || 'Không xác định'}</span>
                                                <span>Size: {variant.size?.sizeName || 'Không xác định'}</span>
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {variant.price?.toLocaleString() || 'Liên hệ'}đ
                                                </span>
                                            </div>
                                        ))}

                                        {variants.length > 3 && (
                                            <p style={{
                                                margin: '5px 0 0',
                                                fontSize: '11px',
                                                color: '#666',
                                                fontStyle: 'italic'
                                            }}>
                                                Và {variants.length - 3} phiên bản khác...
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="primary"
                                        size="small"
                                        style={{
                                            marginTop: '10px',
                                            width: '100%',
                                            fontSize: '12px'
                                        }}
                                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </div>
                            ))}

                            {products.length > 3 && (
                                <p style={{
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    color: '#666',
                                    marginTop: '10px'
                                }}>
                                    Và {products.length - 3} sản phẩm khác...
                                </p>
                            )}
                        </div>
                    )
                }]);
            } else {
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    message: `Không tìm thấy sản phẩm phù hợp. Bạn muốn tìm sản phẩm khác không?`
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

        setTimeout(() => {
            const chatBox = document.getElementById('chat-box-container');
            if (chatBox) {
                chatBox.scrollTo({
                    top: chatBox.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 50);
    };

    return (
        <div style={{ zIndex: 2, position: 'absolute', top: 0 }}>
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
                        <span>Chat tư vấn hỗ trợ khách hàng</span>
                        <CloseOutlined
                            style={{ cursor: 'pointer' }}
                            onClick={() => setIsChatOpen(false)}
                        />
                    </div>
                    <div
                        id="chat-box-container"
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
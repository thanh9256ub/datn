import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Spin, Card, Row, Tag, Col } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const ChatBot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentSearchConditions, setCurrentSearchConditions] = useState(null);

    const [shoeKeywords, setShoeKeywords] = useState([]);
    const [brandKeywords, setBrandKeywords] = useState([]);
    const [colorKeywords, setColorKeywords] = useState([]);
    const [sizeKeywords, setSizeKeywords] = useState([]);
    const [priceKeywords, setPriceKeywords] = useState([]);
    const [descriptionKeywords, setDescriptionKeywords] = useState([]);
    const [materialKeywords, setMaterialKeywords] = useState([]);
    const [categoryKeywords, setCategoryKeywords] = useState([]);
    const ai = new GoogleGenAI({ apiKey: "AIzaSyBJy-DswHgXLYZvyXhh3p49aZzdXTeCl-s" });
    const lastSuggestedProducts = useRef([]);

    const storeInfo = {
        name: "H2TL",
        address: "13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội",
        phone: "0917294134",
        hours: "8:00 - 22:00 hàng ngày",
        email: "thanh9256ub@gmail.com"
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
                            <p>👋 Xin chào bạn! Mình là <strong>H2Bot</strong>, trợ lý ảo của cửa hàng giày <strong>{storeInfo.name}</strong>.</p>
                            <p>Mình có thể giúp gì cho bạn hôm nay ạ? 💖</p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>🔍 Tìm sản phẩm giày theo tên, thương hiệu, màu sắc...</li>
                                <li>🏬 Thông tin cửa hàng, giờ mở cửa, địa chỉ</li>
                                <li>💁 Hỗ trợ tư vấn các vấn đề khác</li>
                            </ul>
                            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>Bạn cần tìm gì ạ? Mình sẵn sàng giúp đỡ!</p>
                        </div>
                    )
                }]);
            }
        };

        initializeChatHistory();
    }, [isChatOpen, chatHistory.length]);

    const getStoreInfoResponse = (question) => {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('địa chỉ') || lowerQuestion.includes('ở đâu')) {
            return `🏠 Cửa hàng ${storeInfo.name} của chúng mình nằm tại: ${storeInfo.address}. Bạn có thể ghé qua bất cứ lúc nào nhé! ❤️`;
        }
        else if (lowerQuestion.includes('giờ') || lowerQuestion.includes('mở cửa')) {
            return `⏰ Hiện tại cửa hàng mình mở cửa từ ${storeInfo.hours}. Bạn có thể đến vào khung giờ này để được phục vụ tốt nhất ạ! 😊`;
        }
        else if (lowerQuestion.includes('điện thoại') || lowerQuestion.includes('liên hệ')) {
            return `📞 Bạn có thể liên hệ với cửa hàng qua số: ${storeInfo.phone}. Mình luôn sẵn sàng hỗ trợ bạn! 💕`;
        }
        else if (lowerQuestion.includes('email')) {
            return `📧 Email của cửa hàng là: ${storeInfo.email}. Bạn có thể gửi thắc mắc qua đây nếu cần nhé! ✨`;
        }
        else {
            return (
                <div>
                    <p>💖 <strong>Thông tin cửa hàng {storeInfo.name}:</strong></p>
                    <p>🏠 <strong>Địa chỉ:</strong> {storeInfo.address}</p>
                    <p>⏰ <strong>Giờ mở cửa:</strong> {storeInfo.hours}</p>
                    <p>📞 <strong>Điện thoại:</strong> {storeInfo.phone}</p>
                    <p>📧 <strong>Email:</strong> {storeInfo.email}</p>
                    <p style={{ marginTop: '5px' }}>Mong sớm được đón tiếp bạn tại cửa hàng! ❤️</p>
                </div>
            );
        }
    };

    const normalizeText = (text) => {
        if (!text) return '';
        return text.toLowerCase();
    };

    // Hàm kiểm tra xem câu hỏi có bắt đầu bằng cụm từ chỉ định tìm kiếm mới không
    const isNewSearchQuery = (message) => {
        const lowerMessage = normalizeText(message);
        return lowerMessage.startsWith('tôi muốn') ||
            lowerMessage.startsWith('cho tôi') ||
            lowerMessage.startsWith('tìm kiếm') ||
            lowerMessage.startsWith('cần tìm') ||
            lowerMessage.startsWith('muốn tìm') ||
            lowerMessage.startsWith('tìm giúp') ||
            lowerMessage.startsWith('gợi ý');
    };

    // Hàm trích xuất từ khóa tìm kiếm từ câu hỏi
    const extractSearchQuery = (message) => {
        const lowerMessage = normalizeText(message);

        // Kiểm tra câu hỏi về cửa hàng
        if (storeKeywords.some(keyword => lowerMessage.includes(normalizeText(keyword)))) {
            return 'store_info';
        }

        if (isNewSearchQuery(message)) {
            setCurrentSearchConditions({
                type: 'combined',
                shoe: null,
                brand: null,
                material: null,
                category: null,
                color: null,
                size: null,
                price: null
            });
        }

        // Object chứa tất cả thông tin trích xuất
        let searchConditions = currentSearchConditions ? { ...currentSearchConditions } : {
            type: 'combined',
            shoe: null,
            brand: null,
            material: null,
            category: null,
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

        const foundCategory = categoryKeywords.find(category =>
            lowerMessage.includes(normalizeText(category))
        );
        if (foundCategory) {
            searchConditions.category = foundCategory;
        }

        // const foundMaterial = materialKeywords.find(material =>
        //     lowerMessage.includes(normalizeText(material))
        // );
        const isStandaloneWord = (word, text) => {
            const regex = new RegExp(`(^|\\s)${word}($|\\s)`, 'i');
            return regex.test(text);
        };
        const foundMaterial = materialKeywords.find(material => {
            return isStandaloneWord(normalizeText(material), lowerMessage) &&
                !normalizeText(foundBrand)?.includes(normalizeText(material));
        });
        if (foundMaterial) {
            searchConditions.material = foundMaterial;
        }

        // const foundShoe = shoeKeywords.find(shoe =>
        //     lowerMessage.includes(normalizeText(shoe))
        // );
        const foundShoe = shoeKeywords
            .filter(shoe => shoe.length > 2)
            .find(shoe => {
                const normalizedShoe = normalizeText(shoe);
                return lowerMessage.includes(normalizedShoe) &&
                    !categoryKeywords.some(cat => lowerMessage.includes(normalizeText(cat)));
            });
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

        setCurrentSearchConditions(searchConditions);

        // Kiểm tra nếu có ít nhất một điều kiện thì trả về
        if (searchConditions.brand || searchConditions.shoe || searchConditions.category || searchConditions.material || searchConditions.color ||
            searchConditions.size || searchConditions.price) {
            return searchConditions;
        }

        return null;
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
                if (query.category) {
                    params.categoryName = query.category;
                }
                if (query.material) {
                    params.materialName = query.material;
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

    const getRandomShoes = async (count = 3) => {
        try {
            const response = await axios.get(`${BASE_URL}/product-detail`);
            const allProducts = response.data?.data || [];

            // Lọc và nhóm sản phẩm giống như hàm searchShoes
            const groupedProducts = allProducts.reduce((acc, item) => {
                if (!item?.product?.id) return acc;

                const existingProduct = acc.find(p => p.product.id === item.product.id);
                const variant = {
                    color: item.color || {},
                    size: item.size || {},
                    price: item.price,
                    quantity: item.quantity
                };

                if (existingProduct) {
                    existingProduct.variants.push(variant);
                } else {
                    acc.push({
                        product: { ...item.product },
                        variants: [variant]
                    });
                }
                return acc;
            }, []);

            // Xáo trộn mảng và lấy số lượng mong muốn
            const shuffled = [...groupedProducts].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            console.error("Error getting random shoes:", error);
            return [];
        }
    };

    const sortAndCompareProducts = (products) => {
        if (!products || products.length === 0) return { sortedProducts: [], comparison: null };

        // Tính điểm cho từng sản phẩm dựa trên nhiều tiêu chí
        const productsWithScore = products.map(product => {
            const variants = product.variants || [];
            const prices = variants.map(v => v.price || 0).filter(p => p > 0);
            const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

            // Tính điểm (có thể thêm các tiêu chí khác tùy nhu cầu)
            let score = 0;

            // 1. Điểm giá trị (giá càng gần trung bình càng tốt)
            const allPrices = products.flatMap(p =>
                p.variants.map(v => v.price || 0).filter(p => p > 0)
            );
            const marketAvgPrice = allPrices.length > 0 ?
                allPrices.reduce((a, b) => a + b, 0) / allPrices.length : 0;

            const priceScore = 1 - Math.min(1, Math.abs(avgPrice - marketAvgPrice) / marketAvgPrice);
            score += priceScore * 0.4;

            // 2. Điểm đa dạng (nhiều màu sắc, size)
            const variantScore = Math.min(1, variants.length / 5);
            score += variantScore * 0.3;

            // 3. Điểm thương hiệu (nếu có thông tin)
            const brandScore = product.product.brand?.rating ? product.product.brand.rating / 5 : 0.5;
            score += brandScore * 0.2;

            // 4. Điểm chất liệu (nếu có thông tin)
            const materialScore = product.product.material?.quality ? product.product.material.quality / 5 : 0.5;
            score += materialScore * 0.1;

            return { ...product, score, avgPrice };
        });

        // Sắp xếp theo điểm số giảm dần
        const sortedProducts = [...productsWithScore].sort((a, b) => b.score - a.score);

        // Xác định sản phẩm tốt nhất
        const bestProduct = sortedProducts.length > 0 ? sortedProducts[0] : null;

        return {
            sortedProducts,
            comparison: {
                totalProducts: products.length,
                bestProduct: bestProduct,
                bestProductReasons: bestProduct ? [
                    "Giá cả hợp lý so với thị trường",
                    "Nhiều lựa chọn màu sắc và kích cỡ",
                    "Thương hiệu uy tín",
                    "Chất liệu tốt"
                ].filter((_, i) => [
                    bestProduct.score >= 0.4 * (i === 0 ? 1 : 0),
                    bestProduct.score >= 0.7 * (i === 1 ? 1 : 0),
                    bestProduct.score >= 0.9 * (i === 2 ? 1 : 0),
                    bestProduct.score >= 1.0 * (i === 3 ? 1 : 0)
                ][i]) : []
            }
        };
    };

    const analyzeProducts = async (products) => {
        if (!products || products.length === 0) return "Hiện không có sản phẩm để phân tích.";

        try {
            // Tính giá trung bình cho từng sản phẩm
            const productsWithAvgPrice = products.map(product => {
                const prices = product.variants.map(v => v.price || 0).filter(p => p > 0);
                const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
                return { ...product, avgPrice };
            });

            // Chuẩn bị dữ liệu cho AI
            const productsData = productsWithAvgPrice.map(p => ({
                name: p.product.productName,
                brand: p.product.brand?.brandName || 'Không rõ',
                price: p.avgPrice,
                material: p.product.material?.materialName || 'Không rõ',
                description: p.product.description || 'Không có mô tả',
                category: p.product.category?.categoryName || 'Không rõ',
                variants: p.variants.map(v => ({
                    color: v.color?.colorName || 'Không xác định',
                    size: v.size?.sizeName || 'Không xác định',
                    price: v.price || 0
                }))
            }));

            const response = await ai.models.generateContent({
                model: "gemini-1.5-pro",
                contents: [{
                    role: "user",
                    parts: [{
                        text: `Bạn là H2Bot - trợ lý ảo của cửa hàng giày H2TL. Hãy phân tích các sản phẩm sau:
                        
                        Thông tin sản phẩm:
                        ${JSON.stringify(productsData, null, 2)}
                        
                        Yêu cầu phân tích:
                        1. Đánh giá ngắn gọn từng sản phẩm (ưu điểm chính)
                        2. Chỉ ra sản phẩm phù hợp nhất cho nam giới
                        3. Gợi ý theo nhu cầu:
                           - Đi làm công sở
                           - Đi chơi cuối tuần
                           - Tập thể thao
                        4. Giới hạn trong 3-5 câu ngắn gọn
                        5. Giọng văn thân thiện, nhiệt tình
                        6. Kết thúc bằng câu hỏi mở để tiếp tục tương tác
                        
                        Phân tích:`
                    }]
                }]
            });

            return response.text;
        } catch (error) {
            console.error("AI Analysis Error:", error);
            return "Mình đã tìm thấy một số sản phẩm phù hợp cho bạn!";
        }
    };

    const renderProductsWithAnalysis = async (products, searchQuery = null) => {
        if (!products || products.length === 0) {
            return (
                <div style={{
                    backgroundColor: '#fff2f0',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #ff4d4f'
                }}>
                    <p>Hiện cửa hàng chưa có sản phẩm phù hợp với yêu cầu của bạn 😢</p>
                    <p>Bạn có muốn mình gợi ý một số mẫu giày khác không ạ?</p>
                    <Button
                        type="primary"
                        size="small"
                        style={{ marginTop: '8px' }}
                        onClick={async () => {
                            const randomProducts = await getRandomShoes(3);
                            lastSuggestedProducts.current = randomProducts;
                            // Thêm logic hiển thị sản phẩm ngẫu nhiên
                        }}
                    >
                        Gợi ý sản phẩm khác
                    </Button>
                </div>
            );
        }

        // Phân tích và sắp xếp sản phẩm
        const { sortedProducts, comparison } = sortAndCompareProducts(products);
        const aiAnalysis = await analyzeProducts(products);
        const topProducts = sortedProducts.slice(0, 3);

        return (
            <div style={{ maxWidth: '100%' }}>
                {/* Phần phân tích từ AI */}
                <div style={{
                    backgroundColor: '#f0f9ff',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    borderLeft: '4px solid #1890ff'
                }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        <span role="img" aria-label="analysis">💡</span> Phân tích từ H2Bot:
                    </p>
                    <p style={{ whiteSpace: 'pre-line' }}>{aiAnalysis}</p>
                </div>

                {/* Phần sản phẩm tốt nhất */}
                {comparison.bestProduct && (
                    <div style={{
                        backgroundColor: '#fffbe6',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        border: '1px solid #ffe58f'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{
                                backgroundColor: '#faad14',
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '8px'
                            }}>
                                👍
                            </span>
                            <h4 style={{ margin: 0, color: '#d48806' }}>SẢN PHẨM TỐT NHẤT</h4>
                        </div>

                        <div style={{
                            display: 'flex',
                            margin: '8px 0',
                            backgroundColor: '#fff',
                            padding: '10px',
                            borderRadius: '6px'
                        }}>
                            <img
                                src={comparison.bestProduct.product.mainImage || 'https://via.placeholder.com/150?text=Ảnh+phụ'}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    marginRight: '10px'
                                }}
                                alt={comparison.bestProduct.product.productName}
                            />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                                    {comparison.bestProduct.product.productName}
                                </h4>
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                                    Thương hiệu: {comparison.bestProduct.product.brand?.brandName || 'Không rõ'}
                                </p>
                                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#666' }}>
                                    Giá từ: {Math.min(...comparison.bestProduct.variants.map(v => v.price || 0)).toLocaleString()}đ
                                </p>

                                {comparison.bestProductReasons.length > 0 && (
                                    <div style={{ marginTop: '8px' }}>
                                        <p style={{ fontSize: '12px', marginBottom: '4px', fontWeight: '500' }}>
                                            Lý do chọn:
                                        </p>
                                        <ul style={{
                                            margin: 0,
                                            paddingLeft: '16px',
                                            fontSize: '12px'
                                        }}>
                                            {comparison.bestProductReasons.map((reason, i) => (
                                                <li key={i}>{reason}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Button
                            type="primary"
                            size="small"
                            style={{
                                marginTop: '8px',
                                backgroundColor: '#faad14',
                                borderColor: '#faad14'
                            }}
                            onClick={() => window.open(`/product/${comparison.bestProduct.product.id}`, '_blank')}
                        >
                            Xem chi tiết sản phẩm tốt nhất
                        </Button>
                    </div>
                )}

                {/* Danh sách sản phẩm đề xuất */}
                <p style={{
                    marginBottom: '10px',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '6px'
                }}>
                    {searchQuery ? `Sản phẩm phù hợp (${products.length})` : 'Gợi ý cho bạn'}
                </p>

                {topProducts.map(({ product, variants }, index) => (
                    <div key={product.id} style={{
                        marginBottom: '15px',
                        border: '1px solid #e8e8e8',
                        borderRadius: '8px',
                        padding: '10px',
                        backgroundColor: '#fafafa',
                        position: 'relative',
                        ...(index === 0 && comparison.bestProduct?.product.id === product.id ? {
                            border: '2px solid #faad14',
                            boxShadow: '0 2px 8px rgba(250, 173, 20, 0.15)'
                        } : {})
                    }}>
                        {index === 0 && comparison.bestProduct?.product.id === product.id && (
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '10px',
                                backgroundColor: '#faad14',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: 'bold'
                            }}>
                                TỐT NHẤT
                            </div>
                        )}

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
                                    Giá từ: {Math.min(...variants.map(v => v.price || 0)).toLocaleString()}đ
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
                            type={index === 0 && comparison.bestProduct?.product.id === product.id ? 'primary' : 'default'}
                            size="small"
                            style={{
                                marginTop: '10px',
                                width: '100%',
                                fontSize: '12px',
                                ...(index === 0 && comparison.bestProduct?.product.id === product.id ? {
                                    backgroundColor: '#faad14',
                                    borderColor: '#faad14'
                                } : {})
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

                <div style={{
                    marginTop: '15px',
                    padding: '10px',
                    backgroundColor: '#f6ffed',
                    borderRadius: '6px',
                    borderLeft: '4px solid #52c41a'
                }}>
                    <p style={{ marginBottom: '5px', fontWeight: '500' }}>
                        <span role="img" aria-label="tip">💡</span> Lời khuyên từ H2Bot:
                    </p>
                    <p style={{ fontSize: '12px', margin: 0 }}>
                        {comparison.bestProduct ?
                            `Mình khuyên bạn nên chọn "${comparison.bestProduct.product.productName}" vì ${comparison.bestProductReasons.join(', ').toLowerCase()}.` :
                            'Hãy xem xét nhu cầu và ngân sách của bạn để chọn sản phẩm phù hợp nhất.'}
                    </p>
                </div>
            </div>
        );
    };

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        // Thêm câu hỏi vào lịch sử
        setChatHistory([...chatHistory, { sender: 'user', message: chatMessage }]);
        setChatMessage('');
        setLoading(true);

        const lowerMessage = chatMessage.toLowerCase();
        const greetings = ['xin chào', , 'chào', 'chào bạn', 'hello', 'hi', 'chào bot', 'chào h2bot'];
        const thanks = ['cảm ơn', 'thanks', 'thank you', 'cám ơn'];

        if (greetings.some(g => lowerMessage.includes(g))) {
            setChatHistory(prev => [...prev, {
                sender: 'ai',
                message: `Chào bạn! Mình là H2Bot, trợ lý ảo của cửa hàng giày H2TL. Bạn cần mình giúp gì nữa không ạ? 😊`
            }]);
            setCurrentSearchConditions(null); // Reset điều kiện tìm kiếm
            setLoading(false);
            return;
        }

        if (thanks.some(t => lowerMessage.includes(t))) {
            setChatHistory(prev => [...prev, {
                sender: 'ai',
                message: `Không có gì đâu ạ! Mình rất vui khi được giúp bạn. Nếu cần thêm gì cứ nói mình nhé! ❤️`
            }]);
            setCurrentSearchConditions(null); // Reset điều kiện tìm kiếm
            setLoading(false);
            return;
        }

        const suggestionTriggers = [
            'gợi ý', 'giới thiệu', 'bất kỳ', 'ngẫu nhiên',
            'mẫu nào', 'sản phẩm nào', 'mẫu gì', 'mẫu giày',
            'kể tên', 'cho xem', 'show me', 'suggest'
        ];

        const isSuggestionRequest = suggestionTriggers.some(trigger =>
            lowerMessage.includes(trigger)
        ) || /(có|cho).*mẫu nào|(giới thiệu|gợi ý).*(giày|sản phẩm)/i.test(lowerMessage);

        if (isSuggestionRequest) {
            try {
                const randomProducts = await getRandomShoes(3);
                lastSuggestedProducts.current = randomProducts;

                if (randomProducts.length > 0) {
                    setChatHistory(prev => [...prev, {
                        sender: 'ai',
                        message: (
                            <div style={{ maxWidth: '100%' }}>
                                <div style={{
                                    backgroundColor: '#fffae6',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}>
                                    <p style={{
                                        fontWeight: 'bold',
                                        color: '#ff9900',
                                        marginBottom: '5px',
                                        fontSize: '14px'
                                    }}>
                                        ⭐ Gợi ý dành riêng cho bạn
                                    </p>
                                    <p style={{ marginBottom: '10px' }}>
                                        Dưới đây là một số mẫu giày đẹp tại cửa hàng, bạn xem có mẫu nào ưng ý không ạ? 💖
                                    </p>
                                </div>

                                {randomProducts.map(({ product, variants }) => (
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
                                            </div>
                                        </div>

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

                                <p style={{
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    color: '#666',
                                    marginTop: '10px'
                                }}>
                                    Bạn muốn xem thêm mẫu khác không? Mình có thể gợi ý thêm nhé! 😊
                                </p>
                            </div>
                        )
                    }]);
                } else {
                    setChatHistory(prev => [...prev, {
                        sender: 'ai',
                        message: "Hiện cửa hàng mình chưa có sản phẩm nào ạ. Bạn quay lại sau nhé! ❤️"
                    }]);
                }

                setLoading(false);
                return;
            } catch (error) {
                console.error("Error getting random products:", error);
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    message: "Xin lỗi, mình không thể lấy thông tin sản phẩm ngay lúc này. Bạn vui lòng thử lại sau nhé!"
                }]);
                setLoading(false);
                return;
            }
        }

        const comparisonKeywords = ['so sánh', 'tốt hơn', 'nên chọn', 'khuyên dùng'];
        const isComparisonRequest = comparisonKeywords.some(kw => lowerMessage.includes(kw));

        if (isComparisonRequest) {
            if (lastSuggestedProducts.current.length > 1) {
                const comparisonUI = await renderProductsWithAnalysis(lastSuggestedProducts.current);
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    message: (
                        <div>
                            <p>🔍 Đây là phân tích chi tiết các sản phẩm:</p>
                            {comparisonUI}
                        </div>
                    )
                }]);
            } else {
                setChatHistory(prev => [...prev, {
                    sender: 'ai',
                    message: (
                        <div>
                            <p>Hiện chưa có đủ sản phẩm để so sánh 😅</p>
                            <p>Bạn có thể:</p>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                <li>Tìm kiếm nhiều sản phẩm hơn (ví dụ: "tìm giày thể thao")</li>
                                <li>Hoặc yêu cầu gợi ý nhiều sản phẩm (ví dụ: "gợi ý giày nam cho tôi")</li>
                            </ul>
                        </div>
                    )
                }]);
            }
            setLoading(false);
            return;
        }

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
                responseMessage = 'Bạn có thể tham khảo một số sản phẩm sau đây:';
                if (searchQuery.shoe) responseMessage += ` sản phẩm "${searchQuery.shoe}"`;
                if (searchQuery.brand) responseMessage += ` thương hiệu ${searchQuery.brand}`;
                if (searchQuery.category) responseMessage += ` danh mục ${searchQuery.category}`;
                if (searchQuery.material) responseMessage += ` chất liệu ${searchQuery.material}`;
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
                lastSuggestedProducts.current = products;
            }
            // Xử lý tìm kiếm theo giá đơn lẻ
            else if (typeof searchQuery === 'object' && searchQuery.type === 'price') {
                products = await searchShoes(searchQuery);
                lastSuggestedProducts.current = products;

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
                lastSuggestedProducts.current = products;
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
                    message: `Hiện tại cửa hàng chưa có sản phẩm như "${chatMessage}" 😅. Nhưng đừng lo, bạn có muốn mình gợi ý một số mẫu giày nam khác siêu đẹp không? 👟😊`
                }]);
                setLoading(false);
                return;
            }
            setLoading(false);
            return;
        }

        // Nếu không phải câu hỏi về sản phẩm, dùng Gemini
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `Bạn là H2Bot - trợ lý ảo thân thiện, nhiệt tình của cửa hàng giày H2TL. 

                Thông tin cửa hàng:
                - H2TL là cửa hàng chuyên bán **giày nam** với nhiều mẫu mã, kiểu dáng từ năng động đến lịch lãm.
                - Ưu tiên tư vấn và giới thiệu các sản phẩm dành cho **nam giới**.
                - Nếu gặp câu hỏi không liên quan đến giày nam (ví dụ giày nữ, đồ khác...), hãy trả lời một cách **khôn khéo, tinh tế** để hướng người dùng quay lại với sản phẩm giày nam.

                Tính cách:
                - Vui vẻ, hay dùng biểu tượng cảm xúc phù hợp
                - Luôn lịch sự, gọi khách hàng là "bạn"
                - Hay hỏi han, quan tâm khách hàng
                - Đôi khi hài hước nhẹ nhàng
                - Luôn sẵn sàng giúp đỡ
                
                Hãy trả lời câu hỏi sau theo tính cách trên không quá dài dòng: ${chatMessage}`,
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
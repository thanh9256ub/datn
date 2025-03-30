import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

const useWebSocket = (topic) => {
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Bỏ kiểm tra token vì bạn không cần token nữa
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setIsConnected(true);
                stompClient.subscribe(topic, (message) => {
                    // Message giờ là chuỗi, không cần JSON.parse
                    setMessages(prev => [...prev, message.body]);
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers.message);
                toast.error("Lỗi kết nối WebSocket");
            }
        });

        stompClient.activate();

        return () => {
            if (stompClient.connected) {
                stompClient.deactivate();
            }
        };
    }, [topic]);

    // Bỏ sendMessage vì bạn không cần gửi message từ client
    return { messages, isConnected };
};

export default useWebSocket;
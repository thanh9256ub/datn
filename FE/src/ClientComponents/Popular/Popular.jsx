import React from 'react';
import { Typography, Divider, Row, Col } from 'antd';
import data_product from '../Assets/data';
import Item from '../Item/Item.'; // Giả định đường dẫn đúng

const { Title } = Typography;

const Popular = () => {
    return (
        <div
            style={{
                padding: '20px 40px', // Tăng padding trái/phải từ 20px lên 40px để cách lề
                textAlign: 'center',
                minHeight: '90vh',
            }}
        >
            <Title
                level={1}
                style={{
                    color: '#171717',
                    fontSize: window.innerWidth > 1024 ? 50 : window.innerWidth > 800 ? 30 : 20,
                    fontWeight: 600,
                    marginBottom: 10,
                }}
            >
                POPULAR IN WOMEN
            </Title>
            <Divider
                style={{
                    width: window.innerWidth > 1024 ? 200 : window.innerWidth > 800 ? 120 : 100,
                    height: window.innerWidth > 1024 ? 6 : window.innerWidth > 800 ? 3 : 2,
                    borderRadius: 10,
                    background: '#252525',
                    margin: '0 auto',
                }}
            />
            <Row
                gutter={[20, 20]} // Khoảng cách giữa các cột và hàng
                justify="center"
                style={{
                    marginTop: window.innerWidth > 800 ? 20 : 10,
                    maxWidth: 1200, // Giới hạn chiều rộng tối đa để cách lề trên màn hình lớn
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                {data_product.map((item, i) => (
                    <Col
                        xs={12} // 2 cột trên mobile
                        md={6} // 4 cột trên desktop
                        key={i}
                    >
                        <Item
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Popular;
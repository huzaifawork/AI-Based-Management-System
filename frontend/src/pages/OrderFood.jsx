import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";

const menuItems = [
    { id: 1, name: "Burger", price: 5.99 },
    { id: 2, name: "Pizza", price: 8.99 },
    { id: 3, name: "Pasta", price: 6.49 }
];

export default function OrderFood() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleAddToCart = (item) => {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if item already exists in cart
        const itemIndex = existingCart.findIndex(cartItem => cartItem.id === item.id);

        if (itemIndex !== -1) {
            // If exists, increase quantity
            existingCart[itemIndex].quantity += 1;
        } else {
            // Add new item with quantity 1
            existingCart.push({ ...item, quantity: 1 });
        }

        // Update localStorage & state
        localStorage.setItem("cart", JSON.stringify(existingCart));
        setCart(existingCart);
        window.dispatchEvent(new Event("storage")); // Ensure navbar updates
    };

    return (
        <Container className="mt-4">
            <h2>Menu</h2>
            <Row>
                {menuItems.map(item => (
                    <Col key={item.id} md={4} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>${item.price}</Card.Text>
                                <Button variant="primary" onClick={() => handleAddToCart(item)}>Add to Cart</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

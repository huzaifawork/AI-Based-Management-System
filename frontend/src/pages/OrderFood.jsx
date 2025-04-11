import React, { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import '../styles/theme.css';

export default function OrderFood() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/menus');
                setMenuItems(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load menu items');
                setLoading(false);
                toast.error('Failed to load menu items');
                console.error('Error fetching menu items:', err);
            }
        };

        fetchMenuItems();
    }, []);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleAddToCart = (item) => {
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if item already exists in cart
        const itemIndex = existingCart.findIndex(cartItem => cartItem._id === item._id);

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
        window.dispatchEvent(new Event("cartUpdated")); // Ensure navbar updates
        toast.success(`${item.name} added to cart!`);
    };

    if (loading) {
        return (
            <Container className="mt-5 menu-container">
                <div className="loading-spinner">Loading menu items...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5 menu-container">
                <div className="error-message">{error}</div>
            </Container>
        );
    }

    return (
        <Container className="mt-5 menu-container">
            <h2 className="page-title">Menu</h2>
            <Row className="menu-items">
                {menuItems.map(item => (
                    <Col key={item._id} md={4} className="mb-3">
                        <Card className="menu-item">
                            <Card.Body className="menu-item-content">
                                {item.image && (
                                    <img 
                                        src={`http://localhost:8080${item.image}`} 
                                        alt={item.name} 
                                        className="menu-item-image"
                                    />
                                )}
                                <Card.Title className="menu-item-title">{item.name}</Card.Title>
                                <Card.Text className="menu-item-description">{item.description}</Card.Text>
                                <Card.Text className="menu-item-price">${item.price}</Card.Text>
                                <Button 
                                    className="add-to-cart-button" 
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!item.availability}
                                >
                                    {item.availability ? 'Add to Cart' : 'Unavailable'}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

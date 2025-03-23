import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Cart.css";

mapboxgl.accessToken = "pk.eyJ1IjoiaHV6YWlmYXQiLCJhIjoiY203bTQ4bW1oMGphYjJqc2F3czdweGp2MCJ9.w5qW_qWkNoPipYyb9MsWUw";

// Default coordinates for Abbottabad
const ABBOTTABAD_COORDS = [73.2215, 34.1688];
const RESTAURANT_COORDS = [73.2100, 34.1600];

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("Abbottabad, Pakistan");
  const [coordinates, setCoordinates] = useState(ABBOTTABAD_COORDS);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    if (cart.length === 0) return;

    // Initialize map with Abbottabad coordinates
    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: ABBOTTABAD_COORDS,
      zoom: 13,
    });

    // Add restaurant marker
    const restaurantEl = document.createElement('div');
    restaurantEl.className = 'restaurant-marker';
    restaurantEl.innerHTML = '🏠';
    new mapboxgl.Marker({ element: restaurantEl })
      .setLngLat(RESTAURANT_COORDS)
      .addTo(newMap);

    // Add delivery location marker
    const deliveryEl = document.createElement('div');
    deliveryEl.className = 'delivery-marker';
    deliveryEl.innerHTML = '📍';
    const newMarker = new mapboxgl.Marker({ element: deliveryEl })
      .setLngLat(ABBOTTABAD_COORDS)
      .addTo(newMap);

    // Add route line
    newMap.on('load', () => {
      newMap.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [RESTAURANT_COORDS, ABBOTTABAD_COORDS]
          }
        }
      });

      newMap.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#00a3ff',
          'line-width': 3,
        },
      });
    });

    // Add click handler
    newMap.on('click', handleMapClick);

    setMap(newMap);
    setMarker(newMarker);

    // Calculate initial delivery fee
    calculateDeliveryFee(ABBOTTABAD_COORDS);

    return () => {
      newMap.remove();
    };
  }, [cart.length]); // Only re-run when cart length changes

  const calculateDeliveryFee = async (coords) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${RESTAURANT_COORDS[0]},${RESTAURANT_COORDS[1]};${coords[0]},${coords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );

      const distance = response.data.routes[0].distance / 1000; // Convert to km
      const fee = Math.max(2, Math.ceil(distance * 0.5)); // $0.5 per km, minimum $2
      setDeliveryFee(fee);
    } catch (error) {
      console.error("Error calculating delivery fee:", error);
      setDeliveryFee(2); // Default fee
    }
  };

  const handleMapClick = (e) => {
    const newCoords = [e.lngLat.lng, e.lngLat.lat];
    setCoordinates(newCoords);
    if (marker) {
      marker.setLngLat(newCoords);
    }
    calculateDeliveryFee(newCoords);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const formattedItems = cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalPrice = subtotal + deliveryFee;

      const orderData = {
        items: formattedItems,
        totalPrice,
        deliveryFee,
        deliveryAddress,
        deliveryLocation: {
          type: "Point",
          coordinates: coordinates,
        },
      };

      const response = await axios.post(
        "http://localhost:8080/api/orders",
        orderData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.status === 201) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate(`/invoice/${response.data.order._id}`);
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    }
  };

  return (
    <div className="cart-container container mt-4">
      <h2>My Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="row">
            <div className="col-md-8">
              <Table striped bordered hover variant="dark" className="cosmic-table">
                <thead>
                  <tr>
                    <th>Food Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <Button variant="danger" onClick={() => handleRemoveItem(index)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="col-md-4">
              <Card className="delivery-card">
                <Card.Body>
                  <Card.Title>Delivery Details</Card.Title>
                  <div id="map" style={{ height: "300px", marginBottom: "1rem" }} />
                  <p className="text-muted">Click on the map to select delivery location</p>
                  <div className="fee-breakdown">
                    <p>Subtotal: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
                    <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
                    <h4>Total: ${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryFee).toFixed(2)}</h4>
                  </div>
                  <Button variant="success" onClick={handleCheckout} className="w-100">
                    Place Order
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
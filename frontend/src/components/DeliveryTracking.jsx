import { useState } from "react";
import { Spinner, Alert, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useDeliveryTracking from "../hooks/useDeliveryTracking";
import DeliveryMap from "./DeliveryMap";
import "./DeliveryTracking.css";

const DeliveryTracking = () => {
  const { orderId } = useParams();
  const [initialCenter] = useState([73.2100, 34.1600]);
  const { orderStatus, deliveryLocation, socketError } = useDeliveryTracking(orderId);
  const [mapLoaded, setMapLoaded] = useState(false);

  const token = localStorage.getItem("token");
  if (!token) {
    return <Alert variant="danger">You must be logged in to track orders.</Alert>;
  }

  return (
    <div className="container mt-4">
      <Card className="shadow-sm tracking-card">
        <Card.Body>
          <Card.Title>Order Tracking - #{orderId}</Card.Title>

          {socketError && <Alert variant="warning">{socketError}</Alert>}

          <div className="status-container mb-3">
            <strong>Status: </strong>
            <span className={`status-indicator ${orderStatus.toLowerCase().replace(" ", "-")}`}>
              {orderStatus}
            </span>
          </div>

          <div className="map-container">
            {!mapLoaded && (
              <div className="map-placeholder">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Loading map...</span>
              </div>
            )}

            <DeliveryMap
              deliveryLocation={deliveryLocation}
              initialCenter={initialCenter}
              onLoad={() => setMapLoaded(true)}
            />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DeliveryTracking;
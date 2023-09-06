import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button, Modal, Form } from 'react-bootstrap';

const WorldMap = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
  });
  const [taggedLocations, setTaggedLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [map, setMap] = useState(null); // Store the map instance
  const [marker, setMarker] = useState(null); // Store the marker instance

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleFormSubmit = () => {
    // Validate form data here if needed

    // Save the tagged location to the backend
    fetch('http://localhost:5000/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setTaggedLocations([...taggedLocations, data]);
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Initialize the map only once when the component mounts
    const newMap = L.map('world-map').setView([20.5937, 78.9629], 4); // Initial center and zoom

    // Add a tile layer (you can use different tile providers)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(newMap);

    // Store the map instance in the state
    setMap(newMap);

    return () => {
      // Clean up when the component unmounts
      newMap.remove();
    };
  }, []); // Empty dependency array to run this effect only once

  const handleMapContextMenu = (e) => {
    // Check if a marker already exists, and remove it
    if (map) {
      if (marker) {
        map.removeLayer(marker);
      }
      const { latlng } = e;
      // Create a new marker at the clicked location
      const newMarker = L.marker(latlng).addTo(map);
      setMarker(newMarker);
      
      // Set latitude and longitude in form data
      setFormData({
        ...formData,
        latitude: latlng.lat,
        longitude: latlng.lng,
      });

      // Show the modal for entering location details
      handleShow();
    }
  };

  useEffect(() => {
    // Attach contextmenu (right-click) event listener to the map
    if (map) {
      map.on('contextmenu', handleMapContextMenu);
      if(marker){
        marker.bindPopup('User-set marker').openPopup();
      }
    }

    return () => {
      // Clean up the event listener when the component unmounts
      if (map) {
        map.off('contextmenu', handleMapContextMenu);
      }
    };
  }, [map, formData]); // Dependency array includes map and formData

  return (
    <div>
      

      <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>Enter Location Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <div id="world-map" style={{ width: '50%', height: '400px' }} />
      <h2>Tagged Locations:</h2>
      <ul>
        {taggedLocations.map((location, index) => (
          <li key={index}>
            Name: {location.name}, Description: {location.description}, Latitude: {location.latitude}, Longitude: {location.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorldMap;

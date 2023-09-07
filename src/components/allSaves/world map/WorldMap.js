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
        fetchLocations();
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
      
    }).addTo(newMap);

    // Store the map instance in the state
    setMap(newMap);

    return () => {
      // Clean up when the component unmounts
      newMap.remove();
    };
  }, []); // Empty dependency array to run this effect only once

  const myIcon = L.icon({
    iconUrl: '/location.png',
    iconSize: [20,20],
    iconAnchor: [19, 38],
    popupAnchor: [-10, -30]
  });

  const handleMapContextMenu = (e) => {
    // Check if a marker already exists, and remove it
    if (map) {
      if (marker) {
        map.removeLayer(marker);
      }
      const { latlng } = e;
      // Create a new marker at the clicked location
      const newMarker = L.marker(latlng,{icon: myIcon}).addTo(map);
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

  const fetchLocations = () => {
    fetch('http://localhost:5000/locations', {
        method: "GET"
    })
    .then(async (res) => {
      setTaggedLocations(await res.json())
      
    })
    .catch((error) => console.log(error))
    
}

 

  useEffect(() => {

    fetchLocations();

    // Attach contextmenu (right-click) event listener to the map
    if (map) {
      map.on('contextmenu', handleMapContextMenu);
    }

    return () => {
      // Clean up the event listener when the component unmounts
      if (map) {
        map.off('contextmenu', handleMapContextMenu);
      }
    };
    // eslint-disable-next-line
  }, [map, formData]); // Dependency array includes map and formData

  useEffect(() => {
    for (let index = 0; index < taggedLocations.length; index++) {
      const element = taggedLocations[index];
      const latlng = {
        lat : element.latitude,
        lng: element.longitude
      }
      L.marker(latlng,{icon:myIcon}).addTo(map).bindPopup(element.name)   ;
    }
    // eslint-disable-next-line
}, [taggedLocations]);


  return (
    <div className='container'>
    
      <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>Enter Location Details</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Location Name</Form.Label>
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

      <div id="world-map" style={{ width: '100%', height: '400px',border:"2px solid black", borderRadius:"20px" }} />
      <h2 className='text-center'>Tagged Locations:</h2>
      <table className='w-100'>
          <tr>
            <th className='text-center col-6'>Location</th>
            <th className='text-center col-6'>Description</th>
          </tr>
        {taggedLocations.map((location, index) => (
          <tr>
          <td key={index}>
            {location.name}
          </td>
          <td key={index}>
            {location.description}
          </td>
          </tr>
        ))}
        </table>
    </div>
  );
};

export default WorldMap;

import React, { useState, useEffect } from 'react';
import moment from 'moment';

const EventForm = ({ selectedEvent, onAddEvent, onClose, setEvents, events }) => {
  const [event, setEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    
    fetchEvents();
    // eslint-disable-next-line
  }, []);
  const fetchEvents = async () => {
    try {   
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setEvents([...events, data]); 
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (event.title === '') return;
  
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
  
      if (response.ok) {
        // Handle successful response
        const data = await response.json();
        // Perform any necessary actions after adding the event
        // For instance, update state or notify the user
        console.log(data);
      } else {
        // Handle error response
        throw new Error('Failed to add event');
      }
    } catch (error) {
      // Handle fetch errors
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      <h2>{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          class="form-control w-25"
          type="text"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />

        <label>Start Date and Time:</label>
        <input
        class="form-control w-25"
          type="datetime-local"
          value={moment(event.start).format('YYYY-MM-DDTHH:mm')}
          onChange={(e) =>
            setEvent({ ...event, start: new Date(e.target.value) })
          }
        />

        <label>End Date and Time:</label>
        <input
        class="form-control w-25"
          type="datetime-local"
          value={moment(event.end).format('YYYY-MM-DDTHH:mm')}
          onChange={(e) => setEvent({ ...event, end: new Date(e.target.value) })}
        />

        <div>
          <button className='btn my-3' type="submit">{selectedEvent ? 'Update' : 'Add'}</button>
          {selectedEvent && (
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EventForm;

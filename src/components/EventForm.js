import React, { useState, useEffect } from 'react';

const EventForm = ({ selectedEvent, onAddEvent, onClose, setEvents, fetchEvents }) => {
  const [event, setEvent] = useState({
    title: '',
    start: new Date().toISOString().slice(0, 16), // Default to ISO string format
    end: new Date().toISOString().slice(0, 16), // Default to ISO string format
  });

  useEffect(() => {
    fetchEvents2();
    // eslint-disable-next-line
  }, []);

  const fetchEvents2  = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setEvents(data.map(event => ({
          ...event,
          start: new Date(event.start).toISOString().slice(0, 16),
          end: new Date(event.end).toISOString().slice(0, 16),
        })));
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
    console.log(selectedEvent);
    if(selectedEvent){
      try {
        const response = await fetch('http://localhost:5000/api/update-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({event,selectedEvent}),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          console.log("Event updated successfully");
        } else {
          throw new Error('Failed to update event');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally{
        selectedEvent=false;
        onClose();
        fetchEvents();
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onAddEvent({
          ...event,
          start: new Date(event.start).toISOString().slice(0, 16),
          end: new Date(event.end).toISOString().slice(0, 16),
        });
        setEvent({
          title: '',
          start: new Date().toISOString().slice(0, 16),
          end: new Date().toISOString().slice(0, 16),
        });
      } else {
        throw new Error('Failed to add event');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteEvent = async()=>{
    console.log(selectedEvent)
    if(!selectedEvent) return;
    try {
      const response = await fetch(`http://localhost:5000/api/delete-event/${selectedEvent._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if(response.ok){
        fetchEvents();
        console.log("Event deleted sucessfully")
      }
      else{
        throw new Error('Failed to delete the event')
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div>
      <h2>{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          className="form-control w-25"
          type="text"
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />

        <label>Start Date and Time:</label>
        <input
          className="form-control w-25"
          type="datetime-local"
          value={event.start}
          onChange={(e) => setEvent({ ...event, start: e.target.value })}
        />

        <label>End Date and Time:</label>
        <input
          className="form-control w-25"
          type="datetime-local"
          value={event.end}
          onChange={(e) => setEvent({ ...event, end: e.target.value })}
        />

        <div>
          <button className='btn my-3' type="submit">{selectedEvent ? 'Update Event' : 'Add Event'}</button>
          {selectedEvent && (
            <>
            <button className='btn my-3 mx-3' type="button" onClick={deleteEvent}>
              Delete Event
            </button>
            <button className='btn my-3' type="button" onClick={onClose}>
              Cancel
            </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EventForm;

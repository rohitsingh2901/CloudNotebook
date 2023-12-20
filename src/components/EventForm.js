import React, { useState, useEffect } from 'react';
import moment from 'moment';

const EventForm = ({ selectedEvent, onAddEvent, onClose }) => {
  const [event, setEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
  });

  useEffect(() => {
    if (selectedEvent) {
      setEvent(selectedEvent);
    } else {
      setEvent({
        title: '',
        start: new Date(),
        end: new Date(),
      });
    }
  }, [selectedEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(event);
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

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import EventForm from '../../EventForm';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        })));
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  const handleEventClose = () => {
    setSelectedEvent(null);
  };

  const handleEventAdd = (newEvent) => {
    setEvents([...events, newEvent]);
    handleEventClose();
  };

  return (
    <div className='container'>
      <h1 className='text-center font-bold my-8'>Set Events and Reminders</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor={(event) => new Date(event.start)}
        endAccessor={(event) => new Date(event.end)}
        style={{ height: 500 }}
        onSelectEvent={handleEventSelect}
      />
      <EventForm
        selectedEvent={selectedEvent}
        onAddEvent={handleEventAdd}
        onClose={handleEventClose}
        setEvents={setEvents}
        fetchEvents={fetchEvents}
      />
    </div>
  );
};

export default MyCalendar;

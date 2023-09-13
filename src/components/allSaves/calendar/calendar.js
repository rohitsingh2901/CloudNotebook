import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import EventForm from '../../EventForm';

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventSelect}
      />
      <EventForm
        selectedEvent={selectedEvent}
        onAddEvent={handleEventAdd}
        onClose={handleEventClose}
      />
    </div>
  );
};

export default MyCalendar;

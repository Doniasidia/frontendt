"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MyCalendar = ({ onSlotsSelect, myEventsList }) => {
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const selectListener = () => {
      console.log('Selected:', selectedRange);
    };

    return () => {
      document.removeEventListener('select', selectListener);
    };
  }, [selectedRange]);

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;
    setSelectedRange({ start, end });
    const selectedSlotText = `${moment(start).format('dddd')} ${moment(start).format('h:mm a')} - ${moment(end).format('h:mm a')}`;
    const newSlots = [...selectedSlots, selectedSlotText];
    setSelectedSlots(newSlots);
    onSlotsSelect(newSlots);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 350, width: 675 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) => {
          // Handle event selection here
          console.log('Selected event:', event);
      }}
      defaultView="week"
      step={15}
        toolbar={false}
        formats={{
          dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
        }}
      />
      <div>
        <h2>Selected Slots:</h2>
        <ul>
          {selectedSlots.map((slot, index) => (
            <li key={index}>{slot}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MyCalendar;

"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { width } from 'dom-helpers';

const MyCalendar = (props) => {
  // State to keep track of the selected range
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    // Listen for the 'select' event to handle the final selection
    const selectListener = () => {
      // Handle the selected range
      console.log('Selected:', selectedRange);
      // You can update the UI or perform any action here
    };

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('select', selectListener);
    };
  }, [selectedRange]);

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;
    // Set the selected range
    setSelectedRange({ start, end });
    // Construct the selected slot text
    const selectedSlotText = `${moment(start).format('dddd')} ${moment(start).format('h:mm a')} - ${moment(end).format('h:mm a')}`;
    setSelectedSlots([...selectedSlots, selectedSlotText]);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={props.myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 350, width: 675 }}
        selectable
        onSelectSlot={handleSelectSlot}
        view="week"
        step={15} 
        // Key aspect: Pass a persistent value (e.g., an empty object) to selected
        selected={selectedRange || {}}
        toolbar={false}
        formats={{
          dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture), // Display only the day name
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

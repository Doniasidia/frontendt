"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'moment/locale/fr';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
moment.locale('fr');

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
    const selectedSlotText = `${moment(start).format('dddd')} ${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
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
          timeGutterFormat: 'HH:mm',
          eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
            return `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`;
          },
        }}
      />
      <div>
        <h2 className="text-lg text-cyan-900 font-bold mb-2 mt-2 text-center">Horaires des séances :</h2>
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

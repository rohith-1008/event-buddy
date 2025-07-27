import React from 'react';
import './Calendar.css';

// --- Helper Functions for Date Logic (keep these as they are) ---
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday...
const getMonthName = (date) => date.toLocaleString('default', { month: 'long' });
const getYear = (date) => date.getFullYear();
const formatDateForInput = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// --- End Helper Functions ---

// *** NEW PROP: categories ***
const Calendar = ({ events, currentDate, onPrevMonth, onNextMonth, onAddEvent, onEditEvent, onDeleteEvent, categories }) => {
  const year = getYear(currentDate);
  const month = currentDate.getMonth(); // 0 for January, 11 for December
  const today = new Date(); // Get today's date for highlighting

  const numDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const calendarDays = [];

  const prevMonthDate = new Date(year, month, 0);
  const numDaysPrevMonth = daysInMonth(prevMonthDate.getFullYear(), prevMonthDate.getMonth());

  for (let i = 0; i < startDay; i++) {
    const day = numDaysPrevMonth - startDay + 1 + i;
    const dateObj = new Date(year, month - 1, day);
    calendarDays.push({
      date: formatDateForInput(dateObj),
      dayNumber: day,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= numDays; i++) {
    const dateObj = new Date(year, month, i);
    calendarDays.push({
      date: formatDateForInput(dateObj),
      dayNumber: i,
      isCurrentMonth: true,
      isToday: formatDateForInput(dateObj) === formatDateForInput(today),
    });
  }

  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const dateObj = new Date(year, month + 1, i);
    calendarDays.push({
      date: formatDateForInput(dateObj),
      dayNumber: i,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={onPrevMonth}>&lt;</button>
        <span>{`${getMonthName(currentDate)} ${getYear(currentDate)}`}</span>
        <button onClick={onNextMonth}>&gt;</button>
      </div>

      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="calendar-grid">
        {calendarDays.map((dayInfo, index) => {
          const dayEvents = events.filter(event => event.date === dayInfo.date);

          return (
            <div
              key={index}
              className={`calendar-day ${!dayInfo.isCurrentMonth ? 'inactive-day' : ''} ${dayInfo.isToday ? 'current-day' : ''}`}
              onClick={() => dayInfo.isCurrentMonth && onAddEvent(dayInfo.date)}
            >
              <span className="day-number">{dayInfo.dayNumber}</span>
              <div className="events-list">
                {dayEvents.map(event => {
                  // Find the category object to get its color
                  const eventCategory = categories.find(cat => cat.id === event.category);
                  const backgroundColor = eventCategory ? eventCategory.color : '#e2f0fb'; // Fallback color
                  // Calculate a darker border color (simple way)
                  const borderColor = eventCategory ? darkenColor(eventCategory.color, 20) : '#cce7ff';
                  const textColor = eventCategory ? getContrastColor(backgroundColor) : '#333';


                  return (
                    <div
                      key={event.id}
                      className="event-item"
                      style={{ backgroundColor: backgroundColor, borderColor: borderColor, color: textColor }} // Apply dynamic styles
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEvent(event);
                      }}
                    >
                      <span className="event-time">{event.time}</span>
                      <span className="event-title">{event.title}</span>
                      <button
                        className="event-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
                            onDeleteEvent(event.id);
                          }
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;


// --- NEW Helper Function: Dynamically calculate contrasting text color based on background ---
function getContrastColor(hexcolor) {
    if (!hexcolor) return '#333'; // Default for safety

    // Convert hex to RGB
    var r = parseInt(hexcolor.substr(1, 2), 16);
    var g = parseInt(hexcolor.substr(3, 2), 16);
    var b = parseInt(hexcolor.substr(5, 2), 16);

    // Calculate luminance (Y = 0.299 R + 0.587 G + 0.114 B)
    var y = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Use black or white text depending on luminance
    return (y > 0.5) ? '#333' : '#fff';
}

// --- NEW Helper Function: Darken a hex color by a percentage ---
function darkenColor(hex, percent) {
    if (!hex) return '#333'; // Default for safety

    var f=parseInt(hex.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=(f>>8)&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
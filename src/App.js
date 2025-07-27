import React, { useState, useEffect } from 'react';
import './App.css';
import Calendar from './components/Calendar/Calendar';
import EventForm from './components/EventForm/EventForm';
import CategoryManager from './components/CategoryManager/CategoryManager';

// --- Helper Functions for Category localStorage ---
const getDefaultCategories = () => [
  { id: 'personal', name: 'Personal', color: '#d1ecf1' }, // Light Blue
  { id: 'work', name: 'Work', color: '#d4edda' },     // Light Green
  { id: 'health', name: 'Health', color: '#fff3cd' },   // Light Yellow
  { id: 'social', name: 'Social', color: '#f8d7da' },   // Light Red
  { id: 'other', name: 'Other', color: '#e2e3e5' },     // Light Gray
];

const getCategoriesFromLocalStorage = () => {
  try {
    const storedCategories = localStorage.getItem('calendarCategories');
    if (!storedCategories) {
      return getDefaultCategories();
    }
    const parsedCategories = JSON.parse(storedCategories);
    const defaultIds = new Set(getDefaultCategories().map(cat => cat.id));
    const mergedCategories = [...parsedCategories];
    getDefaultCategories().forEach(defaultCat => {
        if (!parsedCategories.some(cat => cat.id === defaultCat.id)) {
            mergedCategories.push(defaultCat);
        }
    });
    return mergedCategories;
  } catch (error) {
    console.error("Error loading categories from localStorage:", error);
    return getDefaultCategories();
  }
};

const saveCategoriesToLocalStorage = (categories) => {
  try {
    localStorage.setItem('calendarCategories', JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories to localStorage:", error);
  }
};
// --- END NEW Helper Functions ---


// Helper functions for Event localStorage
const getEventsFromLocalStorage = () => {
  try {
    const storedEvents = localStorage.getItem('calendarEvents');
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error("Error loading events from localStorage:", error);
    return [];
  }
};

const saveEventsToLocalStorage = (events) => {
  try {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  } catch (error) {
    console.error("Error saving events to localStorage:", error);
  }
};

function App() { // <--- The App component starts here
  const [events, setEvents] = useState(getEventsFromLocalStorage());
  const [categories, setCategories] = useState(getCategoriesFromLocalStorage());

  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // Save categories to localStorage whenever the 'categories' state changes
  useEffect(() => {
    saveCategoriesToLocalStorage(categories);
  }, [categories]);

  // Save events to localStorage whenever the 'events' state changes
  useEffect(() => {
    saveEventsToLocalStorage(events);
  }, [events]);

  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowEventForm(false);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleOpenAddEventForm = (date = null) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleOpenEditEventForm = (event) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setShowEventForm(true);
  };

  const handleCloseEventForm = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Functions for Category Management
  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const handleDeleteCategory = (categoryId) => {
    if (['personal', 'work', 'health', 'social', 'other'].includes(categoryId)) {
        alert("Cannot delete default categories.");
        return;
    }

    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.id !== categoryId)
    );
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.category === categoryId ? { ...event, category: 'personal' } : event
      )
    );
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return ( // <--- JSX returned by App component starts here
    <div className="App">
      <h1>Event Buddy</h1>

      <div className="controls-container">
        <button className="add-event-button" onClick={() => handleOpenAddEventForm()}>Add New Event</button>

        <input
          type="text"
          placeholder="Search events by title or description..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <CategoryManager
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <Calendar
        events={filteredEvents}
        currentDate={currentDate}
        onPrevMonth={goToPreviousMonth}
        onNextMonth={goToNextMonth}
        onAddEvent={handleOpenAddEventForm}
        onEditEvent={handleOpenEditEventForm}
        onDeleteEvent={handleDeleteEvent}
        categories={categories}
      />

      {showEventForm && (
        <EventForm
          onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
          initialEvent={selectedEvent || { date: selectedDate, category: 'personal' }}
          onClose={handleCloseEventForm}
          categories={categories}
        />
      )}
    </div>
  );
} // <--- The App component ends here

export default App;
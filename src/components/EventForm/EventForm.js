import React, { useState, useEffect } from 'react'; // Add useEffect
import './EventForm.css';

// *** NEW PROP: categories ***
const EventForm = ({ onSave, initialEvent = null, onClose, categories }) => {
  const [title, setTitle] = useState(initialEvent ? initialEvent.title : '');
  const [description, setDescription] = useState(initialEvent ? initialEvent.description : '');
  const [date, setDate] = useState(initialEvent ? initialEvent.date : '');
  const [time, setTime] = useState(initialEvent ? initialEvent.time : '');
  // Ensure the category defaults to a valid one, or 'personal' if not set
  const [category, setCategory] = useState(
      initialEvent && categories.some(cat => cat.id === initialEvent.category)
        ? initialEvent.category
        : 'personal'
  );

  // Set initial category for new events or if existing event has invalid category
  useEffect(() => {
    if (initialEvent && !categories.some(cat => cat.id === initialEvent.category)) {
      setCategory('personal'); // Fallback to 'personal' if event has an invalid/deleted category
    }
  }, [initialEvent, categories]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date) {
      alert('Title and Date are required!');
      return;
    }

    const newEvent = {
      id: initialEvent ? initialEvent.id : Date.now().toString(),
      title,
      description,
      date,
      time,
      category, // Use the selected category ID
    };
    onSave(newEvent);
    // onClose(); // Handled by onSave caller now (App.js)
  };

  return (
    <div className="event-form-overlay">
      <div className="event-form-container">
        <h3>{initialEvent && initialEvent.id ? 'Edit Event' : 'Add New Event'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time (Optional):</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {/* Dynamically render options from categories prop */}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit">{initialEvent && initialEvent.id ? 'Update Event' : 'Add Event'}</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
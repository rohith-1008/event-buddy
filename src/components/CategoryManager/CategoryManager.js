import React, { useState } from 'react';
import './CategoryManager.css';

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#ADD8E6'); // Default light blue

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') {
      alert('Category name cannot be empty.');
      return;
    }
    const newId = newCategoryName.trim().toLowerCase().replace(/\s/g, '-'); // Simple ID generation
    if (categories.some(cat => cat.id === newId)) {
      alert('Category with this name already exists!');
      return;
    }

    onAddCategory({ id: newId, name: newCategoryName.trim(), color: newCategoryColor });
    setNewCategoryName('');
    setNewCategoryColor('#ADD8E6');
  };

  return (
    <div className="category-manager-container">
      <h3>Manage Categories</h3>

      <form onSubmit={handleAddSubmit} className="add-category-form">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          required
        />
        <input
          type="color"
          value={newCategoryColor}
          onChange={(e) => setNewCategoryColor(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      <div className="category-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item-display">
            <span
              className="category-color-dot"
              style={{ backgroundColor: category.color }}
            ></span>
            <span className="category-name">{category.name}</span>
            {/* Prevent deleting default categories */}
            {['personal', 'work', 'health', 'social', 'other'].includes(category.id) ? (
                <span className="default-category-tag">(Default)</span>
            ) : (
                <button
                    className="delete-category-btn"
                    onClick={() => {
                        if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This will not delete events, but their category will revert to 'Personal'.`)) {
                            onDeleteCategory(category.id);
                        }
                    }}
                >
                    &times;
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';

const TagsInput = ({ newTag, setNewTag }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChangeLocal = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setNewTag((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
      event.preventDefault();
    }
  };

  const handleDelete = (tagToDelete) => () => {
    setNewTag((prev) => prev.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div className="form-group">
      <label>Tags:</label>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
        {newTag.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onDelete={handleDelete(tag)}
            sx={{ m: 0.5 }}
          />
        ))}
      </Box>
      <textarea
        name="tags"
        value={inputValue}
        onChange={handleInputChangeLocal}
        onKeyDown={handleKeyDown}
        rows={Math.max(newTag.length, 1)}
        style={{ resize: 'vertical' }}
        className="resize-textarea"
        placeholder="Press Enter to add tag"
      />
    </div>
  );
};

export default TagsInput;

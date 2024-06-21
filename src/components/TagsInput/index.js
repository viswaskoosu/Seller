import React, { useState } from 'react';
import { Chip, Box } from '@mui/material';

const TagsInput = ({ newTag, setNewTag, handleInputChange, name, displayName }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChangeLocal = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      if (newTag.some(tag => tag===inputValue.trim())){
        setInputValue('');
        event.preventDefault();
        return
      }
      setNewTag((prev) => [...prev, inputValue.trim()]);
      setInputValue('');
      handleInputChange({target: {value: [...newTag, inputValue.trim()], name: name}})
      event.preventDefault();
    }
  };

  const handleDelete = (tagToDelete) => () => {
    const updatedTags = newTag.filter((tag) => tag !== tagToDelete)
    setNewTag(updatedTags);
    handleInputChange({target: {value: updatedTags, name: name}})
  };

  return (
    <div className="form-group">
      <label>{`${displayName}`}:</label>
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
        placeholder={`Press Enter to add ${displayName}`}
      />
    </div>
  );
};

export default TagsInput;

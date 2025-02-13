import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import Input from './Input';
import Button from './Button';

export default function RefillModal({ isOpen, onClose, onSubmit }) {
    
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue(''); 
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Refill Balance</h2>
        <Input
          type="text"
          placeholder="Credit Count"
          label="Credit Count"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex gap-4 justify-between mt-4">
          <Button
            color="bg-red-500"
            text="Cancel"
            onClick={onClose}
          />
          <Button
            color="bg-green-500"
            text="Refill"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

RefillModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

import { Input } from '@nextui-org/react';
import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';

const SearchBar: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}> = ({ placeholder = 'Type to search...', value, onChange, onClear }) => {
  return (
    <Input
      placeholder={placeholder}
      startContent={<IoSearchOutline size={22} />}
      value={value}
      onChange={onChange}
      onClear={onClear}
      isClearable={true}
    />
  );
};

export default SearchBar;

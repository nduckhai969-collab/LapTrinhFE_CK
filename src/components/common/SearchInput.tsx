import { Search } from 'lucide-react';

export interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}
const SearchInput = ({
                       value = '',
                       placeholder = 'Tìm kiếm...',
                       onChange,
                       onSearch,
                       className = '',
                     }: SearchInputProps) => {
  const wrapperClass = className
      ? `search-box ${className}`
      : 'search-box';

  const handleKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      onSearch?.(value);
    }
  };

  return (
      <div className={wrapperClass}>
        <Search size={18} className="search-icon" />

        <input
            type="text"
            className="search-field"
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange?.(event.target.value)}
            onKeyDown={handleKeyDown}
        />
      </div>
  );
};
export default SearchInput;

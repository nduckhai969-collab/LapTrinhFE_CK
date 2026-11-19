import { Search } from 'lucide-react';

export interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchInput = ({ placeholder = 'Tìm kiếm...', className }: SearchInputProps) => {
  const wrapperClass = className ? `search-box ${className}` : 'search-box';

  return (
    <div className={wrapperClass}>
      <Search size={18} className="search-icon" />
      <input type="text" className="search-field" placeholder={placeholder} />
    </div>
  );
};

export default SearchInput;

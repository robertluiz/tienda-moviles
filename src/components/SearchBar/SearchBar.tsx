import { useState, ChangeEvent, FormEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = 'Buscar productos...' }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Realiza busca em tempo real
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          aria-label="Buscar"
        />
        {searchTerm && (
          <button 
            type="button" 
            className="clear-button" 
            onClick={handleClear}
            aria-label="Limpiar búsqueda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <button type="submit" className="search-button" aria-label="Buscar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 
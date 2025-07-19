
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Buscar produtos..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 py-3 text-lg border-2 focus:border-red-500 transition-colors"
      />
    </div>
  );
};

export default SearchBar;

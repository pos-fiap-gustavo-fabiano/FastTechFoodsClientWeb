
import React from 'react';
import { Button } from '@/components/ui/button';
import useCategories from '@/hooks/useCategories';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="animate-pulse bg-gray-200 rounded h-10 w-20"></div>
        <div className="animate-pulse bg-gray-200 rounded h-10 w-24"></div>
        <div className="animate-pulse bg-gray-200 rounded h-10 w-28"></div>
        <div className="animate-pulse bg-gray-200 rounded h-10 w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="text-red-500 text-sm">Erro ao carregar categorias: {error}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onCategoryChange(null)}
        className={selectedCategory === null ? "gradient-primary" : ""}
      >
        Todos
      </Button>
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={`${selectedCategory === category.id ? "gradient-primary" : ""} flex items-center space-x-2`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;

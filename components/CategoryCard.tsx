'use client';

interface CategoryCardProps {
  category: string;
  recipeCount: number;
  onSelect: () => void;
}

export default function CategoryCard({ 
  category, 
  recipeCount,
  onSelect
}: CategoryCardProps) {
  return (
    <div 
      onClick={onSelect}
      className="p-6 border rounded-lg shadow hover:shadow-lg transition-all cursor-pointer bg-white text-black"
    >
      <h3 className="text-xl font-semibold capitalize mb-2">{category}</h3>
      <p className="text-gray-600">
        {recipeCount} {recipeCount === 1 ? 'Recipe' : 'Recipes'}
      </p>
    </div>
  );
}
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="p-6 border rounded-lg shadow bg-white">
      <h3 className="text-lg text-black font-semibold capitalize mb-3">{recipe.title}</h3>
      <div className="text-sm text-black whitespace-pre-wrap">
        {recipe.content}
      </div>
    </div>
  );
}
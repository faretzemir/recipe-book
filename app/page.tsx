'use client';

import { useEffect, useState } from 'react';
import { fetchRecipes } from '@/utils/github';
import { Recipe, RecipesByType } from '@/types/recipe';
import RecipeCard from '@/components/RecipeCard';
import { getAllCategories } from '@/utils/recipeCategories';
import CategoryCard from '@/components/CategoryCard';

export default function Home() {
  const [recipesByType, setRecipesByType] = useState<RecipesByType>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      const recipes = await fetchRecipes();
      const grouped = recipes.reduce((acc: RecipesByType, recipe: Recipe) => {
        if (!acc[recipe.type]) {
          acc[recipe.type] = [];
        }
        acc[recipe.type].push(recipe);
        return acc;
      }, {});
      setRecipesByType(grouped);
      setLoading(false);
    };

    loadRecipes();
  }, []);

  // Get only categories that have recipes
  const activeCategories = getAllCategories().filter(cat => recipesByType[cat]?.length > 0);

  if (loading) {
    return <div className="min-h-screen p-8 text-center">Loading recipes...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Faretz and Naddy&apos;s Online Recipe Book
      </h1>
      
      <div className="max-w-6xl mx-auto">
        {selectedCategory ? (
          <div>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-black"
            >
              ← Back to Categories
            </button>
            
            <h2 className="text-2xl font-semibold mb-6 capitalize text-black">
              {selectedCategory} Recipes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipesByType[selectedCategory].map((recipe) => (
                <RecipeCard key={recipe.fileName} recipe={recipe} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCategories.map((category) => (
              <CategoryCard
                key={category}
                category={category}
                recipeCount={recipesByType[category]?.length || 0}
                onSelect={() => setSelectedCategory(category)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
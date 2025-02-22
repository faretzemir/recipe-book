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
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const loadRecipes = async () => {
      const recipes = await fetchRecipes();
      setAllRecipes(recipes);
      
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

  const activeCategories = getAllCategories().filter(cat => recipesByType[cat]?.length > 0);

  const searchResults = searchTerm
    ? allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return <div className="min-h-screen p-8 text-center">Loading recipes...</div>;
  }

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        Faretz and Naddy's Online Recipe Book
      </h1>
      
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-black"
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {searchTerm ? (
          // Search Results View
          <div>
            <button 
              onClick={handleClearSearch}
              className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-black"
            >
              ← Back to Categories
            </button>
            
            <h2 className="text-2xl font-semibold mb-6 text-black">
              Search Results for "{searchTerm}"
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((recipe) => (
                  <RecipeCard key={recipe.fileName} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No recipes found matching "{searchTerm}"</p>
            )}
          </div>
        ) : selectedCategory ? (
          // Category View
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
          // Main Categories View
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
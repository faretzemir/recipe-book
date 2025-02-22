import { Recipe } from '@/types/recipe';
import { categorizeRecipe } from './recipeCategories';

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/faretzemir/Recipes/main';
const GITHUB_API_URL = 'https://api.github.com/repos/faretzemir/Recipes/contents';

export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await fetch(GITHUB_API_URL);
  const files = await response.json();
  
  const recipes = await Promise.all(
    files
      .filter((file: any) => file.name.endsWith('.txt'))
      .map(async (file: any) => {
        const content = await fetch(`${GITHUB_RAW_URL}/${file.name}`).then(res => res.text());
        
        const title = file.name
          .replace('.txt', '')
          .replace(/[_-]/g, ' ')
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        return {
          title,
          type: categorizeRecipe(content, title), // Pass both content and title
          content,
          fileName: file.name
        };
      })
  );

  return recipes;
}
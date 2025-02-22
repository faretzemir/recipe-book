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
        let content = await fetch(`${GITHUB_RAW_URL}/${file.name}`).then(res => res.text());
        
        // Remove the first line if it contains "Name="
        content = content
          .split('\n')
          .filter(line => !line.toLowerCase().startsWith('name='))
          .join('\n')
          .trim(); // Trim any extra whitespace

        const title = file.name
          .replace('.txt', '')
          .replace(/[_-]/g, ' ')
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        return {
          title,
          type: categorizeRecipe(content, title),
          content,
          fileName: file.name
        };
      })
  );

  return recipes;
}
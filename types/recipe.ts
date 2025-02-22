export interface Recipe {
    title: string;
    type: string;
    content: string;
    fileName: string;
  }
  
  export type RecipesByType = {
    [key: string]: Recipe[];
  };
type CategoryKeywords = {
  [key: string]: {
    exactPhrases: string[],
    keywords: string[]
  };
};

const categoryKeywords: CategoryKeywords = {
  'main': {  // Putting mains first for priority
    exactPhrases: ['fried rice', 'pad thai', 'stir fry', 'chili oil fried rice', 'chilli oil fried rice', 'pajeon'],
    keywords: ['chicken', 'beef', 'pork', 'fish', 'meat', 'steak', 'pasta', 'rice', 'potato', 'tofu', 'pad', 'curry', 'burger', 'udon']
  },
  'sauce': {
    exactPhrases: ['chili oil', 'chilli oil', 'hot sauce', 'dipping sauce', 'oil sauce', 'syrup'],
    keywords: ['sauce', 'dressing', 'gravy', 'marinade', 'glaze']
  },
  'soup': {
    exactPhrases: [],
    keywords: ['soup', 'broth', 'bouillon', 'chowder', 'bisque']
  },
  'dessert': {
    exactPhrases: ['ice cream'],
    keywords: ['cake', 'cookie', 'dessert', 'sweet', 'pie', 'chocolate', 'sugar', 'pudding']
  },
  'salad': {
    exactPhrases: [],
    keywords: ['salad', 'slaw', 'lettuce', 'greens']
  },
  'breakfast': {
    exactPhrases: [],
    keywords: ['breakfast', 'eggs', 'pancake', 'waffle', 'omelette', 'bacon']
  },
  'side': {
    exactPhrases: ['topping', 'side dish', 'enoki', 'broccoli'],
    keywords: ['side', 'vegetable', 'potato', 'beans']
  },
  'appetizer': {
    exactPhrases: [],
    keywords: ['appetizer', 'starter', 'dip', 'snack']
  }
};

export function categorizeRecipe(content: string, title: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();

  // First, check for the longest exact phrases in the title
  let longestMatch = { length: 0, category: '' };
  
  for (const [category, { exactPhrases }] of Object.entries(categoryKeywords)) {
    for (const phrase of exactPhrases) {
      if (lowerTitle.includes(phrase) && phrase.length > longestMatch.length) {
        longestMatch = { length: phrase.length, category };
      }
    }
  }
  
  if (longestMatch.category) {
    return longestMatch.category;
  }

  // Then check for single keywords in the title
  for (const [category, { keywords }] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return category;
    }
  }

  // Finally check content as a fallback
  for (const [category, { keywords, exactPhrases }] of Object.entries(categoryKeywords)) {
    if (exactPhrases.some(phrase => lowerContent.includes(phrase)) ||
        keywords.some(keyword => lowerContent.includes(keyword))) {
      return category;
    }
  }

  return 'other';
}

export function getAllCategories(): string[] {
  return Object.keys(categoryKeywords).concat(['other']);
}
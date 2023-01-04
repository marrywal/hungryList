export interface _ShoppingItem {
    title: string;
    count: string;
}

export interface _ShoppingList {
    category: string;
    data: _ShoppingItem[];
}

export interface _Ingredient {
    key: number,
    name: string,
    amount: string,
    unit: string
}

export interface _PrepStep {
    key: number,
    step: string
}

export type _Category = 'Vorspeise' | 'Hauptspeise' | 'Nachspeise' | 'Getränk' | 'Snack';
export type _CategoryNames = 'Vorspeisen' | 'Hauptspeisen' | 'Nachspeisen' | 'Getränke' | 'Snacks';

export interface _Recipe {
    title: string,
    personCount: number,
    duration: string,
    category: _Category,
    ingredients: _Ingredient[],
    prepSteps: _PrepStep[],
}

export interface _RecipeList {
    categoryName: _CategoryNames,
    data: _Recipe[]
}
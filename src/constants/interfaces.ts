export interface _ShoppingItem {
    title: string;
    count: string;
}

export interface _ShoppingList {
    category: string;
    data: _ShoppingItem[];
}

export interface _Ingredients {
    name: string,
    amount: string,
    unit: string
}

export type _Category = 'Snack' | 'Vorspeise' | 'Hauptspeise' | 'Nachspeise' | 'Getränk';

export interface _Recipe {
    title: string,
    duration: string,
    category: _Category,
    ingredients: _Ingredients[],
}
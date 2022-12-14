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

export interface _Recipe {
    title: string,
    duration: string,
    category: 'Snack' | 'Vorspeise' | 'Hauptspeise' | 'Nachspeise' | 'Getränk',
    ingredients: _Ingredients[],
}
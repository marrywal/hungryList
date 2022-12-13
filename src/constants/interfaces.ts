export interface ShoppingItem {
    title: string;
    count: string;
}

export interface ShoppingList {
    category: string;
    data: ShoppingItem[];
}
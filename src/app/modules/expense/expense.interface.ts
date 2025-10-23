export type IExpenseFilter = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    category?: string | undefined;
    type?: string | undefined;
};

export type IExpenseType = 'INCOME' | 'EXPENSE';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expenseReducer from './slices/expenseSlice';
import accountReducer from './slices/accountSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import loanReducer from './slices/loanSlice';
import budgetReducer from './slices/budgetSlice';
import themeReducer from './slices/themeSliceFixed';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        expenses: expenseReducer,
        accounts: accountReducer,
        subscriptions: subscriptionReducer,
        loans: loanReducer,
        budgets: budgetReducer,
        theme: themeReducer,
    },
});

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './slices/authSlice';
import expenseReducer from './slices/expenseSlice';
import accountReducer from './slices/accountSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import loanReducer from './slices/loanSlice';
import budgetReducer from './slices/budgetSlice';
import themeReducer from './slices/themeSliceFixed';
import appReducer from './slices/appSlice';

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    expenses: expenseReducer,
    accounts: accountReducer,
    subscriptions: subscriptionReducer,
    loans: loanReducer,
    budgets: budgetReducer,
    theme: themeReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'theme', 'app'], // Only persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore redux-persist actions
            },
        }),
});

export const persistor = persistStore(store);

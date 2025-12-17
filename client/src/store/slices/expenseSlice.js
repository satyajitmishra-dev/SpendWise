import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const guestExpenses = JSON.parse(localStorage.getItem('guest_expenses') || '[]');
                return guestExpenses;
            }
            const res = await api.get('/expenses');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to fetch' });
        }
    }
);

export const addExpense = createAsyncThunk(
    'expenses/addExpense',
    async (expenseData, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email); // Treat as guest if no token or no email (backend guest)

            if (isGuest) {
                const newExpense = {
                    ...expenseData,
                    _id: Date.now().toString(),
                    user: 'guest',
                    createdAt: new Date().toISOString()
                };
                const guestExpenses = JSON.parse(localStorage.getItem('guest_expenses') || '[]');
                const updatedExpenses = [newExpense, ...guestExpenses];
                localStorage.setItem('guest_expenses', JSON.stringify(updatedExpenses));

                // Simulate network delay for better UX
                await new Promise(resolve => setTimeout(resolve, 500));

                return newExpense;
            }
            const res = await api.post('/expenses', expenseData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to add' });
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const guestExpenses = JSON.parse(localStorage.getItem('guest_expenses') || '[]');
                const updatedExpenses = guestExpenses.filter(item => item._id !== id);
                localStorage.setItem('guest_expenses', JSON.stringify(updatedExpenses));
                return id;
            }
            await api.delete(`/expenses/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to delete' });
        }
    }
);

export const updateExpense = createAsyncThunk(
    'expenses/updateExpense',
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const guestExpenses = JSON.parse(localStorage.getItem('guest_expenses') || '[]');
                let updatedExpense = null;
                const updatedExpenses = guestExpenses.map(item => {
                    if (item._id === id) {
                        updatedExpense = { ...item, ...data };
                        return updatedExpense;
                    }
                    return item;
                });
                localStorage.setItem('guest_expenses', JSON.stringify(updatedExpenses));
                return updatedExpense;
            }

            const res = await api.put(`/expenses/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to update' });
        }
    }
);

export const fetchExpenseStats = createAsyncThunk(
    'expenses/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/expenses/stats');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to fetch stats' });
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    stats: null,
    statsLoading: false,
    error: null,
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchExpenseStats.pending, (state) => {
                state.statsLoading = true;
            })
            .addCase(fetchExpenseStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchExpenseStats.rejected, (state, action) => {
                state.statsLoading = false;

            })

            .addCase(addExpense.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })

            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default expenseSlice.reducer;

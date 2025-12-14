import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchBudgets = createAsyncThunk(
    'budgets/fetchBudgets',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                return JSON.parse(localStorage.getItem('guest_budgets') || '[]');
            }
            const res = await api.get('/budgets');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to fetch' });
        }
    }
);

export const addBudget = createAsyncThunk(
    'budgets/addBudget',
    async (budgetData, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const newBudget = {
                    ...budgetData,
                    _id: Date.now().toString(),
                    createdAt: new Date().toISOString()
                };
                const current = JSON.parse(localStorage.getItem('guest_budgets') || '[]');
                localStorage.setItem('guest_budgets', JSON.stringify([...current, newBudget]));
                return newBudget;
            }
            const res = await api.post('/budgets', budgetData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to add' });
        }
    }
);

export const updateBudget = createAsyncThunk(
    'budgets/updateBudget',
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const current = JSON.parse(localStorage.getItem('guest_budgets') || '[]');
                const updated = current.map(b => b._id === id ? { ...b, ...data } : b);
                localStorage.setItem('guest_budgets', JSON.stringify(updated));
                return { _id: id, ...data }; // Simplification
            }
            const res = await api.put(`/budgets/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to update' });
        }
    }
);

export const deleteBudget = createAsyncThunk(
    'budgets/deleteBudget',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const current = JSON.parse(localStorage.getItem('guest_budgets') || '[]');
                const updated = current.filter(b => b._id !== id);
                localStorage.setItem('guest_budgets', JSON.stringify(updated));
                return id;
            }
            await api.delete(`/budgets/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to delete' });
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const budgetSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchBudgets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addBudget.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updateBudget.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    },
});

export default budgetSlice.reducer;

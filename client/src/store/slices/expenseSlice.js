import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/expenses');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addExpense = createAsyncThunk(
    'expenses/addExpense',
    async (expenseData, { rejectWithValue }) => {
        try {
            const res = await api.post('/expenses', expenseData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/expenses/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
};

const expenseSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
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
            // Add
            .addCase(addExpense.fulfilled, (state, action) => {
                state.items.unshift(action.payload); // Add to top
            })
            // Delete
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    },
});

export default expenseSlice.reducer;

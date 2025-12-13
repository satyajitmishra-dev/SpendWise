import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchLoans = createAsyncThunk(
    'loans/fetchLoans',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/loans');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addLoan = createAsyncThunk(
    'loans/addLoan',
    async (loanData, { rejectWithValue }) => {
        try {
            const res = await api.post('/loans', loanData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateLoan = createAsyncThunk(
    'loans/updateLoan',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/loans/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const initialState = {
    items: [],
    loading: true,
    error: null,
};

const loanSlice = createSlice({
    name: 'loans',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Loans
            .addCase(fetchLoans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLoans.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchLoans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Loan
            .addCase(addLoan.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            // Update Loan
            .addCase(updateLoan.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default loanSlice.reducer;

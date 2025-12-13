import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAccounts = createAsyncThunk(
    'accounts/fetchAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/accounts');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addAccount = createAsyncThunk(
    'accounts/addAccount',
    async (accountData, { rejectWithValue }) => {
        try {
            const res = await api.post('/accounts', accountData);
            return res.data;
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

const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addAccount.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default accountSlice.reducer;

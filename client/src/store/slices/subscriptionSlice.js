import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSubscriptions = createAsyncThunk(
    'subscriptions/fetchSubscriptions',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/subscriptions');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addSubscription = createAsyncThunk(
    'subscriptions/addSubscription',
    async (subData, { rejectWithValue }) => {
        try {
            const res = await api.post('/subscriptions', subData);
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

const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addSubscription.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default subscriptionSlice.reducer;

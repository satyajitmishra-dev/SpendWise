import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAccounts = createAsyncThunk(
    'accounts/fetchAccounts',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const guestAccounts = JSON.parse(localStorage.getItem('guest_accounts') || '[]');
                return guestAccounts;
            }

            const res = await api.get('/accounts');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const addAccount = createAsyncThunk(
    'accounts/addAccount',
    async (accountData, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const newAccount = {
                    ...accountData,
                    _id: Date.now().toString(),
                    createdAt: new Date().toISOString()
                };
                const guestAccounts = JSON.parse(localStorage.getItem('guest_accounts') || '[]');
                const updatedAccounts = [...guestAccounts, newAccount];
                localStorage.setItem('guest_accounts', JSON.stringify(updatedAccounts));

                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 500));
                return newAccount;
            }

            const res = await api.post('/accounts', accountData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateAccountBalance = createAsyncThunk(
    'accounts/updateBalance',
    async ({ accountId, amount }, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const guestAccounts = JSON.parse(localStorage.getItem('guest_accounts') || '[]');
                const updatedAccounts = guestAccounts.map(acc => {
                    if (acc._id === accountId) {
                        return { ...acc, balance: parseFloat(acc.balance) + parseFloat(amount) };
                    }
                    return acc;
                });
                localStorage.setItem('guest_accounts', JSON.stringify(updatedAccounts));
                return { accountId, amount };
            }

            return { accountId, amount };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteAccount = createAsyncThunk(
    'accounts/deleteAccount',
    async (id, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const guestAccounts = JSON.parse(localStorage.getItem('guest_accounts') || '[]');
                const updatedAccounts = guestAccounts.filter(acc => acc._id !== id);
                localStorage.setItem('guest_accounts', JSON.stringify(updatedAccounts));
                return id;
            }

            await api.delete(`/accounts/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to delete' });
        }
    }
);

export const updateAccount = createAsyncThunk(
    'accounts/updateAccount',
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            const { user } = getState().auth;
            const token = localStorage.getItem('token');
            const isGuest = !token || (user && !user.email);

            if (isGuest) {
                const guestAccounts = JSON.parse(localStorage.getItem('guest_accounts') || '[]');
                let updatedAccount = null;
                const updatedAccounts = guestAccounts.map(acc => {
                    if (acc._id === id) {
                        updatedAccount = { ...acc, ...data };
                        return updatedAccount;
                    }
                    return acc;
                });
                localStorage.setItem('guest_accounts', JSON.stringify(updatedAccounts));
                return updatedAccount;
            }

            const res = await api.put(`/accounts/${id}`, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { msg: 'Failed to update' });
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
            })
            .addCase(updateAccountBalance.fulfilled, (state, action) => {
                const { accountId, amount } = action.payload;
                state.items = state.items.map(acc => {
                    if (acc._id === accountId) {
                        return { ...acc, balance: acc.balance + amount };
                    }
                    return acc;
                });
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            })
            .addCase(updateAccount.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default accountSlice.reducer;

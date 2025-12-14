import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks

// Guest Login
export const loginAsGuest = createAsyncThunk('auth/loginAsGuest', async (guestData, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/init', guestData);
        localStorage.setItem('token', res.data.token);
        return res.data; // { token, user }
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Signup Init
export const signupInit = createAsyncThunk('auth/signupInit', async (userData, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/signup-init', userData);
        return res.data; // { msg: 'OTP sent' }
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Login OTP Send
export const loginSendOtp = createAsyncThunk('auth/loginSendOtp', async (email, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/login-otp', { email });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Verify OTP (Works for both)
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('token', res.data.token);
        return res.data; // { token, user }
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});



// Connect Guest Data to Account
export const syncGuestData = createAsyncThunk('auth/syncGuestData', async (_, { getState, dispatch, rejectWithValue }) => {
    try {
        const state = getState();
        const expenses = JSON.parse(localStorage.getItem('guest_expenses') || '[]');

        // Sync Expenses
        if (expenses.length > 0) {
            await api.post('/expenses/sync', { expenses });
        }

        // Sync Settings (Budget, Currency) - if guest had set them
        // Note: For now, we assume profile update happened separately or we do it here
        const guestUser = JSON.parse(localStorage.getItem('guestUser') || '{}');
        if (guestUser.budget || guestUser.currency) {
            const { user } = state.auth;
            if (user) {
                await api.post('/auth/update-profile', {
                    userId: user.id || user._id,
                    budget: guestUser.budget || user.budget,
                    currency: guestUser.currency || user.currency
                });
            }
        }

        // Clear Local Guest Data
        localStorage.removeItem('guest_expenses');
        localStorage.removeItem('guestUser');
        // Do NOT remove token yet, we are logged in

        return { success: true };
    } catch (err) {
        console.error("Sync Failed", err);
        return rejectWithValue(err.response?.data || 'Sync Failed');
    }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/auth/me');
        return res.data;
    } catch (err) {
        localStorage.removeItem('token');
        return rejectWithValue(err.response.data);
    }
});

const initialState = {
    user: null,
    loading: true, // Start true to check auth status
    error: null,
    otpSent: false,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Load User
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })

            // Login Send OTP
            .addCase(loginSendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginSendOtp.fulfilled, (state) => {
                state.otpSent = true;
                state.error = null;
                state.loading = false;
            })
            .addCase(loginSendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.msg || 'Failed to send OTP';
            })

            // Signup Init
            .addCase(signupInit.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupInit.fulfilled, (state) => {
                state.otpSent = true;
                state.error = null;
                state.loading = false;
            })
            .addCase(signupInit.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.msg || 'Failed to send OTP';
            })

            // Guest Login
            .addCase(loginAsGuest.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginAsGuest.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(loginAsGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error || 'Guest login failed';
            })

            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.otpSent = false;
                state.error = null;
                state.loading = false;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.msg || 'Verification failed';
            });
    },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;

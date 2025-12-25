import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'sonner';


export const loginAsGuest = createAsyncThunk('auth/loginAsGuest', async (guestData, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/init', guestData);
        localStorage.setItem('token', res.data.token);
        if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


export const signupInit = createAsyncThunk('auth/signupInit', async (userData, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/signup-init', userData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


export const loginSendOtp = createAsyncThunk('auth/loginSendOtp', async (email, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/login-otp', { email });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/verify-otp', { email, otp });
        localStorage.setItem('token', res.data.token);
        if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const setPasscode = createAsyncThunk('auth/setPasscode', async (passcode, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/passcode/set', { passcode });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const verifyPasscode = createAsyncThunk('auth/verifyPasscode', async (passcode, { rejectWithValue }) => {
    try {
        const response = await api.post('/auth/passcode/verify', { passcode });
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const disablePasscode = createAsyncThunk('auth/disablePasscode', async (_, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/passcode/disable');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const forgotPasscode = createAsyncThunk('auth/forgotPasscode', async (_, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/passcode/forgot');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const resetPasscode = createAsyncThunk('auth/resetPasscode', async (otp, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/passcode/reset', { otp });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const resetDataInit = createAsyncThunk('auth/resetDataInit', async (_, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/reset-data/init');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const resetDataConfirm = createAsyncThunk('auth/resetDataConfirm', async (otp, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/reset-data/confirm', { otp });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});


export const syncGuestData = createAsyncThunk('auth/syncGuestData', async (_, { getState, dispatch, rejectWithValue }) => {
    try {
        const state = getState();
        const expenses = JSON.parse(localStorage.getItem('guest_expenses') || '[]');


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
    otpSent: false,
    isAuthenticated: false,
    isAppLocked: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.isAppLocked = false;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
        lockApp: (state) => {
            if (state.isAuthenticated && state.user?.isPasscodeEnabled === true) {
                state.isAppLocked = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(loadUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.isAppLocked = action.payload.isPasscodeEnabled === true;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.isAppLocked = false;
            })


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
                // Enforce lock immediately if passcode is enabled
                // Enforce lock immediately if passcode is enabled
                state.isAppLocked = action.payload.user?.isPasscodeEnabled === true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.msg || 'Verification failed';
            })
            // Passcode Thunks
            .addCase(setPasscode.fulfilled, (state) => {
                if (state.user) state.user.isPasscodeEnabled = true;
            })
            .addCase(disablePasscode.fulfilled, (state) => {
                if (state.user) state.user.isPasscodeEnabled = false;
                state.isAppLocked = false;
            })
            .addCase(verifyPasscode.fulfilled, (state) => {
                state.isAppLocked = false;
            })
            .addCase(setPasscode.rejected, (state, action) => {
                let msg = action.payload?.msg || 'Failed to set passcode';
                if (typeof msg === 'string' && msg.includes('<')) msg = 'Server Error: Invalid Response';
                toast.error(msg);
            }) // Added error handling for setPasscode
            .addCase(verifyPasscode.rejected, (state, action) => {
                state.isAppLocked = true; // Keep locked?
                // Error handled in component usually
            })
            // Passcode Reset
            .addCase(resetPasscode.fulfilled, (state) => {
                if (state.user) {
                    state.user.isPasscodeEnabled = false;
                }
                state.isAppLocked = false;
                toast.success('App Lock Disabled Successfully');
            })
            .addCase(resetPasscode.rejected, (state, action) => {
                toast.error(action.payload?.msg || "Failed to reset passcode");
            })
            .addCase(forgotPasscode.fulfilled, () => {
                toast.success("OTP Sent to email");
            })
            .addCase(forgotPasscode.rejected, (state, action) => {
                toast.error(action.payload?.msg || "Failed to send OTP");
            })
            // Reset Data
            .addCase(resetDataInit.fulfilled, () => {
                toast.success("Verification code sent to email");
            })
            .addCase(resetDataInit.rejected, (state, action) => {
                toast.error(action.payload?.msg || "Failed to send verification code");
            })
            .addCase(resetDataConfirm.fulfilled, () => {
                toast.success("All account data has been reset");
                // Optionally trigger a reload or allow component to handle redirect
            })
            .addCase(resetDataConfirm.rejected, (state, action) => {
                toast.error(action.payload?.msg || "Failed to reset data");
            });
    },
});

export const { logout, clearError, updateUser, lockApp } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRemoteConfig, getVersionConfig, getFeatureConfig } from '../../services/remoteConfig';
import packageJson from '../../../package.json';

// Async thunk to initialize app configuration from remote
export const initAppConfig = createAsyncThunk(
    'app/initAppConfig',
    async (_, { rejectWithValue }) => {
        try {
            await fetchRemoteConfig();

            const versionConfig = getVersionConfig();
            const featureConfig = getFeatureConfig();

            return {
                version: versionConfig.latestVersion || packageJson.version, // Use remote version if available
                featureBanner: {
                    show: featureConfig.showBanner,
                    text: featureConfig.bannerText,
                    link: featureConfig.bannerLink,
                    detailTitle: featureConfig.detailTitle,
                    detailDesc: featureConfig.detailDesc,
                    detailImage: featureConfig.detailImage
                }
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    version: packageJson.version, // Start with local package.json version
    featureBanner: {
        show: false,
        text: '',
        link: '',
        detailTitle: '',
        detailDesc: '',
        detailImage: ''
    },
    loading: false,
    error: null
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // Manual override if needed
        setVersion: (state, action) => {
            state.version = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initAppConfig.pending, (state) => {
                state.loading = true;
            })
            .addCase(initAppConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.version = action.payload.version;
                state.featureBanner = action.payload.featureBanner;
            })
            .addCase(initAppConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setVersion } = appSlice.actions;
export default appSlice.reducer;

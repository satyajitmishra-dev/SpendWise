import { fetchAndActivate, getValue } from "firebase/remote-config";
import { remoteConfig } from "../firebase";

export const fetchRemoteConfig = async () => {
    try {
        await fetchAndActivate(remoteConfig);
    } catch (err) {
        console.error("Failed to fetch remote config", err);
    }
};

export const getFeatureConfig = () => {
    return {
        showBanner: getValue(remoteConfig, "show_feature_banner").asBoolean(),
        bannerText: getValue(remoteConfig, "feature_banner_text").asString(),
        bannerLink: getValue(remoteConfig, "feature_banner_link").asString(),
        // Detail Page Config
        detailTitle: getValue(remoteConfig, "feature_detail_title").asString(),
        detailDesc: getValue(remoteConfig, "feature_detail_desc").asString(),
        detailImage: getValue(remoteConfig, "feature_detail_image").asString(),
    };
};

export const getVersionConfig = () => {
    return {
        latestVersion: getValue(remoteConfig, "latest_version").asString() || "3.0.0",
        minRequiredVersion: getValue(remoteConfig, "min_required_version").asString() || "1.0.0",
    };
};

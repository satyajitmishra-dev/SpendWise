import { fetchAndActivate, getValue } from "firebase/remote-config";
import { remoteConfig } from "../firebase";

export const fetchRemoteConfig = async () => {
    try {
        await fetchAndActivate(remoteConfig);
    } catch (err) {
        console.error("Failed to fetch remote config:", err);
        throw err;
    }
};

export const getFeatureConfig = () => {
    return {
        showBanner: getValue(remoteConfig, "show_feature_banner").asBoolean(),
        bannerText: getValue(remoteConfig, "feature_banner_text").asString(),
        bannerLink: getValue(remoteConfig, "feature_banner_link").asString(),
        detailTitle: getValue(remoteConfig, "feature_detail_title").asString(),
        detailDesc: getValue(remoteConfig, "feature_detail_desc").asString(),
        detailImage: getValue(remoteConfig, "feature_detail_image").asString(),
    };
};

export const getVersionConfig = () => {
    const latestVersionValue = getValue(remoteConfig, "latest_version");
    const minVersionValue = getValue(remoteConfig, "min_required_version");

    return {
        latestVersion: latestVersionValue.asString() || "3.0.0",
        minRequiredVersion: minVersionValue.asString() || "1.0.0",
    };
};

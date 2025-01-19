import {getItemDecrypted} from "./storage";
import config from "../config";
import CryptoJS from "crypto-js";

export const getConfig = () => {
    const setting = getItemDecrypted(config.settingStoreKey);
    if (setting) {
        return { ...config, ...setting };
    }

    return config;
};

export const decode2json = str => {
    str = str.substring(16); // trim the first 16 chars
    const value = atob(str); // base64decode
    return JSON.parse(value);
};

export const CryptoJsAesEncrypt = data => {
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        process.env.REACT_APP_SECRET
    );

    return encrypted.toString();
};

export const CryptoJsAesDecrypt = data => {
    const bytes = CryptoJS.AES.decrypt(data, process.env.REACT_APP_SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const checkRedeem = user => {
    const redeem = decode2json(user.status);

    if (redeem.id) {
        return true;
    }

    return !redeem.expired;
};

export const uniqueId = () => "id" + Math.random().toString(16).slice(2);

export const isJsonString = str => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
};

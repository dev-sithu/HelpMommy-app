import {CryptoJsAesDecrypt, CryptoJsAesEncrypt, decode2json, isJsonString} from "./common";

export const storeItem = (key, value) => {
    if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.setItem(key, value);
    }
};

export const getItem = key => {
    const value = localStorage.getItem(key);

    if (value) {
        return isJsonString(value) ? JSON.parse(value) : value;
    }

    return null;
};

export const removeItem = key => {
    localStorage.removeItem(key);
};

export const storeItemEncrypted = (key, value) => {
    if (typeof value === "string") {
        value = decode2json(value);
    }

    value = CryptoJsAesEncrypt(value);
    localStorage.setItem(key, value);
};

export const getItemDecrypted = key => {
    const value = localStorage.getItem(key);

    return value ? CryptoJsAesDecrypt(value) : null;
};

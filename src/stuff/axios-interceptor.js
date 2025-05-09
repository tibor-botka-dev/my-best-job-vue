import Vue from "vue";
import axios from "axios";
import store from "../store/index";
import { apiHost } from "../vue.config";
import tokenService from "../services/token-service";
import authenticationService from "../services/authentication-service";

const axiosApiInstance = axios.create({ baseURL: apiHost, timeout: 3 * 60 * 1000 });

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(async config => {
    const accessToken = store.getters.getAccessToken;
    const language = store.getters.getLanguage;
    if (accessToken) {
        config.headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    }

    if (language)
        config.headers['Accept-Language'] = language;

    config.headers['Access-Control-Allow-Origin'] = "*";

    config.adapter.push('https');

    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(async response => {
    var isTokenActive = await tokenService.isTokenActive();
    var isTokenRefreshed = await tokenService.refreshToken();

    // Setup "token-expired" header in 'Startup.cs'-> OnAuthenticationFailed event
    if ((!isTokenActive && response.headers["token-expired"] === "true" && isTokenRefreshed)
        || response.status.toString().startsWith("20"))
        return response;

    return Promise.reject(response);
}, async error => {
    debugger;
    var isTokenRefreshed = await tokenService.refreshToken();
    if (error.response?.headers["token-expired"] && isTokenRefreshed) {
        const accessToken = store.getters.getAccessToken;
        const language = store.getters.getLanguage;
        error.config.headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json; charset=utf-8',
            'Accept-Language': language
        }

        return axiosApiInstance(error.config);
    }

    if (error.response?.status.toString().startsWith("40"))
        return Promise.reject(error);

    if (error.code === "ERR_NETWORK")
        return authenticationService.redirectUnavailable();

    return authenticationService.redirectSignIn();
});

// Request/Response interceptor handles all '$http' API calls
Vue.prototype.$http = axiosApiInstance;

export default axiosApiInstance;
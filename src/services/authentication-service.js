import store from "../store/index";
import router from "../router/index";
import { sendRequest } from "./base-service";

const authenticationService = {
    async signIn(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.signInUrl,
            data
        );

        if (response.isSuccessStatusCode) {
            store.commit("saveTokenData", response.data?.tokens);
            store.commit("updateTokenExpiration");
            store.commit("setAvatar", response.data?.avatar);
        }

        return response;
    },
    async signUp(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.signUpUrl,
            data
        );

        return response;
    },
    async confirmAccount(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.confirmAccountUrl,
            data
        );

        return response;
    },
    async forgotPassword(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.forgotPasswordUrl,
            data
        );

        return response;
    },
    async resetPassword(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.resetPasswordUrl,
            data
        );

        return response;
    },
    async changePassword(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.changePasswordUrl,
            data
        );

        return response;
    },
    async signOut() {
        var accessToken = store.getters.getAccessToken;

        const response = await sendRequest(
            "post",
            store.state.urls.signOutUrl,
            { accessToken: accessToken }
        );

        if (response.isSuccessStatusCode)
            store.commit("deleteTokenData");

        return response;
    },
    redirectSignIn() {
        store.commit("deleteTokenData");
        if (router.currentRoute.name != "sign-in")
            router.push({ name: "sign-in" })
                .catch(x => {
                    console.log(x);
                });
    },
    redirectUnavailable() {
        store.commit("deleteTokenData");
        if (router.currentRoute.name != "unavailable")
            router.push({ name: "unavailable" })
                .catch(x => {
                    console.log(x);
                });
    },
};

export default authenticationService;
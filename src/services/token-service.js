import axios from "axios";
import store from "../store/index";
import { apiHost } from "../vue.config";

const tokenService = {
    async isTokenActive() {
        if (!store.getters.getAccessToken || !store.getters.getRefreshToken)
            return false;

        var accessTokenExpires = store.state.authentication.accessTokenExpires;
        if (!accessTokenExpires) {
            store.commit("updateTokenExpiration");
            accessTokenExpires = store.state.authentication.accessTokenExpires;
        }

        var nowDate = parseInt(Date.now() / 1000);

        if (nowDate >= accessTokenExpires) {
            var refreshTokenResponse = await this.refreshToken();
            return refreshTokenResponse;
        }

        let result = nowDate < accessTokenExpires;
        return result;
    },
    async refreshToken() {
        let success = false;

        var accessToken = store.getters.getAccessToken;
        var refreshToken = store.getters.getRefreshToken;

        if (!accessToken || !refreshToken)
            return false;

        await axios
            .get(apiHost + "api/auth/refresh-token", { params: { accessToken: accessToken, refreshToken: refreshToken } })
            .then((response) => {
                if (response?.data) {
                    store.commit("saveTokenData", response.data);
                    store.commit("updateTokenExpiration");

                    return !success;
                }

                store.commit("deleteTokenData");
                return success;
            })
            .catch((e) => {
                store.commit("deleteTokenData");
                console.log(e);
                return success;
            });
    },
};

export default tokenService;
import axiosApiInstance from "../stuff/axios-interceptor";
import store from "../store/index";
import authenticationService from "./authentication-service";

const initService = {
    async initApp() {
        const response = await axiosApiInstance
            .get("api/init");

        if (response?.status?.toString().startsWith("20"))
            store.commit("setInit", response.data);

        return response;
    },
    async beforeLoadInitApp() {
        const response = await axiosApiInstance
            .get("api/init/before-load-init");

        if (response?.status?.toString().startsWith("20"))
            store.commit("setBeforeLoadInit", response.data);
        else
            authenticationService.redirectUnavailable();

        return response;
    }
};

export default initService;
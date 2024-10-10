import store from "../store/index";
import { sendRequest } from "./base-service";

const userService = {
    async getUsers() {
        const response = await sendRequest(
            "get",
            store.state.urls.userUrl
        );

        return response;
    },
    async createUser(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.userUrl,
            data
        );

        return response;
    },
    async editUser(data) {
        const response = await sendRequest(
            "put",
            store.state.urls.userUrl,
            data
        );

        return response;
    },
    async deleteUser(id) {
        const response = await sendRequest(
            "delete",
            store.state.urls.userUrl,
            {
                id
            }
        );

        return response;
    },
};

export default userService;

import store from "../store/index";
import { sendRequest } from "./base-service";

const profileService = {
  async getProfile() {
    const response = await sendRequest(
      "get",
      store.state.urls.getUserUrl
    );

    return response;
  },
  async updateProfile(data) {
    const response = await sendRequest(
      "put",
      store.state.urls.userUrl,
      data
    );

    return response;
  },
  async getAvatar() {
    const response = await sendRequest(
      "get",
      store.state.urls.getUserAvatarUrl
    );

    return response;
  },
};

export default profileService;
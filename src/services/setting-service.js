import store from "../store/index";
import { sendRequest } from "./base-service";

const settingService = {
    async getMailSetting() {
        const response = await sendRequest(
            "get",
            store.state.urls.getMailSettingUrl
        );

        return response;
    },
    async getEmailTemplates() {
        const response = await sendRequest(
            "get",
            store.state.urls.getEmailTemplatesUrl
        );

        return response;
    },
    async updateIdleSetting(data) {
        const response = await sendRequest(
            "put",
            store.state.urls.updateIdleSettingUrl,
            data
        );

        return response;
    },
    async updateMailSetting(data) {
        const response = await sendRequest(
            "put",
            store.state.urls.updateMailSettingUrl,
            data
        );

        return response;
    },
    async updateEmailTemplate(emailTemplateType, data) {
        const response = await sendRequest(
            "patch",
            store.state.urls.updateEmailTemplateUrl,
            data,
            {
                emailTemplateType
            }
        );

        return response;
    },
    async createEmailTemplateValue(data) {
        const response = await sendRequest(
            "post",
            store.state.urls.createEmailTemplateValueUrl,
            data
        );

        return response;
    },
    async updateEmailTemplateValue(key, data) {
        const response = await sendRequest(
            "put",
            store.state.urls.updateEmailTemplateValueUrl,
            data,
            {
                key
            }
        );

        return response;
    },
    async deleteEmailTemplateValue(key) {
        const response = await sendRequest(
            "delete",
            store.state.urls.deleteEmailTemplateValueUrl,
            {
                key
            }
        );

        return response;
    },
};

export default settingService;

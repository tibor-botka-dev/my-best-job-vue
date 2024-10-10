import Vue from "vue";

export async function sendRequest(method, url, data, params) {
    const response = {
        data: null,
        statusCode: null,
        isSuccessStatusCode: null
    };

    if (!method || !url)
        return response;

    let request = {};
    switch (method) {
        case "get":
        case "delete":
            request = {
                method: method,
                url: url,
                params: data
            };
            break;
        case "put":
        case "post":
        case "patch":
            request = {
                method: method,
                url: url,
                data: data,
                params: params
            };
            break;
        default:
            return response;
    }

    return await Vue.prototype
        .$http(request)
        .then((result) => {
            response.statusCode = result?.status;
            response.data = result?.data;
            response.isSuccessStatusCode = true;

            return response;
        })
        .catch((error) => {
            response.data = error?.response?.data;
            response.statusCode = error?.response?.status;
            response.isSuccessStatusCode = false;

            return response;
        });
}
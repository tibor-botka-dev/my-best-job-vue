let host = null;
if (process.env.NODE_ENV === "production")
    host = "https://my-best-job-api.azurewebsites.net/"
else
    host = "https://localhost:7183/"

export const apiHost = host;
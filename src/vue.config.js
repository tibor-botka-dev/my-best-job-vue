let host = null;
if (process.env.NODE_ENV === "production")
    host = "https://mybestjobapi.azurewebsites.net/"
else
    host = "https://localhost:7183/"

export const apiHost = host;
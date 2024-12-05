export enum HTTPMethod {
    GET = "GET",
    HEAD = "HEAD",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH"
}

const fetchInterceptor = (method: HTTPMethod) => (url: string, body: JSON) => new Promise((resolve, reject) => window.fetch(url, {
    method,
    headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token") as string
    },
    body: JSON.stringify(body)
})
    .then(async (response: Response) => {
        let data;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (!response.ok && data.message === "Internal server error") data.message = "Something went wrong.";

        if (!response.ok) reject({ ok: response.ok, status: response.status, data });
        else resolve({ ok: response.ok, status: response.status, data });
    })
    .catch((error) => reject(error)));

const fetchUploadInterceptor = (method: HTTPMethod) => (url: string, body: FormData) => new Promise((resolve, reject) => window.fetch(url, {
    method,
    headers: {
        Authorization: localStorage.getItem("token") as string
    },
    body
})
    .then(async (response: Response) => {
        let data;

        try {
            data = await response.json();
        } catch {
            data = null;
        }

        if (!response.ok && data.message === "Internal server error") data.message = "Something went wrong.";

        if (!response.ok) reject({ ok: response.ok, status: response.status, data });
        else resolve({ ok: response.ok, status: response.status, data });
    })
    .catch((error) => reject(error)));

window.fetch2 = {
    get: fetchInterceptor(HTTPMethod.GET),
    head: fetchInterceptor(HTTPMethod.HEAD),
    post: fetchInterceptor(HTTPMethod.POST),
    put: fetchInterceptor(HTTPMethod.PUT),
    delete: fetchInterceptor(HTTPMethod.DELETE),
    patch: fetchInterceptor(HTTPMethod.PATCH),

    upload: fetchUploadInterceptor(HTTPMethod.POST)
} as any;

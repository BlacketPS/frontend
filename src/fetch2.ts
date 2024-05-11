/* eslint-disable no-var */

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
        try {
            var data = await response.json();
        } catch {
            var data = null;
        }

        if (!response.ok) reject({ ok: false, status: response.status, data });
        else resolve({ ok: true, status: response.status, data });
    })
    .catch((error) => reject(error)));

window.fetch2 = {
    get: fetchInterceptor(HTTPMethod.GET),
    head: fetchInterceptor(HTTPMethod.HEAD),
    post: fetchInterceptor(HTTPMethod.POST),
    put: fetchInterceptor(HTTPMethod.PUT),
    delete: fetchInterceptor(HTTPMethod.DELETE),
    patch: fetchInterceptor(HTTPMethod.PATCH)
} as any;

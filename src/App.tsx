import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import StoreWrapper from "./stores/index";
import * as routes from "./views/index.routes";
import useCreateRoute from "./useCreateRoute";
import Error from "./views/Error";

import "./all.scss";

const router = createBrowserRouter([{
    id: "app",
    errorElement: <Error code={0} />,
    element: <StoreWrapper>
        <Outlet />
    </StoreWrapper>,
    children: Object.values(routes).map((route: BlacketRoute) => useCreateRoute(route))
}]);

export default function App() {
    window.constructCDNUrl = (path: string) => `${import.meta.env.VITE_CDN_URL}${path}`;

    return <RouterProvider router={router} />;
}

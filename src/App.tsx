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
    children: Object.values(routes).map((route) => useCreateRoute(route as BlacketRoute))
}]);

export default function App() {
    return <RouterProvider router={router} />;
}

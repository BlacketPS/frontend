import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import * as routes from "./views/index.routes";
import Wrapper from "./Wrapper";
import useCreateRoute from "./useCreateRoute";
import Error from "./views/Error";

import { Development } from "@components/index";

import "./all.scss";

const router = createBrowserRouter([{
    id: "app",
    errorElement: <Error code={0} />,
    element: <Wrapper>
        <Development.Information />

        <Outlet />
    </Wrapper>,
    children: Object.values(routes).map((route: BlacketRoute) => useCreateRoute(route))
}]);

export default function App() {
    return <RouterProvider router={router} />;
}

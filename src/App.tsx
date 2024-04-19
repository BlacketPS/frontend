import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import StoreWrapper from "./stores/index";

import { Background } from "@components/index";

import "./all.scss";

const router = createBrowserRouter([{
    id: "app",
    errorElement: <h1 className="somethingWentWrong">Something went wrong</h1>,
    element: <StoreWrapper>
        <Background />

        <Outlet />
    </StoreWrapper>,
    children: [
        { id: "home", path: "/", element: <></> }
    ]
}]);

export default function App() {
    return <RouterProvider router={router} />;
}

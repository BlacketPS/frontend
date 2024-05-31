import Error from "./index";

export default {
    path: "*",
    component: <Error code={404} />,
    header: {},
    dontUseBody: true
} as BlacketRoute;

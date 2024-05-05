import Error from "./index";

export default {
    name: "NotFound",
    path: "*",
    component: <Error code={404} />,
    header: {},
    dontUseBody: true
} as BlacketRoute;

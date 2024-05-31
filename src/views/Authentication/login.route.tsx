import Authentication from "./index";
import { AuthenticationType } from "./authentication.d";

export default {
    path: "/login",
    component: <Authentication type={AuthenticationType.LOGIN} />,
    header: { right: { text: "Register", link: "/register" } }
} as BlacketRoute;

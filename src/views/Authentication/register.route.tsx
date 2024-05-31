import Authentication from "./index";
import { AuthenticationType } from "./authentication.d";

export default {
    path: "/register",
    component: <Authentication type={AuthenticationType.REGISTER} />,
    header: { right: { text: "Login", link: "/login" } }
} as BlacketRoute;

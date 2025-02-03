import { PermissionTypeEnum } from "@blacket/types";
import { PanelRoute } from "../../staff";
import Groups from "./index";

export default {
    path: "/staff/groups",
    component: <Groups />,
    title: `Groups | ${import.meta.env.VITE_INFORMATION_NAME}`,
    description: "Manage groups and the users they are assigned to.",
    pageHeader: "Groups",
    icon: "fas fa-users",
    sidebar: true,
    topRight: [],
    restrictions: [PermissionTypeEnum.MANAGE_USER_GROUPS, PermissionTypeEnum.MANAGE_GROUPS] // Trial moderator+
} as PanelRoute;

import { Helmet } from "react-helmet-async";

import { Background, Header, HeaderBody, SidebarBody } from "@components/index";
import { HeaderProps } from "@components/Header/header.d";

export interface Route {
    name: string,
    path: string,
    component: JSX.Element,
    title: string,
    description: string,
    background: boolean,
    header: HeaderProps,
    sidebar: boolean
}

export default function useCreateRoute(route: Route) {
    if (!route.background) route.background = true;

    return {
        id: route.name,
        path: route.path,
        element: <>
            <Helmet>
                {route.title && <title>{route.title}</title>}
                {route.description && <meta name="description" content={route.description} />}
            </Helmet>

            {route.background && <Background />}

            {route.header && <Header {...route.header} />}

            {route.header ? <HeaderBody>{route.component}</HeaderBody> : route.sidebar ? <SidebarBody>{route.component}</SidebarBody> : route.component}
        </>
    };
}

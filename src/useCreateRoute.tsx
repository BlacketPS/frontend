import { Helmet } from "react-helmet-async";
import { Background, Header, HeaderBody, Sidebar, TopRight, SidebarBody, PageHeader } from "@components/index";

export default function useCreateRoute(route: BlacketRoute) {
    if (!route.background) route.background = true;

    return {
        id: route.path,
        path: route.path,
        element: <>
            <Helmet>
                {route.title && <title>{route.title}</title>}
                {route.description && <meta name="description" content={route.description} />}
            </Helmet>

            {route.background && <Background />}

            {route.header && <Header {...route.header} />}
            {route.sidebar && <Sidebar />}

            {route.topRight && <TopRight content={route.topRight} desktopOnly={route.topRightDesktopOnly} />}

            {route.header ? !route.dontUseBody ? <HeaderBody>
                {route.component}
            </HeaderBody> : route.component : route.sidebar ? !route.dontUseBody ? <SidebarBody pushOnMobile={!route.topRightDesktopOnly && (route.topRight && route.topRight.length > 0)}>
                {route.pageHeader && <PageHeader>{route.pageHeader}</PageHeader>}

                {route.component}
            </SidebarBody> : route.component : route.component}
        </>
    };
}

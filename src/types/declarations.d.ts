import { ComponentType } from "react";
import { Socket } from "socket.io-client";

import { HeaderProps } from "@components/Header/header.d";

declare global {
    interface BlacketRoute {
        name: string,
        path: string,
        component: JSX.Element,
        title: string,
        description: string,
        background: boolean,
        header: HeaderProps,
        sidebar: boolean,
        dontUseBody: boolean,
        pageHeader: string
    }

    interface Fetch2Response {
        ok: boolean;
        status: number;
        data: any;
    }

    interface Window {
        fetch2: {
            get: (url: string) => Promise<Fetch2Response>;
            head: (url: string) => Promise<Fetch2Response>;
            post: (url: string, body: object) => Promise<Fetch2Response>;
            put: (url: string, body: object) => Promise<Fetch2Response>;
            delete: (url: string, body: object) => Promise<Fetch2Response>;
            patch: (url: string, body: object) => Promise<Fetch2Response>;
        };

        socket: Socket;
    }
}

declare module "*.module.scss" {
    const content: { [className: string]: string };

    export default content;
}

declare module "@assets/*" {
    const content: string;

    export default content;
}

declare module "@components/*" {
    const content: ComponentType;

    export default content;
}

declare module "@controllers/*" {
    const content: ComponentType;

    export default content;
}

declare module "@functions/*" {
    const content: ComponentType;

    export default content;
}

declare module "@stores/*" {
    const content: ComponentType;

    export default content;
}

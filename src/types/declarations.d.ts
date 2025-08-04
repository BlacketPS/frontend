import { ComponentType } from "react";
import { Socket } from "socket.io-client";

import { HeaderProps } from "@components/Header/header.d";
import { TopRightContent } from "@components/TopRight/topRight.d";
import { PrivateUser } from "@blacket/types";

declare global {
    interface BlacketRoute {
        path: string,
        component: JSX.Element,
        title: string,
        description: string,
        background: boolean,
        header: HeaderProps,
        sidebar: boolean,
        topRight: string[TopRightContent],
        topRightDesktopOnly: boolean,
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

            upload: (url: string, body: FormData) => Promise<Fetch2Response>;
        };

        constants: {
            APPLE_DEVICE: boolean
            emojis: {
                [key: string]: string;
            }[];
        }

        constructCDNUrl: (path: string) => string;
        errorImage: string;

        // DEV ONLY VARIABLES
        socket: Socket;
        user?: PrivateUser;
    }
}

declare module "@blacket/types" {
    interface PrivateUser {
        hasPermission: (permission: PermissionType) => boolean;
        setTokens: (tokens: number) => number;
    }
}

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element:
        | { type: "mention"; user: PublicUser; children: CustomText[] }
        | { type: "paragraph"; children: CustomText[] }

        Text: {
            text: string;
            bold?: boolean;
            italic?: boolean;
            underlined?: boolean;
            strikethrough?: boolean;
            code?: boolean;
            link?: boolean;
            mention?: boolean;
            color?: boolean;
            hexcode?: string;
            content?: string;
        };
    }
}

declare module "*.module.scss" {
    const content: { [className: string]: string };

    export default content;
}

declare module "@brender/*" {
    const content: ComponentType;

    export default content;
}

declare module "@components/*" {
    const content: ComponentType;

    export default content;
}

declare module "@constants/*" {
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

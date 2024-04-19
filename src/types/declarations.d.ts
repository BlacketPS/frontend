import { ComponentType } from "react";
import { Socket } from "socket.io-client";

declare global {
    interface Window {
        fetch2: {
            get: (url: string) => Promise<any>;
            head: (url: string) => Promise<any>;
            post: (url: string, body: JSON) => Promise<any>;
            put: (url: string, body: JSON) => Promise<any>;
            delete: (url: string, body: JSON) => Promise<any>;
            connect: (url: string, body: JSON) => Promise<any>;
            options: (url: string, body: JSON) => Promise<any>;
            trace: (url: string, body: JSON) => Promise<any>;
            patch: (url: string, body: JSON) => Promise<any>;
        }

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

declare module "@stores/*" {
    const content: ComponentType;

    export default content;
}

declare module "@styles/*" {
    const content: { [className: string]: string };

    export default content;
}

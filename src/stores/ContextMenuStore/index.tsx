import { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { Container, Divider, Item } from "./components/index";

import { type ContextMenuContext, ContextMenu } from "./contextMenu.d";

const ContextMenuContext = createContext<ContextMenuContext>({
    contextMenu: null,
    setContextMenu: () => { },
    openContextMenu: () => { },
    closeContextMenu: () => { }
});

export function useContextMenu() {
    return useContext(ContextMenuContext);
}

export function ContextMenuStoreProvider({ children }: { children: ReactNode }) {
    // const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number; }>({ x: 0, y: 0 });
    const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

    // visible so the contextmenu doesn't flicker on initial render
    const [visible, setVisible] = useState<boolean>(false);

    // const cursorPosition = useRef<{ x: number; y: number; }>({ x: 0, y: 0 });
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const openContextMenu = async (items: ContextMenu["items"]) => {
        if (window.innerWidth <= 768) {
            setVisible(true);

            return setContextMenu({ items });
        }


        // setContextMenu({ items, x: cursorPosition.x, y: cursorPosition.y });
        const cursorPosition = { x: 0, y: 0 };


        while (!contextMenuRef.current) await new Promise((resolve) => setTimeout(resolve, 0));

        const contextMenuRect = contextMenuRef.current.getBoundingClientRect();

        const { innerWidth, innerHeight } = window;
        const { width, height } = contextMenuRect;

        const x = Math.min(cursorPosition.x, innerWidth - width);
        const y = Math.min(cursorPosition.y, innerHeight - height);

        setContextMenu({ items, x, y });

        if (!visible) setVisible(true);
    };

    const closeContextMenu = () => {
        setVisible(false);

        setContextMenu(null);
    };

    useEffect(() => {
        // window.addEventListener("mousemove", (e) => setCursorPosition({ x: e.clientX, y: e.clientY }));
        const handleClickOutside = (e: MouseEvent) => (contextMenuRef.current && contextMenuRef.current.contains(e.target as Node) || e.button === 0 && closeContextMenu());

        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            // window.removeEventListener("mousemove", (e) => setCursorPosition({ x: e.clientX, y: e.clientY }));
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <ContextMenuContext.Provider value={{ contextMenu, setContextMenu, openContextMenu, closeContextMenu }}>
            {contextMenu && <Container ref={contextMenuRef} visible={visible} top={contextMenu.y} left={contextMenu.x}>
                {contextMenu.items.map((item, index) => item?.divider ? <Divider key={index} /> : item && <Item key={index} icon={item.icon} image={item.image} color={item.color} onClick={() => {
                    if (item.onClick) item.onClick();

                    closeContextMenu();
                }}>{item.label}</Item>)}
            </Container>}

            {children}
        </ContextMenuContext.Provider>
    );
}

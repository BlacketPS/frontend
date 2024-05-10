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
    const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number; }>({ x: 0, y: 0 });
    const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

    const contextMenuRef = useRef<HTMLDivElement>(null);

    const openContextMenu = (items: ContextMenu["items"]) => {
        if (window.innerWidth <= 768) return setContextMenu({ items });
        else setContextMenu({ items, x: cursorPosition.x, y: cursorPosition.y });

        // need a setTimeout here else it will not set the context menu position correctly do not remove
        setTimeout(() => {
            if (!contextMenuRef.current) return;

            const contextMenuRect = contextMenuRef.current.getBoundingClientRect();

            if (contextMenuRect.right > window.innerWidth) setContextMenu({ items, x: cursorPosition.x - contextMenuRect.width, y: cursorPosition.y });
            if (contextMenuRect.bottom > window.innerHeight) setContextMenu({ items, x: cursorPosition.x, y: cursorPosition.y - contextMenuRect.height });
        });
    };

    const closeContextMenu = () => setContextMenu(null);

    useEffect(() => {
        window.addEventListener("mousemove", (e) => setCursorPosition({ x: e.clientX, y: e.clientY }));

        const handleClickOutside = (e: MouseEvent) => (contextMenuRef.current && contextMenuRef.current.contains(e.target as Node) || closeContextMenu());

        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("mousemove", (e) => setCursorPosition({ x: e.clientX, y: e.clientY }));

            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <ContextMenuContext.Provider value={{ contextMenu, setContextMenu, openContextMenu, closeContextMenu }}>
            {contextMenu && <Container ref={contextMenuRef} top={contextMenu.y} left={contextMenu.x}>
                {contextMenu.items.map((item, index) => item.divider ? <Divider key={index} /> : item && <Item key={index} icon={item.icon} color={item.color} onClick={() => {
                    if (item.onClick) item.onClick();

                    closeContextMenu();
                }}>{item.label}</Item>)}
            </Container>}

            {children}
        </ContextMenuContext.Provider>
    );
}

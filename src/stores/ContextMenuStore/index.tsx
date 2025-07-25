import { RefObject } from "react";
import { create } from "zustand";
import { Container, Divider, Item } from "./components/index";

import { ContextMenuStore, ContextMenu } from "./contextMenu.d";

export const useContextMenu = create<ContextMenuStore>((set, get) => {
    const contextMenuRef = { current: null } as RefObject<HTMLDivElement>;

    const setContextMenu = (contextMenu: ContextMenu) => set({ contextMenu });

    const openContextMenu = async (items: ContextMenu["items"]) => {
        if (window.innerWidth <= 768) {
            set({ visible: true });

            return setContextMenu({ items });
        }

        const cursor = get().cursorPosition || { x: 0, y: 0 };
        setContextMenu({ items, x: cursor.x, y: cursor.y });

        let preventFreeze = 0;
        while (!contextMenuRef.current && preventFreeze++ < 100)
            await new Promise((r) => setTimeout(r, 0));
        if (!contextMenuRef.current) return;

        const rect = contextMenuRef.current.getBoundingClientRect();
        const x = Math.min(cursor.x, window.innerWidth - rect.width);
        const y = Math.min(cursor.y, window.innerHeight - rect.height);

        setContextMenu({ items, x, y });
        if (!get().visible) set({ visible: true });
    };

    const closeContextMenu = () => set({ visible: false, contextMenu: null });

    const setVisible = (v: boolean) => set({ visible: v });

    const render = () => {
        const { contextMenu, visible } = get();
        if (!contextMenu) return null;

        return (
            <Container ref={contextMenuRef} visible={visible} top={contextMenu.y} left={contextMenu.x}>
                {contextMenu.items.map((item, index) =>
                    item?.divider ? (
                        <Divider key={index} />
                    ) : (
                        item && (
                            <Item
                                key={index}
                                icon={item.icon}
                                image={item.image}
                                color={item.color}
                                onClick={() => {
                                    item.onClick?.();
                                    get().closeContextMenu();
                                }}
                            >
                                {item.label}
                            </Item>
                        )
                    )
                )}
            </Container>
        );
    };

    return {
        contextMenu: null,
        setContextMenu,
        openContextMenu,
        closeContextMenu,
        visible: false,
        setVisible,
        contextMenuRef,
        render,
        cursorPosition: { x: 0, y: 0 }
    };
});

if (typeof window !== "undefined") {
    const store = useContextMenu;

    window.addEventListener("mousemove", (e) => {
        store.setState({ cursorPosition: { x: e.clientX, y: e.clientY } });
    });

    window.addEventListener("mousedown", (e) => {
        const ref = store.getState().contextMenuRef;

        if (ref?.current && !ref.current.contains(e.target as Node)) store.getState().closeContextMenu();
    });
}

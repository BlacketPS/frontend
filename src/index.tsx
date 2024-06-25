import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import "./fetch2";
import "./console";

import App from "./App";

createRoot(document.getElementById("app") as HTMLElement).render(
    <HelmetProvider>
        <App />
    </HelmetProvider>
);

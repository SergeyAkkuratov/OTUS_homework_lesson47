import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/Store";

import App from "./App";

const root = createRoot(document.getElementById("app")!);
root.render(
    <>
        <Provider store={store}>
            <BrowserRouter basename={PREFIX}>
                <App />
            </BrowserRouter>
        </Provider>
    </>
);

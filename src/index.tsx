import React from "react";
// import "./style.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/Store";
import { Provider } from "react-redux";

import App from "./components/App/App";


const root = createRoot(document.getElementById("app")!);
root.render(
    <>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </>
);

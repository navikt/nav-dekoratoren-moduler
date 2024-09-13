import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

document.body.innerHTML = document.body.innerHTML.replace(
    "{{{STYLES}}}",
    `<link href=http://localhost:8088/css/client.css rel="stylesheet" />`
);
document.body.innerHTML = document.body.innerHTML.replace(
    "{{{HEADER}}}",
    `<section id="decorator-header"></section>`
);
document.body.innerHTML = document.body.innerHTML.replace(
    "{{{FOOTER}}}",
    `<section id="decorator-footer"></section>`
);
document.body.innerHTML = document.body.innerHTML.replace(
    "{{{SCRIPTS}}}",
    `<div id="decorator-env" data-src="http://localhost:8088/env?enforceLogin=true&level=Level4"></div>`
);

const rootElement = document.getElementById("app") as HTMLElement;

const script = document.createElement("script");
script.src = "http://localhost:8088/client.js";

document.body.appendChild(script);

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

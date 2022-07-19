import * as React from "react";
import App from "./components/App";
import { createRoot } from "react-dom/client";

const container = document.getElementById("app");
console.log("Render React app in container:", container);
const root = createRoot(container!);
root.render(<App />);

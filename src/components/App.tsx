import * as React from "react";
import "../assets/css/App.css";
// import { shiftJISTable } from "./util";

const reactLogo = require("./../assets/img/react_logo.svg");

const App = () => {
  console.log("Table ::::", {
    0xe69d: 0x8b5a,
  });

  return (
    <div className="app">
      <h1>Hello World!</h1>
      <p>Foo to the barz</p>
      <img src={reactLogo.default} height="480" />
    </div>
  );
};

export default App;

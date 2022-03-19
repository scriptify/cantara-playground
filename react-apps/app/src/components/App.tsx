import React from "react";
import { shiftJISTable } from "./shiftJISTable";

type Props = {};

const App = (props: Props) => {
  return (
    <div>
      What a nice App!
      <br />
      Shifted: {shiftJISTable[0x81a0]}
    </div>
  );
};

export default App;

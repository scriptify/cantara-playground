import React, { useEffect } from 'react';
import jsqr from 'jsqr';
import { shiftJISTable } from './shiftJISTable';

type Props = {};

const App = (props: Props) => {
  useEffect(() => {
    jsqr(new Uint8ClampedArray(), 100, 100);
  }, []);

  return (
    <div>
      What a nice App! Faaaaaakee
      <br />
      Shifted: {shiftJISTable[0x81a0]}
    </div>
  );
};

export default App;

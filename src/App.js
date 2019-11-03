import React, { useRef, useState, useEffect } from 'react';
import image from './apple.jpg';
import { factory } from './lib/particle';

function App() {
  const el = useRef(null);
  const [fps, setFps] = useState(0);
  const [tt, setCalc] = useState(0);
  const [ff, setFF] = useState(0);

  useEffect(() => {
    if (el.current) {
      factory(
        el.current,
        fps => {
          setFps(fps);
        },
        f => {
          setCalc(f);
        },
        i => {
          setFF(i);
        }
      );
    }
  }, [el]);
  return (
    <>
      <b
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 1000,
          color: 'white'
        }}
      >
        {fps} draw fps
        <br />
        {tt} calc fps
        <br />
        {ff} total fps
      </b>
      <img
        id='image'
        style={{ margin: '0 auto' }}
        ref={el}
        src={image}
        alt='qwe'
      />
    </>
  );
}

export default App;

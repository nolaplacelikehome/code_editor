import * as esbuild from 'esbuild-wasm';
import { createRoot } from 'react-dom/client';
import { unpkgPathPlugin } from './es_build_plugin';
import { useState, useEffect, useRef } from 'react';

function App() {
  const ref = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState(); 

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if(!ref.current) {
      return;
    }

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()]
    });

    console.log(result);


    setCode(result.outputFiles[0].text);
    
  }

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
    
  }

  return (
    <div>
      <textarea value={input} onChange={e => setInput(e.target.value)} name="" id="" cols={30} rows={10}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
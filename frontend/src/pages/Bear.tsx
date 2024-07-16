import { useState } from 'react';
import axios from 'axios';
import BearCounter from '../components/BearCounter';
import BearControl from '../components/BearControl';

const Bear = () => {
  const [test, setTest] = useState('AXIOS GET');
  axios.get('https://httpbin.org/get').then((res) => {
    console.log(res.data);
    setTest(res.data.url);
  });
  return (
    <>
      <h1 className="text-5xl font-bold underline">tailwindCSS Test</h1>
      <p>{test}</p>
      <BearCounter />
      <BearControl />
    </>
  );
};

export default Bear;

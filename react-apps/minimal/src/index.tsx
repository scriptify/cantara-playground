import React from 'react';
import ReactDOM from 'react-dom';
import { useRenderPdf } from './useRenderPdf';

class AnimalWithPrivateField {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  get name() {
    return this.#name;
  }
}
const animal = new AnimalWithPrivateField('dog');

console.log('useRenderPdf', useRenderPdf);

function App() {
  return <p>The animal's name is {animal.name}</p>;
}

ReactDOM.render(<App />, document.querySelector('#app'));

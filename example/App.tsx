import './App.css';
import React, { useState } from 'react';
import { DnSelect } from '../src/index';
import { names } from './names';

type Item = string;

const initSelected = ['Chris', 'Lyra', 'Matteo'];

function App() {
  const [items, setItems] = useState<Item[]>(names);
  const [selectedItems, setSelectedItems] = useState<Item[]>(initSelected);

  const deleteSelected = () => {
    setItems((items) => items.filter((item) => !selectedItems.includes(item)));
    setSelectedItems([]);
  };

  return (
    <div className="App">
      <h1>
        <span>Drag to select...</span>
        <br />
        <button onClick={deleteSelected} disabled={!selectedItems.length}>
          Delete ({selectedItems.length})
        </button>
      </h1>

      <DnSelect
        items={items}
        itemId={(item) => item.toLowerCase()}
        renderItem={({ item }) => <p>{item}</p>}
        onDragMove={setSelectedItems}
        initSelected={selectedItems}
        throttleDelay={150}
      />
    </div>
  );
}

export default App;

import './App.css';
import React, { useState } from 'react';
import { DnSelect } from '../src/index';
import { names } from './names';

type Item = string;

function App() {
  const [items, setItems] = useState<Item[]>(names);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

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
        onDragStart={(prevSelected) => console.log(`Previous: ${prevSelected}`)}
        onDragMove={setSelectedItems}
        throttleDelay={150}
      />
    </div>
  );
}

export default App;

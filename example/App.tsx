import './App.css';
import React, { useState } from 'react';
import { DnSelect } from '../src/index';
import { names } from './names';

type Item = string;

function App() {
  const [items, setItems] = useState<Item[]>(names);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  const deleteSelected = () => {
    setItems((prevItems) => {
      return prevItems.filter((item) => !selectedItems.includes(item));
    });
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

      <DnSelect<Item>
        items={items}
        itemId={(item) => item.toLowerCase()}
        renderItem={({ item }) => {
          return <p>{item}</p>;
        }}
        onChange={(selection) => setSelectedItems(selection || [])}
        throttleDelay={150}
      />
    </div>
  );
}

export default App;

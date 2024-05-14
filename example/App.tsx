import './App.css';
import React, { useState } from 'react';
import { DnSelect } from '../src/index';
import { names } from './names';

type Item = string;

const initSelected = ['Chris', 'Lyra', 'Matteo'];

function App() {
  const [items, setItems] = useState<Item[]>(names);
  const [selectedItems, setSelectedItems] = useState<Item[]>(initSelected);
  const [multiSelect, setMultiSelect] = useState(false);

  const deleteSelected = () => {
    setItems((items) => items.filter((item) => !selectedItems.includes(item)));
    setSelectedItems([]);
  };

  return (
    <div className="App">
      <header>
        <h1>Drag to select...</h1>

        <div className="actions">
          <button onClick={deleteSelected} disabled={!selectedItems.length}>
            Delete ({selectedItems.length})
          </button>

          <label>
            <input
              name="multi-select"
              type="checkbox"
              onChange={(e) => setMultiSelect(e.target.checked)}
            />{' '}
            Multi select
          </label>
        </div>
      </header>

      <DnSelect
        items={items}
        itemId={(item) => item.toLowerCase()}
        renderItem={({ item }) => <p>{item}</p>}
        onDragStart={setSelectedItems}
        onDragMove={setSelectedItems}
        initSelected={initSelected}
        multi={multiSelect}
        throttleDelay={150}
      />
    </div>
  );
}

export default App;

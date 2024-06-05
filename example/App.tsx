import './App.css';
import React, { useState, useEffect } from 'react';
import { DnSelect } from '../src/index';
import { names } from './names';

const initSelected = names.slice(0, 3);

/**
 * Example app
 */
function App() {
  const [items, setItems] = useState<string[]>(names);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(initSelected);

  const deleteSelected = () => {
    setItems((items) => items.filter((item) => !selectedItems.includes(item)));
    setSelectedItems([]);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.shiftKey && setMultiSelect(true);
    const onKeyUp = (e: KeyboardEvent) => !e.shiftKey && setMultiSelect(false);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div className="App">
      <header>
        <h1>react-dn-select</h1>

        <div className="actions">
          <button onClick={deleteSelected} disabled={!selectedItems.length}>
            Delete ({selectedItems.length})
          </button>

          <label>
            <input
              name="multi-select"
              type="checkbox"
              checked={multiSelect}
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
        multi={multiSelect}
        initSelected={initSelected}
        onDragStart={(selection) =>
          multiSelect ? setSelectedItems(selection) : setSelectedItems([])
        }
        onDragMove={setSelectedItems}
        dragThreshold={4}
        throttleDelay={150}
      />
    </div>
  );
}

export default App;

<p align="center">
  <img src="example/dn-select-example.png"><br>
</p>

# react-dn-select [![NPM Version](https://img.shields.io/npm/v/react-dn-select?color=%2392c017)](https://www.npmjs.com/package/react-dn-select)

Drag and select anything.

- Supports both single and multi selection
- Works with responsive layouts
- Select box and items can be freely styled
- Uses modern React components with hooks

See [demo app](https://vasilionjea.github.io/react-dn-select/)

## Getting started

### Installation

- Install by executing `npm install react-dn-select` or `yarn add react-dn-select`
- Import by adding `import { DnSelect } from 'react-dn-select'`
- Use by adding `<DnSelect />` and use required props

### Usage

Here's an example of basic usage:

```tsx
// items can be any value, including both primitives and objects
const [items, setItems] = useState<string[]>(['Foo', 'Bar', 'Baz', '...']);

<DnSelect
  items={items}
  itemId={(item) => item.toLowerCase()}
  renderItem={({ item }) => <p>{item}</p>}
  onDragStart={(prev) => console.log(`previous selection: ${prev}`)}
  onDragMove={(current) => console.log(`current selection: ${current}`)}
  onDragEnd={(final) => console.log(`final selection: ${final}`)}
  initSelected={['Bar', 'Baz']}
  multi={false}
  escapable={true}
  onEscape={() => console.log('Escaped!')}
  dragThreshold={4}
  throttleDelay={150}
/>;
```

### Props

#### Required

| Name       | Description                    | Default     | Example value                             |
| ---------- | ------------------------------ | ----------- | ----------------------------------------- |
| items      | The items to be selected       | `undefined` | `['Foo', 'Bar', 'Baz']`                   |
| itemId     | Function to get each item's id | `undefined` | `(item) => item.toLowerCase()`            |
| renderItem | Function to render each item   | `undefined` | `({ item, isSelected }) => <p>{item}</p>` |

#### Optional

| Name          | Description                                  | Default     | Example value            |
| ------------- | -------------------------------------------- | ----------- | ------------------------ |
| initSelected  | Preselected items on initial mount           | `[]`        | `['Bar', 'Baz']`         |
| multi         | Allows multi-select when true                | `false`     | `true`                   |
| onDragStart   | Function to react to selection start         | `undefined` | `(prevSelection) => {}`  |
| onDragMove    | Function to react to selection move          | `undefined` | `(currSelection) => {}`  |
| onDragEnd     | Function to react to selection end           | `undefined` | `(finalSelection) => {}` |
| escapable     | Stops selection on Escape key press          | `true`      | `false`                  |
| onEscape      | Function to fire when escaped                | `undefined` | `() => {}`               |
| throttleDelay | Prevents rapid rerenders from pointermove    | `100`       | `150`                    |
| dragThreshold | Pixels to drag before drawing the select box | `1`         | `4`                      |

### Development

A minimal dev page can be found in the `example` directory. Execute `npm run dev` to run the demo page.

# react-dn-select

<p>
  <img width="540" src="example/dn-select-example.png">
</p>

Drag and select anything.

- Supports both single and multi selection
- Works with responsive layouts
- Select box and items can be freely styled
- Uses modern React components with hooks

## tl;dr

- Install by executing `npm install react-dn-select` or `yarn add react-dn-select`
- Import by adding `import { DnSelect } from 'react-dn-select'`
- Use by adding `<DnSelect />` and use required props

## Demo

A minimal demo page can be found in the `example` directory.

## Getting started

### Installation

Add it to your project by running `npm install react-dn-select` or `yarn add react-dn-select`.

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
    throttleDelay={150}
  />
```

### Required props
| Prop name  	| Description                     	    | Default value 	| Example value                  	                  |
|------------	|-------------------------------------	|---------------	|-------------------------------------------------	|
| items      	| The items driving the component 	    | `undefined`   	| `['foo', 'bar', 'baz']`        	                  |
| itemId     	| Function to get each item's id  	    | `undefined`   	| `(item) => item.toLowerCase()` 	                  |
| renderItem 	| Function to render each item    	    | `undefined`   	| `{ item }) => <p>{item}</p>`   	                  |


### Optional props
| Prop name  	   | Description                     	           | Default      	     | Example value                  	                      |
|-------------	 |------------------------------------------	 |-----------------	   |------------------------------------------------------- |
| onDragStart    | Function to react to selection start        | `undefined`   	     | `(prevSelection) => console.log(prevSelection)`        |
| onDragMove     | Function to react to selection move         | `undefined`   	     | `(currSelection) => console.log(currSelection)`        |
| onDragEnd      | Function to react to selection end          | `undefined`   	     | `(finalSelection) => console.log(finalSelection)`      |
| initSelected   | Preselected items on initial mount          | `[]`                | `['bar', 'baz']`                                       |
| multi          | Allows multi-select when true               | `false`             | `true`                                                 |
| escapable      | Stops selection on Escape key press         | `true`              | `false`                                                |
| onEscape       | Function to fire when escaped               | `undefined`         | `() => console.log('Escaped!')`                        |
| throttleDelay  | Prevents rapid rerenders from pointermove   | `100`               | `150`                                                  |

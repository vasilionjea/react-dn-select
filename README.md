# react-dn-select

Drag and select anything.

<em>Note: this is work in progress...</em>

<img width="600" src="example/dn-select-example.png">

## Usage

```javascript
  const [items, setItems] = useState<string[]>(['Foo', 'Bar', 'Baz', '...']);

  //...

  <DnSelect
    items={items}
    itemId={(item) => item.toLowerCase()}
    renderItem={({ item }) => <p>{item}</p>}
    onDragStart={(prevSelected) => console.log(`Previous: ${prevSelected}`)}
    onDragMove={setSelectedItems}
    onDragEnd={setSelectedItems}
    throttleDelay={150}
  />
```

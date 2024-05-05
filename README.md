# react-dn-select

Drag and select anything.

Note: this is work in progress...

## Usage

```javascript
  const [items, setItems] = useState<string[]>(['Foo', 'Bar', 'Biz', 'Baz', '...']);

  //...

  <DnSelect
    items={items}
    itemId={(item) => item.toLowerCase()}
    renderItem={({ item }) => {
      return <p>{item}</p>;
    }}
    onChange={(selected) => console.log('Selected items:', selected)}
    throttleDelay={150}
```

<img width="600" src="example/dn-select-example.png">

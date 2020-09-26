# react-useinfinitescroll

> dynamically sized infinite scrolling capabalities

[![NPM](https://img.shields.io/npm/v/@netanelhaber/react-use-infinite-scroll.svg)](https://www.npmjs.com/package/@netanelhaber/react-use-infinite-scroll)

## Install

```bash
npm install --save @netanelhaber/react-use-infinite-scroll
```

## Usage

sandbox - https://codesandbox.io/s/damp-mountain-78wnx (src in example folder)

Pay attention to **useInfiniteScroll** and **ScrollProvider**:
```javascript
const Child = memo(() => <img
  style={{ margin: "10px auto", display: "block" }}
  alt=""
  height={`${80 * Math.random() + 20}px`}
  src="https://media1.tenor.com/images/806fa85fc55a55de66ab310e500b5f0f/tenor.gif?itemid=5716621" />
);
const ScrollAwareChildren = memo(() => useInfiniteScroll(Array(1000).fill(0))
  .map((d, i) => <Child key={i} />));


ReactDOM.render(
  <ScrollProvider>
    <div style={{ overflowY: "scroll", height: "60vh", backgroundColor: "beige" }}>
      <ScrollAwareChildren />
    </div>
  </ScrollProvider>,
  document.getElementById("root")
);
```
ScrollProvider attaches a ref to the scroll container passed to it as a child.
This ref allows the component to follow the scroll container's scroll position and create a context.
useInfiniteScroll consumes this context, which alerts it of changes to the ref, and when the scroll container is scrolled to the bottom (or rather, near-bottom) or to the top.
useInfiniteScroll only recieves an array.  It returns a slice of said array, the size of which will be determined by the scroll state of the container.

Important point: **React.memo** the array items if possible. unmemoized items will be rerendered with each update to the slice.

Let's compare this solution to other popular solutions:
1. It is very simple to use:
    -  Absolutely no config needed
    -  useInfiniteScroll returns just a slice of an array!
2. useInfiniteScroll is **completely size agnostic** - it doesnt expect any knowledge of each item's height, or the container size. This allows for completely dynamically sized children.
3. debounce is the only dependency aside from React.
4. The solution doesn't handle asynchronously loading data.
5.  Trying to actually scroll all the way down while **dragging** the scrollbar will not work.

## License

MIT © [netanel-haber](https://github.com/netanel-haber)

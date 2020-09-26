# react-use-infinite-scroll

> dynamically sized infinite scrolling capabalities

[![NPM](https://img.shields.io/npm/v/react-use-infinite-scroll.svg)](https://www.npmjs.com/package/react-use-infinite-scroll)

## Install

```bash
npm install --save react-use-infinite-scroll
```

## Usage

sandbox - https://codesandbox.io/s/damp-mountain-78wnx (src in example folder)

Pay attention to **useInfiniteScroll** and **ScrollProvider**:
```javascript
const Child = memo(() => <div style={{ height:"40px", height: "40px",  }}/>);
const data = Array(1000).fill(0);
const ScrollAwareChildren = memo(() => {
	const slice = useInfiniteScroll(data);
	return slice.map((d, i) => <Child key={i} ></Child>)
});

const App = ()=>(
	<ScrollProvider>
		<div style={{ overflowY: "scroll", height: "60vh", backgroundColor: "beige" }}>
		  <ScrollAwareChildren/>
		</div>
	</ScrollProvider>
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

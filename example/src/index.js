import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import {ScrollProvider, useInfiniteScroll} from 'react-use-infinite-scroll';


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

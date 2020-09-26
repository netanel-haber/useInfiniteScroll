import { debounce } from "debounce";
import { useContext, useEffect, useState, useRef } from "react";
import { ScrolledToBottomContext } from "./ScrollProvider";

export default function useInfiniteScroll(arr, asynchronouslyLoadingData = false, numToRender = 5) {
  const { length } = arr;
  const [howManyRendered, updateHowManyRendered] = useState(0);
  const { scrolledToBottom, scrolledToTop, ref } = useContext(
    ScrolledToBottomContext
  );

  const alreadyRenderedMoreForCurrentScrolledToBottomEvent = useRef(false);

  // main effect - render more items if scrolled to bottom event is fired
  useEffect(() => {
    if (length < howManyRendered) return;
    if (scrolledToBottom) {
      if (!alreadyRenderedMoreForCurrentScrolledToBottomEvent.current) {
        updateHowManyRendered(howManyRendered + numToRender);
        alreadyRenderedMoreForCurrentScrolledToBottomEvent.current = true;
      }
    }
    else
      alreadyRenderedMoreForCurrentScrolledToBottomEvent.current = false;
  }, [scrolledToBottom, length, numToRender, howManyRendered]);


  // if vertical scrollbar not active (because not enough items are rendered to warrant scrolling, relative to screen height), render more items until some off screen
  useEffect(() => {
    if (length < howManyRendered) return;
    if (ref) {
      const noYScrollbar = ref.scrollHeight <= ref.clientHeight;
      if (noYScrollbar && !asynchronouslyLoadingData)
        updateHowManyRendered(howManyRendered + numToRender);
    }
  }, [ref, howManyRendered, length, asynchronouslyLoadingData, numToRender]);


  // if arrLength of the items array changes (i.e. when applying filtering to the array, for example), reset howManyRendered
  useEffect(() => {
    if (length)
      updateHowManyRendered(Math.min(numToRender, length));
  }, [length, numToRender]);


  // handles resize events (including zoom events). Zooming out enough can cause the scrollbar to be inactive (or lengthening the screen size). 
  // This function relies solely on scroll events to render more items.
  // This effect is the outlier as it is "defensive" - it triggers a debounced reseting of the number of items on resize, in case the scrollbar is inactive.  
  // This is done in order to trigger the following effect, which will take care of rendering enough items for the scrollbar to reactivate.
  useEffect(() => {
    const handleResize = () => {
      if (ref) {
        const noYScrollbar = ref.scrollHeight <= ref.clientHeight;
        if (noYScrollbar)
          updateHowManyRendered(0);
      }
    };
    window.onresize = debounce(handleResize, 200);
    return () => window.onresize.clear();
  }, [ref]);

  // cleanup - reset items if scrolled back to top.
  useEffect(() => {
    if (scrolledToTop)
      updateHowManyRendered(Math.min(numToRender, length))
  }, [scrolledToTop, length, numToRender]);

  return arr.slice(0, howManyRendered);
}


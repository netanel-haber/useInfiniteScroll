import React, { useCallback, useEffect, useMemo, useRef, useState, createContext } from "react";

export const ScrolledToBottomContext = createContext();


const ZOOM_PIXEL_INACCURACY_SAFETY_NET = 2;

export default function ScrollProvider({ children, pixelsFromBottom = 350 }) {
  const [scrolledToNearBottom, updateScrolledToBottom] = useState(false);
  const [scrolledToTop, updateScrolledToTop] = useState(true);
  const [scrollContainerRef, setRefValue] = useState(null);

  const previousScrollTop = useRef(0);

  const scrollContainerRefCB = useCallback((node) => {
    setRefValue(node);
  }, []);

  const updateScrolledToBottomOnce = useMemo(() => {
    let haventUpdatedOnceYet = !scrolledToNearBottom;
    return () => {
      if (haventUpdatedOnceYet) {
        haventUpdatedOnceYet = false;
        updateScrolledToBottom(true);
      }
    };
  }, [scrolledToNearBottom, updateScrolledToBottom]);

  const handleScroll = ({ target }) => {
    // https://github.com/reactjs/rfcs/issues/175 - This check prevents the handler from
    // running on bubbled children scroll events.
    if (target !== scrollContainerRef) return;
    const { scrollHeight, scrollTop, clientHeight } = target;

    if (scrollTop === 0) return updateScrolledToTop(true);
    const wasDownScroll = previousScrollTop.current - scrollTop < 0;
    previousScrollTop.current = scrollTop;

    if (!wasDownScroll)
      return;
    const fromScollPointToBottomOfContainer =
      scrollHeight - Math.ceil(scrollTop);
    const nearlyAtBottom =
      fromScollPointToBottomOfContainer -
      (clientHeight + pixelsFromBottom) <=
      ZOOM_PIXEL_INACCURACY_SAFETY_NET;
    if (nearlyAtBottom)
      updateScrolledToBottomOnce();
  }

  useEffect(() => {
    if (scrolledToNearBottom)
      updateScrolledToBottom(false)
  }, [scrolledToNearBottom, updateScrolledToBottom])

  useEffect(() => {
    if (scrolledToTop)
      updateScrolledToTop(false)
  }, [scrolledToTop, updateScrolledToTop]);

  return (
    <ScrolledToBottomContext.Provider
      value={{
        ref: scrollContainerRef,
        scrolledToBottom: scrolledToNearBottom,
        scrolledToTop
      }}>
      {React.cloneElement(children, {
        ...children.props,
        onScroll: handleScroll,
        ref: scrollContainerRefCB
      })}
    </ScrolledToBottomContext.Provider>
  );
}


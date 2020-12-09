const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

export default debounce;

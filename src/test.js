function swapHeadAndTail(arr) {
  // const mid = Math.round(arr.length / 2);
  // return arr.map((a, i, v) => {
  //   let x;
  //   if (arr.length % 2 && i === mid - 1) {
  //     x = a;
  //   } else {
  //     x = v[mid + i - (mid + i >= arr.length ? arr.length + (arr.length % 2) : 0)];
  //   }
  //   return x;
  // });
  const mid = Math.trunc(arr.length / 2);
  const head = arr.slice(0, mid);
  const midle = arr.length % 2 ? arr.slice(mid, mid + 1) : [];
  const tail = arr.slice(mid + (arr.length % 2));
  return [...tail, ...midle, ...head];
}

console.log(swapHeadAndTail([1, 2, 3, 4]));

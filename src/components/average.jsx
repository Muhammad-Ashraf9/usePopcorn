//refactor to keep avg on adding movies with no runtime N/A
export const average = (arr) =>
  arr.reduce(
    (acc, cur, i, arr) => (isNaN(cur) ? acc + acc / i : acc + cur / arr.length),
    0
  );

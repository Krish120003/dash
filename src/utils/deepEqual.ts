export const deepEqual = function (
  x: Record<string, unknown>,
  y: Record<string, unknown>,
) {
  if (x === y) {
    return true;
  } else if (
    typeof x == "object" &&
    x != null &&
    typeof y == "object" &&
    y != null
  ) {
    if (Object.keys(x).length != Object.keys(y).length) return false;

    for (const prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (
          !deepEqual(
            x[prop] as Record<string, unknown>,
            y[prop] as Record<string, unknown>,
          )
        )
          return false;
      } else return false;
    }

    return true;
  } else return false;
};

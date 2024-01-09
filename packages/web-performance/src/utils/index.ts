export const roundByFour = (num: number, digits = 4) => {
  try {
    return parseFloat(num.toFixed(digits));
  } catch (err) {
    return num;
  }
};

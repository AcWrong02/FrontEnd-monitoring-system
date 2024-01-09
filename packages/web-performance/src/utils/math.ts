import { Curve } from "../types";

/**
 * Approximates the Gauss error function, the probability that a random variable
 * from the standard normal distribution lies within [-x, x]. Moved from
 * traceviewer.b.math.erf, based on Abramowitz and Stegun, formula 7.1.26.
 * @param {number} x
 * @return {number}
 */
function internalErf_(x: number): number {
  // erf(-x) = -erf(x);
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
  return sign * (1 - y * Math.exp(-x * x));
}

/**
 * Creates a log-normal distribution and finds the complementary
 * quantile (1-percentile) of that distribution at value. All
 * arguments should be in the same units (e.g. milliseconds).
 *
 * @param curve Curve
 * @param {number} value
 * @return The complement of the quantile at value.
 * @customization
 */
export function QUANTILE_AT_VALUE(curve: Curve, value): number {
  const { podr, median, p10 } = curve;

  let _podr = podr;

  if (!podr) {
    _podr = derivePodrFromP10(median, p10);
  }

  const location = Math.log(median);

  // The "podr" value specified the location of the smaller of the positive
  // roots of the third derivative of the log-normal CDF. Calculate the shape
  // parameter in terms of that value and the median.
  // See https://www.desmos.com/calculator/2t1ugwykrl
  const logRatio = Math.log(_podr / median);
  const shape =
    Math.sqrt(
      1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)
    ) / 2;

  const standardizedX = (Math.log(value) - location) / (Math.SQRT2 * shape);
  return (1 - internalErf_(standardizedX)) / 2;
}

// https://www.desmos.com/calculator/oqlvmezbze
function derivePodrFromP10(median: number, p10: number): number {
  const u = Math.log(median);
  const shape = Math.abs(Math.log(p10) - u) / (Math.SQRT2 * 0.9061938024368232);
  const inner1 = -3 * shape - Math.sqrt(4 + shape * shape);
  return Math.exp(u + (shape / 2) * inner1);
}

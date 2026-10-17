/**
 * Money helpers for NPR.
 *
 * Engineering decision: all money is stored and computed as an INTEGER number
 * of paisa (Rs 1 = 100 paisa) everywhere in the database and server code.
 * Floating-point rupees (0.1 + 0.2 !== 0.3) cause real rounding bugs in order
 * totals, so we never do arithmetic on rupee floats. Only this display helper
 * converts paisa into human-readable rupees.
 *
 * Grouping uses `en-IN` because Nepal uses the same lakh/crore digit grouping
 * (Rs 1,00,000 = one lakh), which plain `en-US` grouping gets wrong.
 */

const RUPEE_GROUPING = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

/** Format an integer paisa amount as Nepali rupees, e.g. 385000 → "Rs 3,850". */
export function formatNpr(paisa: number): string {
  if (!Number.isInteger(paisa)) {
    throw new TypeError(`formatNpr expects an integer paisa amount, got ${paisa}`);
  }

  const rupees = Math.trunc(paisa / 100);
  const remainder = Math.abs(paisa % 100);
  const grouped = RUPEE_GROUPING.format(rupees);

  if (remainder === 0) {
    return `Rs ${grouped}`;
  }

  return `Rs ${grouped}.${remainder.toString().padStart(2, "0")}`;
}

// Columns for a row of n equal items that never leave one item alone on a row at any width (the craft lint's
// row-orphan: 3 cards as 2 + 1 at 768px, 4 facts as 3 + 1 at 640px). Literal classes, so Tailwind sees them.

const ROWS: Record<number, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5',
  6: 'sm:grid-cols-2 lg:grid-cols-3',
  8: 'sm:grid-cols-2 lg:grid-cols-4',
  9: 'md:grid-cols-3',
  12: 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

/** The grid-cols classes for n items in one grid (one column on phones). Counts without a clean split (7, 10, 11)
 *  take two then three columns. */
export const orphanFreeColumns = (n: number) => ROWS[n] ?? 'sm:grid-cols-2 lg:grid-cols-3';

/** The same for a grid that already has two columns on phones (short facts, figures): 3 stays three, 4 is 2 × 2 then
 *  one row, 5 is 3 + 2, 6 is 3 × 2. */
export const orphanFreePairs = (n: number) =>
  ({ 2: '', 3: 'grid-cols-3', 4: 'lg:grid-cols-4', 5: 'sm:grid-cols-3 lg:grid-cols-5', 6: 'sm:grid-cols-3' } as Record<number, string>)[n] ?? 'sm:grid-cols-3';

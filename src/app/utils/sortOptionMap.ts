export const SORT_OPTION_MAP: Record<string, string | null> = {
  '': null, // No sorting — return products in natural MongoDB order
  'price:low_to_high': 'sellingPrice',
  'price:high_to_low': '-sellingPrice',
  newest: '-createdAt',
  best_selling: '-salesCount',
  top_rated: '-averageRatings',
  ascending: 'name',
  descending: '-name',
};

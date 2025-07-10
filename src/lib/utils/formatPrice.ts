export function formatPrice(priceInCents: number) {
  return (priceInCents / 100).toFixed(2);
}

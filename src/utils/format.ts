export function formatPKR(value: number): string {
  if (value >= 10000000) {
    return `Rs ${(value / 10000000).toFixed(1).replace(/\.0$/, '')} Crore`;
  }
  if (value >= 100000) {
    return `Rs ${(value / 100000).toFixed(1).replace(/\.0$/, '')} Lakh`;
  }
  return `Rs ${value.toLocaleString('en-PK')}`;
}

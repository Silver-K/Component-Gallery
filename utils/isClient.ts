export function isClient() {
  return 'window' in globalThis;
}
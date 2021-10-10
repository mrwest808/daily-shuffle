declare module 'lz-string' {
  export function compressToEncodedURIComponent<T>(value: T): string;
  export function decompressFromEncodedURIComponent(value: string): string;
}

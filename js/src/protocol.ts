export function serializeString(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const buffer = new Uint8Array(2 + bytes.length);
  const view = new DataView(buffer.buffer);
  view.setUint16(0, bytes.length, false);
  buffer.set(bytes, 2);
  return buffer;
}

export function deserializeString(buffer: Uint8Array): string {
  const view = new DataView(buffer.buffer);
  const len = view.getUint16(0, false);
  const bytes = buffer.slice(2, 2 + len);
  return new TextDecoder().decode(bytes);
}

export function serializeIntList(list: number[]): Uint8Array {
  const buffer = new Uint8Array(2 + list.length * 4);
  const view = new DataView(buffer.buffer);
  view.setUint16(0, list.length, false);
  list.forEach((v, i) => view.setInt32(2 + i * 4, v, false));
  return buffer;
}

export function deserializeIntList(buffer: Uint8Array): number[] {
  const view = new DataView(buffer.buffer);
  const len = view.getUint16(0, false);
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    out.push(view.getInt32(2 + i * 4, false));
  }
  return out;
}

/**
 * @file base32.js
 * @description RFC 4648 Base32 Encoder & Decoder utilities for storing and rendering images in DB.
 */

const RFC4648_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encodes an ArrayBuffer or Uint8Array into an RFC 4648 Base32 string
 */
export function bufferToBase32(buffer) {
  const bytes = new Uint8Array(buffer);
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8) | bytes[i];
    bits += 8;

    while (bits >= 5) {
      output += RFC4648_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += RFC4648_ALPHABET[(value << (5 - bits)) & 31];
  }

  while (output.length % 8 !== 0) {
    output += "=";
  }

  return output;
}

/**
 * Decodes an RFC 4648 Base32 string back to a Uint8Array
 */
export function base32ToBuffer(base32Str) {
  const clean = base32Str.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes = [];

  for (let i = 0; i < clean.length; i++) {
    const val = RFC4648_ALPHABET.indexOf(clean[i]);
    if (val === -1) continue;

    value = (value << 5) | val;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new Uint8Array(bytes);
}

/**
 * Converts a browser File object to a Base32 string with MIME metadata
 */
export async function fileToBase32(file) {
  const arrayBuffer = await file.arrayBuffer();
  const base32Data = bufferToBase32(arrayBuffer);
  return {
    base32Data,
    mimeType: file.type || "image/png",
    name: file.name,
    size: file.size,
  };
}

/**
 * Converts a Base32 string + MIME type into a displayable browser blob URL or Base64 data URL
 */
export function base32ToDataUrl(base32Data, mimeType = "image/png") {
  if (!base32Data) return "";
  // If already a standard URL or data:image URL, return as-is
  if (base32Data.startsWith("data:") || base32Data.startsWith("/") || base32Data.startsWith("http")) {
    return base32Data;
  }

  try {
    const uint8 = base32ToBuffer(base32Data);
    let binary = "";
    for (let i = 0; i < uint8.length; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    const base64 = btoa(binary);
    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    console.error("Base32 to DataURL conversion error:", e);
    return base32Data;
  }
}

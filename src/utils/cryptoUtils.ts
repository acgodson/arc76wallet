export const deriveKey = async (
  init: string,
  salt: string,
  iterations: number
) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    Buffer.from(init, "utf-8"),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  const masterBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: Buffer.from(salt, "utf-8"),
      iterations: iterations,
    },
    cryptoKey,
    256
  );
  return new Uint8Array(masterBits);
};

// export const deriveKey = async (init: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }, salt: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }, iterations: number) => {
//   const keyMaterial = await window.crypto.subtle.importKey(
//     "raw",
//     Buffer.from(init, "utf-8"),
//     "PBKDF2",
//     false,
//     ["deriveBits", "deriveKey"]
//   );

//   const key = await window.crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt: Buffer.from(salt, "utf-8"),
//       iterations: iterations,
//       hash: "SHA-256"
//     },
//     keyMaterial,
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt", "decrypt"]
//   );

//   const exported = await window.crypto.subtle.exportKey("raw", key);
//   return new Uint8Array(exported);
// };

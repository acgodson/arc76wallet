export const deriveKey = async (init: string, salt: string, iterations: number) => {
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
  
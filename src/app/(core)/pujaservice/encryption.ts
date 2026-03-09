import CryptoJS from 'crypto-js';

const SECRET_KEY = 'okpuja-service-encryption-key-2024';

export const encryptId = (id: number | string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
  } catch (error) {
    return id.toString();
  }
};

export const decryptId = (encryptedId: string): string | null => {
  try {
    if (!encryptedId) {
      return null;
    }

    // First, try to decrypt directly (Next.js auto-decodes URL params)
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (result && result.trim() !== '') {
        return result;
      }
    } catch (directError) {
    }

    // If direct decryption fails, try with URL decoding
    try {
      const decodedId = decodeURIComponent(encryptedId);
      const decrypted = CryptoJS.AES.decrypt(decodedId, SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (result && result.trim() !== '') {
        return result;
      }
    } catch (urlDecodeError) {
    }

    // If both methods fail, try replacing URL-safe characters
    try {
      const sanitizedId = encryptedId.replace(/%2B/g, '+').replace(/%2F/g, '/').replace(/%3D/g, '=');
      const decrypted = CryptoJS.AES.decrypt(sanitizedId, SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (result && result.trim() !== '') {
        return result;
      }
    } catch (sanitizeError) {
    }

    return null;
  } catch (error) {
    return null;
  }
};

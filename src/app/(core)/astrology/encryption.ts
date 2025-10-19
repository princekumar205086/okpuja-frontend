import CryptoJS from 'crypto-js';

const SECRET_KEY = 'okpuja-astrology-encryption-key-2024';

export const encryptId = (id: number | string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    return id.toString();
  }
};

export const decryptId = (encryptedId: string): string | null => {
  try {
    // Next.js automatically decodes URL parameters, so we try direct decryption first
    let decrypted = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
    let result = decrypted.toString(CryptoJS.enc.Utf8);
    
    // If direct decryption doesn't work, try with additional URL decoding
    if (!result) {
      decrypted = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), SECRET_KEY);
      result = decrypted.toString(CryptoJS.enc.Utf8);
    }
    
    return result || null;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

import CryptoJS from 'crypto-js';

const SECRET_KEY = 'okpuja-service-encryption-key-2024';

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
    const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), SECRET_KEY);
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    return result || null;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

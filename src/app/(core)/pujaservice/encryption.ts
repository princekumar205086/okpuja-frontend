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
    if (!encryptedId) {
      console.error('No encrypted ID provided');
      return null;
    }

    // First, try to decrypt directly (Next.js auto-decodes URL params)
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedId, SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (result && result.trim() !== '') {
        console.log('Direct decryption successful:', result);
        return result;
      }
    } catch (directError) {
      console.log('Direct decryption failed, trying with URL decode');
    }

    // If direct decryption fails, try with URL decoding
    try {
      const decodedId = decodeURIComponent(encryptedId);
      const decrypted = CryptoJS.AES.decrypt(decodedId, SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (result && result.trim() !== '') {
        console.log('URL decode decryption successful:', result);
        return result;
      }
    } catch (urlDecodeError) {
      console.log('URL decode decryption also failed');
    }

    // If both methods fail, try replacing URL-safe characters
    try {
      const sanitizedId = encryptedId.replace(/%2B/g, '+').replace(/%2F/g, '/').replace(/%3D/g, '=');
      const decrypted = CryptoJS.AES.decrypt(sanitizedId, SECRET_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (result && result.trim() !== '') {
        console.log('Sanitized decryption successful:', result);
        return result;
      }
    } catch (sanitizeError) {
      console.log('Sanitized decryption also failed');
    }

    console.error('All decryption methods failed for:', encryptedId);
    return null;
  } catch (error) {
    console.error('General decryption error:', error);
    return null;
  }
};

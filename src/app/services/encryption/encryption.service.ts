import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../../../environments/keys';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = SECRET_KEY;

  /**
 * Encrypts the given plaintext using AES encryption with the specified secret key.
 * 
 * @param {string} text - The plaintext to be encrypted.
 * @returns {string} - The encrypted ciphertext as a string.
 */
  public encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  /**
 * Decrypts the given ciphertext back into plaintext using AES decryption with the specified secret key.
 * 
 * @param {string} ciphertext - The encrypted text to be decrypted.
 * @returns {string} - The decrypted plaintext as a string.
 */
  public decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

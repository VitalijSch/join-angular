import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../../../environments/keys';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey = SECRET_KEY;

  public encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  public decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

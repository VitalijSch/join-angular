import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactColorsService {
  private colors: string[] = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B'
  ];

  /**
 * Returns a random color from the `colors` array.
 * 
 * Selects a random index from the `colors` array and returns the color at that index.
 * 
 * @returns {string} - A randomly selected color from the array.
 */
  public getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}

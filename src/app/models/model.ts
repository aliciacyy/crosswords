export class Answer {
  number: number;
  word: BoxCoordinates[];
  hint: string;
  isTouched: boolean;
  
  constructor(number: number, text: string, coordinates: number[][], hint: string) {
    this.number = number;
    this.word = [];
    this.hint = hint;
    this.isTouched = false;
    const letters= text.split('');
    for (let i = 0; i < letters.length; i++) {
      let value = {
        row: coordinates[i][0],
        column: coordinates[i][1],
        letter: letters[i]
      };
      this.word.push(value);
    }
  }
}

export type BoxCoordinates = {
  row: number;
  column: number;
  letter: string;
  input?: string;
}
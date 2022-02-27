import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Answer, BoxCoordinates } from '../../models/model'

@Component({
  selector: 'app-crosswords',
  templateUrl: './crosswords.component.html',
  styleUrls: ['./crosswords.component.scss']
})
export class CrosswordsComponent implements OnInit, AfterViewInit {

  tableGrid = [
    [0,0,0,0,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,1,0,0,1,0,0],
    [0,0,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,1,1,1,1,1,1,1,1,1],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0]
  ]
  answers: Answer[] = [];
  currentHint = '';
  selectedAnswer: Answer | undefined;
  previousAnswer: Answer | undefined;
  currentLetters: string[] = [];
  allLetters: string[][] = [];
  currentIndex = 0;
  hasWon = false;

  constructor() {
    this.generateAnswers();
    this.generateLetters();
   }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.answers.forEach((ans, idx) => {
      this.createSmallNumber(ans);
    }, this);
  }

  generateAnswers(): void{
    this.answers.push(new Answer(1, 'TIMEZONE', [[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8]], 'MaiMai, Pump It Up'));
    this.answers.push(new Answer(2, 'KEYCHRON', [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]], 'Mechanical, one each'));
    this.answers.push(new Answer(3, 'MARCH', [[4,0],[4,1],[4,2],[4,3],[4,4]], 'Anniversary month'));
    this.answers.push(new Answer(4, 'PENGUIN', [[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8]], 'You caught two of these'));
    this.answers.push(new Answer(5, 'BIDADARI', [[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[12,7],[13,7]], 'Our future home'));
    this.answers.push(new Answer(6, 'MARIOKART', [[11,1],[11,2],[11,3],[11,4],[11,5],[11,6],[11,7],[11,8],[11,9]], 'DS game; you always win'));
    this.answers.push(new Answer(7, 'MALA', [[10,2],[11,2],[12,2],[13,2]], 'Spicy & numb'));
  }

  generateLetters() {
    let allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.answers.forEach((ans) => {
      let letterChoices: string[] = [];
      ans.word.forEach((w) => {
        if (letterChoices.indexOf(w.letter) < 0) {
          letterChoices.push(w.letter); 
        }
      });
      let remainingLetters = allLetters.filter((letter) => letterChoices.indexOf(letter) < 0);
      remainingLetters = this.shuffle(remainingLetters);
      let extraLetterCount = 12 - letterChoices.length;
      for (let i=0; i<extraLetterCount; i++) {
        letterChoices.push(remainingLetters[i]);
      }
      letterChoices = this.shuffle(letterChoices);
      this.allLetters.push(this.shuffle(letterChoices));
    });
  }

  shuffle(indexArray: string[]) {
    let currentIndex = indexArray.length,  randomIndex;
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [indexArray[currentIndex], indexArray[randomIndex]] = [
        indexArray[randomIndex], indexArray[currentIndex]];
    }
    return indexArray;
  }

  createSmallNumber(ans: Answer) {
    let boxId = `${ans.word[0].row}-${ans.word[0].column}`;
    let boxElem = document.getElementById(boxId);
    let numberDiv = document.createElement("div");
    numberDiv.setAttribute('class', 'hint-number');
    numberDiv.innerHTML = String(ans.number);
    boxElem?.appendChild(numberDiv)
  }

  onBoxClick(box: number, $event: any) {
    console.log($event.currentTarget.id);
    const splitId = $event.currentTarget.id.split('-');
    const targetRow = Number(splitId[0]);
    const targetCol = Number(splitId[1]);
    if (box === 1 && !this.hasWon) {
      // remove previous highlight
      if (!!this.previousAnswer) {
        this.previousAnswer!.word.forEach((word) => {
          const boxId = `${word.row}-${word.column}`;
          let boxElem = document.getElementById(boxId);
          this.removeHighlights(boxElem);
        });
      }

      // find the selected
      this.selectedAnswer = this.answers.find((element) => {
        const e = element.word.find((word) => {
          return word.row === targetRow && word.column === targetCol;
        });
        return e;
      });
      this.currentIndex = 0;
      this.currentLetters = this.allLetters[this.selectedAnswer!.number - 1];
      this.previousAnswer = JSON.parse(JSON.stringify(this.selectedAnswer));
      
      this.currentHint = this.selectedAnswer!.hint;
      console.log(this.selectedAnswer);

      // highlight the word boxes
      this.selectedAnswer!.word.forEach((word) => {
        const boxId = `${word.row}-${word.column}`;
        let boxElem = document.getElementById(boxId);
        boxElem?.classList.add('highlight');
      });
      this.checkWinningCondition();
    }
  }

  highlightActiveCell(x:number, y:number) {
    if (!!this.selectedAnswer) {
      if (this.selectedAnswer!.word[this.currentIndex].row == x && 
        this.selectedAnswer!.word[this.currentIndex].column == y) {
          let boxId = `${this.selectedAnswer!.word[this.currentIndex].row}-${this.selectedAnswer!.word[this.currentIndex].column}`;
          let boxElem = document.getElementById(boxId);
          boxElem?.classList.add('current');
      }
  
      if (this.currentIndex > 0) {
        let boxId = `${this.selectedAnswer!.word[this.currentIndex - 1].row}-${this.selectedAnswer!.word[this.currentIndex - 1].column}`;
        let boxElem = document.getElementById(boxId);
        boxElem?.classList.remove('current');
      }
    }
  }

  onLetterClick(letter: string) {
    this.selectedAnswer!.isTouched = true;
    this.selectedAnswer!.word[this.currentIndex].input = letter;
    let boxId = `${this.selectedAnswer!.word[this.currentIndex].row}-${this.selectedAnswer!.word[this.currentIndex].column}`;
    let boxElem = document.getElementById(boxId);
    
    const existingLetter = boxElem!.getElementsByClassName("letter");
    if (existingLetter && existingLetter.length > 0) {
      existingLetter[0].innerHTML = letter;
    } else {
      let textDiv = document.createElement("div");
      textDiv.setAttribute('class', 'letter');
      textDiv.innerHTML = letter;
      boxElem?.appendChild(textDiv)
    }
    this.selectedAnswer!.word[this.currentIndex].input = letter;
    this.currentIndex++;

    // unselect if finish inputting
    if (this.currentIndex === this.selectedAnswer!.word.length) {
      this.selectedAnswer!.word.forEach((word) => {
        const boxId = `${word.row}-${word.column}`;
        let boxElem = document.getElementById(boxId);
        this.removeHighlights(boxElem);
        // set letters for any intersects
        this.answers.forEach((ans) => {
          ans.word.forEach((w) => {
            if (word.row === w.row && word.column === w.column) {
              w.input = word.input;
            }
          })
        });
      });
      this.checkWinningCondition();
      this.selectedAnswer = undefined;
      this.currentIndex = 0;
    }
  }

  removeHighlights(boxElem: any) {
    boxElem?.classList.remove('highlight');
    boxElem?.classList.remove('current');
  }

  checkWord(word: BoxCoordinates[], isTouched: boolean) {
    let isCorrect = true;
    word.forEach((w) => {
      if (w.input !== w.letter) {
        isCorrect = false;
      }
    });

    let className = isCorrect ? 'correct' : 'wrong';

    if (isTouched) {
      word.forEach((w) => {
        let boxId = `${w.row}-${w.column}`;
        let boxElem = document.getElementById(boxId);
        boxElem?.classList.remove('correct');
        boxElem?.classList.remove('wrong');
        boxElem?.classList.add(className);
      });
    }
  }

  checkWinningCondition() {
    let check = true;
    for (let ans of this.answers) {
      this.checkWord(ans.word, ans.isTouched);
      for (let letter of ans.word) {
        if (letter.input !== letter.letter) {
          check = false;
          break;
        }
      }
    }
    this.hasWon = check;
  }

} 
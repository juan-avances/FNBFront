import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Output() private cardSelection = new EventEmitter<any>();
  cardList = [];
  visible: boolean = false;
  maxShownCardCount: number = 4;
  firstShownCardIndex: number = 0;
  shownCardList = [];

  selectedCommercialAlly: any = {};
  constructor() {}

  ngOnInit() {}
  onLeft() {
    if (this.firstShownCardIndex > 0) {
      this.firstShownCardIndex--;
      this.updateCards(this.firstShownCardIndex, false);
    }
  }
  onRight() {
    if (this.firstShownCardIndex < this.cardList.length - this.maxShownCardCount) {
      this.firstShownCardIndex++;
      this.updateCards(this.firstShownCardIndex, true);
    }
  }
  loadCards(cardList: any[]) {
    this.cardList = cardList;
    for (let i = 0; i < this.maxShownCardCount && i < this.cardList.length; i++) {
      this.shownCardList.push(this.cardList[i]);
    }
    this.firstShownCardIndex = 0;
  }
  updateCards(index: number, toRight: boolean) {
    if (toRight) {
      this.shownCardList.push(this.cardList[index + this.maxShownCardCount - 1]);
      this.shownCardList.shift();
    } else {
      this.shownCardList.unshift(this.cardList[index]);
      this.shownCardList.pop();
    }
  }
  cardSelected(commercialAlly: any) {
    this.selectedCommercialAlly = commercialAlly;
    this.cardSelection.emit(this.selectedCommercialAlly);
  }
}

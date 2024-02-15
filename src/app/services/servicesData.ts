import { Observable, Subject, } from 'rxjs';
import {Injectable} from  '@angular/core';

@Injectable({providedIn: 'root'})

export class DataService {

  private messageSource = new Subject<string>();

  constructor() { }

  setMessage(message: string) {
    this.messageSource.next(message);
  }

  getMessage() {
    return this.messageSource.asObservable();
  }
}
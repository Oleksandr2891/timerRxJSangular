import { Component, OnInit } from '@angular/core';
import { Observable, interval, fromEvent } from "rxjs";
import { map, takeWhile, take, debounceTime, buffer, filter } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
  
export class AppComponent implements OnInit{

  display = "00:00"
  startNumber = 0;
  count = 0;
  isStart = false;
  isReset = false;
  isWait = false;


  ngOnInit() {
    this.dubleClick();
  }

  toggleInterval() {
    this.isStart = !this.isStart;
    this.isReset = false;
    !this.isWait && (this.display = "00:00", this.startNumber = 0);
    this.isStart && this.startInterval().subscribe({ next: count => { this.display = count.display, this.count = count.count }});
    setTimeout(() => {
      this.isWait = false;
    }, 3000);
    
  }


  startInterval() {
    return new Observable<{display: string, count: number}>(
      subscriber => {
        interval(1000)
          .pipe(map(count => count + this.startNumber))
          .pipe(take(50))
          .pipe(takeWhile(count => this.isStart))
          .subscribe(count => {
            const minutes = Math.floor(count / 60);
            const seconds = count - minutes * 60;
            subscriber.next({display:`${('0' + minutes.toString()).slice(-2)}:${('0' + seconds.toString()).slice(-2)}`, count})
          
            if (this.isReset) {
                  subscriber.complete();
                }
          });
      }
    )
  }

  resetInterval() {
    this.isReset = true;
    setTimeout(() => {
      this.isStart = false;
      this.toggleInterval()
    }, 1000);
  }


  dubleClick() {
    const mouse$ = fromEvent(document.querySelectorAll(".wait"), 'click');
    const buff$ = mouse$.pipe(debounceTime(500));
    const click$ = mouse$.pipe( buffer(buff$), map(list => {return list.length}), filter(x => x === 2))
    click$.subscribe(() => {
      this.startNumber = this.count;
      this.isWait = true;
      this.isStart = false;
    })
  }

}





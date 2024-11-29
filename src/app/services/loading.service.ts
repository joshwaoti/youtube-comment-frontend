import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private transitioningSubject = new BehaviorSubject<boolean>(false);
  
  isLoading$ = this.loadingSubject.asObservable();
  isTransitioning$ = this.transitioningSubject.asObservable();

  startLoading() {
    this.loadingSubject.next(true);
    this.transitioningSubject.next(true);
  }

  stopLoading() {
    this.loadingSubject.next(false);
    setTimeout(() => {
      this.transitioningSubject.next(false);
    }, 500); // Allow time for transition animations
  }
}

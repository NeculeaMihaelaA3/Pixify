import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  private dataSubject = new BehaviorSubject<string>('Initial data');
  data$ = this.dataSubject.asObservable();

  constructor(private api: ApiService) { }

  refreshData() {
    // Do something to refresh data
    if(this.api.isAuthenticated() == true){
      this.dataSubject.next('logged');
    }
    else{
      this.dataSubject.next('notlogged');
    }
  }
}

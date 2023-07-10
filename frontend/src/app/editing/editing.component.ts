import {
  Component,
  OnInit,
  ChangeDetectorRef,
  SecurityContext,
  OnDestroy,
  ViewChild, 
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  of,
  from,
  filter,
  map,
  interval,
  fromEvent,
  timeout,
  Subscription
} from 'rxjs';
import { CookieService } from 'ngx-cookie';
import jwt_decode from 'jwt-decode';
import { DomSanitizer } from '@angular/platform-browser';
import { BlockScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss'],
})
export class EditingComponent implements OnInit, OnDestroy  {
  constructor(private cd: ChangeDetectorRef) {}
  
  @ViewChild('mainImage') mainImage!: ElementRef;
  images = ["assets/img/3.jpg", "assets/img/edit.jpg", "assets/img/style.jpg", "assets/img/photography.jpg"];
  currentIndex = 0;
  thumbnails: string[] = [];
  imageChanger!: Subscription;

  ngOnInit() {
    this.updateThumbnails();
    this.imageChanger = interval(3000).subscribe(() => this.changeImage());
  }

  ngOnDestroy() {
    this.imageChanger.unsubscribe();
  }

  changeImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateThumbnails();
  }

  updateThumbnails() {
    this.thumbnails = this.images.filter((img, index) => index !== this.currentIndex);
    this.cd.detectChanges();
  }
}

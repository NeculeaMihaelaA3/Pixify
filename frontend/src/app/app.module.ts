import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { EditingComponent } from './editing/editing.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { RegistrationComponent } from './registration/registration.component';
import { RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CookieModule } from 'ngx-cookie';
import { ProfileComponent } from './profile/profile.component';
import { MetadataComponent } from './metadata/metadata.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WatermarkComponent } from './watermark/watermark.component';
import { PixelplotComponent } from './pixelplot/pixelplot.component';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { BlurrydetectionComponent } from './blurrydetection/blurrydetection.component';
import { SegmentationComponent } from './segmentation/segmentation.component';
import { TypeConvertorComponent } from './type-convertor/type-convertor.component';
import { TextrecognitionComponent } from './textrecognition/textrecognition.component';
import { RemovenoiseComponent } from './removenoise/removenoise.component';
import { RemoveredeyeComponent } from './removeredeye/removeredeye.component';


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EditingComponent,
    HeaderComponent,
    RegistrationComponent,
    ProfileComponent,
    MetadataComponent,
    HomeComponent,
    SidebarComponent,
    WatermarkComponent,
    PixelplotComponent,
    BlurrydetectionComponent,
    SegmentationComponent,
    TypeConvertorComponent,
    TextrecognitionComponent,
    RemovenoiseComponent,
    RemoveredeyeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatMenuModule,
    RouterModule,
    CommonModule,
    MatProgressSpinnerModule,
    CookieModule.withOptions(),
    PlotlyViaCDNModule,
    PlotlyModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent],

})
export class AppModule { }

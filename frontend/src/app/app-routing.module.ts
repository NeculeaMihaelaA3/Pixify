import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditingComponent } from './editing/editing.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile.component';
import { MetadataComponent } from './metadata/metadata.component';
import { AppComponent } from './app.component';
import { WatermarkComponent } from './watermark/watermark.component';
import { PixelplotComponent } from './pixelplot/pixelplot.component';
import { BlurrydetectionComponent } from './blurrydetection/blurrydetection.component';
import { SegmentationComponent } from './segmentation/segmentation.component';
import { TypeConvertorComponent } from './type-convertor/type-convertor.component';
import { TextrecognitionComponent } from './textrecognition/textrecognition.component';
import { RemovenoiseComponent } from './removenoise/removenoise.component';
import { RemoveredeyeComponent } from './removeredeye/removeredeye.component';

const routes: Routes = [
  {path: 'editing', component : EditingComponent},
  {path: 'login', component : LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'metadata', component: MetadataComponent},
  {path: 'watermark', component: WatermarkComponent},
  {path: 'plot', component: PixelplotComponent},
  {path: 'blurrydetection', component: BlurrydetectionComponent},
  {path: 'segmentation', component: SegmentationComponent},
  {path: 'typeconvertor', component: TypeConvertorComponent},
  {path: 'textrecognition', component: TextrecognitionComponent},
  {path: 'removenoise', component: RemovenoiseComponent},
  {path: 'remove_red_eye', component: RemoveredeyeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

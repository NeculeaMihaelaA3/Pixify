import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-blurrydetection',
  templateUrl: './blurrydetection.component.html',
  styleUrls: ['./blurrydetection.component.scss'],
})
export class BlurrydetectionComponent {
  public imageSrc: any = 'assets/img/dummy-logo.png';
  public file: File | undefined;
  public msg: String = '';
  public isVisible: boolean = false;
  public lastButtonClicked: String = '';
  public resultImage: String = 'assets/img/dummy-logo.png';
  public mean: Number = 0;
  public notBlurry: boolean = false;
  public visible: boolean = false;
  public notImage: boolean = false;

  constructor(private cd: ChangeDetectorRef, private http: HttpClient) {
    this.isVisible = false;
    this.notImage = false;
  }

  ngOnInit(): void {
    this.isVisible = false;
    this.visible = false;
    this.notImage = false;
  }

  onFileSelected(event: any) {
    this.resultImage = 'assets/img/dummy-logo.png';
    this.imageSrc = 'assets/img/dummy-logo.png';
    this.file = <File>event.target.files[0];
    var mimeType = event.target.files[0].type;
    this.notImage = false;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      this.notImage = true;
      return;
    }
    this.cd.detectChanges();

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = '';
      this.imageSrc = reader.result;
      this.cd.detectChanges(); // Trigger change detection
    };

    if (this.file != null) {
      this.resultImage = 'assets/img/dummy-logo.png';
      this.imageSrc = 'assets/img/dummy-logo.png';
      this.cd.detectChanges();
      this.onUpload_blurry_detection();
    }
  }

  async onUpload_blurry_detection() {
    this.visible = false;
    this.cd.detectChanges();
    if (!this.file) {
      console.log('No file selected');
    } else {
      this.isVisible = true;
      const formData = new FormData();
      formData.append('file', this.file);
      console.log(typeof this.file);

      this.isVisible = true;
      const response = await this.postImage(formData);
      console.log(response);

      this.cd.detectChanges();
      const token = localStorage.getItem('secret');
      var jwt: String = 'empty';

      if (token) {
        console.log('the token exists! ');
        jwt = token;
      } else {
        console.log('The token is null!!');
      }

      const headerDict = {
        jwt: `Bearer ${jwt}`,
      };

      this.http
        .get('http://localhost:5000/get_detect_blurry', {
          responseType: 'blob',
          observe: 'response',
          headers: new HttpHeaders(headerDict),
        })
        .subscribe(
          (response) => {
            this.createImageFromBlob(response.body!);
            const reader = new FileReader();
            reader.readAsDataURL(response.body!);
            reader.onloadend = () => {
              this.resultImage = reader.result as string;
              this.cd.detectChanges();
            };
            this.isVisible = false;
            
            this.mean = Number(response.headers.get('Content-Type'));
            this.visible = true;
            this.cd.detectChanges();
            if(this.mean.valueOf() <= 30){
              this.notBlurry = false;
            }
            else{
              this.notBlurry = true;
            }
            this.cd.detectChanges();
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  async postImage(data: any): Promise<any> {
    const token = localStorage.getItem('secret');
    var jwt: String = '';

    if (token) {
      console.log('the token exists! ');
      jwt = token;
    } else {
      console.log('The token is null!!');
    }

    const headerDict = {
      jwt: `Bearer ${jwt}`,
    };

    const response = await this.http
      .post('http://localhost:5000/upload', data, {
        headers: new HttpHeaders(headerDict),
      })
      .toPromise();
    return response;
  }

  function(): void {
    const myAbsolutelyNotNullElement =
      window.document.getElementById('my-file')!;
    myAbsolutelyNotNullElement.click();
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        // this.imageSrc = reader.result as string;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}

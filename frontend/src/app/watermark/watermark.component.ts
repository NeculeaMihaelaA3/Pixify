import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watermark',
  templateUrl: './watermark.component.html',
  styleUrls: ['./watermark.component.scss']
})
export class WatermarkComponent implements OnInit{

  public imageSrc: any = 'assets/img/dummy-logo.png';
  public file: File | undefined;
  public msg: String = "";
  public metadata:Object = "";
  public isVisible: boolean = false;
  public lastButtonClicked: String = "";
  public watermark: String = '';
  public onWatermarking: boolean = false;
  public watermark_error: boolean = false;
  public resultImage: String = 'assets/img/dummy-logo.png';
  public notImage: boolean = false;
  
  constructor(private cd: ChangeDetectorRef, private http: HttpClient){
    this.metadata = "";
    this.isVisible = false;
    this.watermark_error = false;
    this.notImage = false;
  }

  ngOnInit(): void {
    this.metadata = "";
    this.isVisible = false;
    this.watermark_error = false;
    this.notImage = false;
  }

  onKey(event: any) {
    this.watermark = event.target.value;
    this.cd.detectChanges();
  }

  onFileSelected(event: any) {
    this.notImage = false;
    console.log(this.watermark);
    this.resultImage = 'assets/img/dummy-logo.png';
    this.imageSrc = 'assets/img/dummy-logo.png';
    this.watermark_error = false;
    this.file = <File>event.target.files[0];
    var mimeType = event.target.files[0].type;

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
    
    console.log(this.watermark, " : the watermark");
    if(this.watermark == ''){
      this.watermark_error = true;
    }
    else if (this.file != null) {
      this.watermark_error = false;
      this.resultImage = 'assets/img/dummy-logo.png';
      this.imageSrc = 'assets/img/dummy-logo.png';
      this.cd.detectChanges();
      this.onUpload_watermark();
    }
  }

  async onUpload_watermark() {
    if (!this.file) {
      console.log('No file selected');
    } else {
      if (this.watermark == '') {
        this.watermark_error = true;
        this.isVisible = false;
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
          watermark: `watermark ${this.watermark}`,
        };

        this.http
          .get('http://localhost:5000/get_watermark', {
            responseType: 'blob',
            headers: new HttpHeaders(headerDict),
          })
          .subscribe(
            (response) => {
              this.createImageFromBlob(response);
              const reader = new FileReader();
              reader.readAsDataURL(response);
              reader.onloadend = () => {
                this.resultImage = reader.result as string;
                this.cd.detectChanges();
              };
              this.isVisible = false;
              this.cd.detectChanges();
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }

  async postImage(data: any): Promise<any> {
    const token = localStorage.getItem('secret');
    var jwt: String = 'mamama are mere';

    if (token) {
      console.log('the token exists! ');
      jwt = token;
    } else {
      // handle the case where the token is null
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

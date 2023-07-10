import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sanitizeIdentifier } from '@angular/compiler';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-pixelplot',
  templateUrl: './pixelplot.component.html',
  styleUrls: ['./pixelplot.component.scss'],
})
export class PixelplotComponent implements OnInit {
  // @ViewChild('chart') el!: ElementRef;
  public notImage: boolean = false;

  public red:any = [];
  public green:any = [];
  public blue:any = [];

  public graph = {
    data: [
      {
        x: [255, 2, 3],
        y: [56, 6, 3],
        z: [9, 3, 10], // added z-coordinates
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          color: this.calculateColors([255, 2, 3], [56, 240, 3], [9, 3, 10]),
        },
      },
      // 2D bar plot remains the same
      // { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
    ],
    layout: {
      width: 780,
      height: 780,
      scene: {
        // scene property for 3D plot
        xaxis: { title: 'RED' },
        yaxis: { title: 'GREEN' },
        zaxis: { title: 'BLUE' },
      },
    },
  };

  calculateColors(
    xValues: number[],
    yValues: number[],
    zValues: number[]
  ): string[] {
    const colors = [];

    for (let i = 0; i < xValues.length; i++) {
      const r = xValues[i];
      const g = yValues[i];
      const b = zValues[i];

      // Convert the values to an RGB color string
      const color = `rgb(${r},${g},${b})`;

      colors.push(color);
    }
    return colors;
  }

  public imageSrc: any = 'assets/img/liberty.jpg';
  public file: File | undefined;
  public msg: String = '';
  public metadata: Object = '';
  public spinner: boolean = false;
  public lastButtonClicked: String = '';
  public watermark: String = '';
  public onWatermarking: boolean = false;
  public watermark_error: boolean = false;
  public resultImage: String = 'assets/img/liberty.jpg';

  constructor(private cd: ChangeDetectorRef, private http: HttpClient) {
    this.metadata = '';
    this.spinner = false;
    this.watermark_error = false;
    this.notImage = false;
  }

  ngOnInit(): void {
    this.metadata = '';
    this.spinner = false;
    this.watermark_error = false;
    this.notImage = false;
  }

  onKey(event: any) {
    this.watermark = event.target.value;
  }

  onFileSelected(event: any) {
    this.notImage = false;
    this.resultImage = 'assets/img/liberty.jpg';
    this.imageSrc = 'assets/img/liberty.jpg';
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

    if (this.file != null) {
      this.resultImage = 'assets/img/liberty.jpg';
      this.imageSrc = 'assets/img/liberty.jpg';
      this.cd.detectChanges();
      this.onUpload_pixelPlot();
    }
  }

  async onUpload_pixelPlot() {
    if (!this.file) {
      console.log('No file selected');
      // console.log(this.file);
    } else {
      const formData = new FormData();
      formData.append('file', this.file);
      console.log(typeof this.file);

      this.spinner = true;
      const response = await this.postImage(formData);
      console.log(response);
 
      this.cd.detectChanges();
      const token = localStorage.getItem('secret');
      var jwt: String = 'empty';

      if (token) {
        console.log('the token exists! ');
        jwt = token;
        // console.log(token)
      } else {
        // handle the case where the token is null
        console.log('The token is null!!');
      }

      const headerDict = {
        jwt: `Bearer ${jwt}`,
      };

      this.http.get('http://localhost:5000/get_pixelplot', {
          headers: new HttpHeaders(headerDict),
        })
        .subscribe(
          (response) => {

            if(response['red' as keyof typeof response] != null){
              this.red = (response['red' as keyof typeof response]);
            }

            if(response['green' as keyof typeof response] != null){
              this.green = (response['green' as keyof typeof response]);
            }

            if(response['blue' as keyof typeof response] != null){
              this.blue = (response['blue' as keyof typeof response]);
            }
            
            var dimensions = [];
            for(var i=0; i < this.red.length; i++){
              dimensions.push(2);
            }

            this.graph = {
              data: [
                {
                  x: this.red,
                  y: this.green,
                  z: this.blue, // added z-coordinates
                  type: 'scatter3d',
                  mode: 'markers',
                  marker: { 
                    color: this.calculateColors(this.red, this.green, this.blue),
                  },
                },
                // 2D bar plot remains the same
                // { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
              ],
              layout: {
                width: 780,
                height: 780,
                scene: {
                  // scene property for 3D plot
                  xaxis: { title: 'X Axis' },
                  yaxis: { title: 'Y Axis' },
                  zaxis: { title: 'Z Axis' },
                },
              },
            };
            this.spinner = false;
            this.cd.detectChanges();
          }
        );
    }
  }
  // xaxis: { title: 'RED' },
  //       yaxis: { title: 'GREEN' },
  //       zaxis: { title: 'BLUE' },

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

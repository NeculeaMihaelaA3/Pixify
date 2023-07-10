import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

interface Type {
  value: string;
}

@Component({
  selector: 'app-type-convertor',
  templateUrl: './type-convertor.component.html',
  styleUrls: ['./type-convertor.component.scss']
})
export class TypeConvertorComponent {
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
  public selected_format: Type = {value: ''};
  public selected_convert: Type = {value: ''};

  public types: Type[] = [
    {value: 'JPEG'},
    {value: 'PNG'},
    {value: 'BMP'},
    {value: 'GIF'},
    {value: 'WEBP'},
  ];

  constructor(private cd: ChangeDetectorRef, private http: HttpClient) {
    this.isVisible = false;
    this.notImage = false;
  }

  on_selection_format(event: any) {
    this.selected_format = event.value;
    this.notImage = false;
    this.cd.detectChanges();
    console.log('Selected format', this.selected_format);
  }

  on_selection_convert(event: any) {
    this.selected_convert = event.value;
    this.notImage = false;
    this.cd.detectChanges();
    console.log('Selected convert:', this.selected_convert);
  }

  ngOnInit(): void {
    this.isVisible = false;
    this.visible = false;
    this.notImage = false;
  }

  onFileSelected(event: any) {
    console.log("intra aici");
    this.resultImage = 'assets/img/dummy-logo.png';
    this.imageSrc = 'assets/img/dummy-logo.png';
    this.file = <File>event.target.files[0];
    var mimeType = event.target.files[0].type;
    this.notImage = false;
    // this.selected_convert = {value: ''};
    // this.selected_format = {value: ''};

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      this.selected_convert = {value: ''};
      this.selected_format = {value: ''};
      this.notImage = true;
      this.cd.detectChanges();
      return;
    }

    if(this.selected_convert['value'] == "" && this.selected_format['value'] == ""){
      this.msg = 'You need to select the formats!';
      this.notImage = true;
      this.cd.detectChanges();
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
      // this.selected_convert = {value: ''};
      // this.selected_format = {value: ''};
      this.cd.detectChanges();
      this.onUpload_convert_format();
    }
  }

  async onUpload_convert_format() {
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
        original: `Original ${this.selected_format['value']}`, 
        convert: `Format ${this.selected_convert['value']}`, 
      };
     
      console.log(this.selected_convert['value']);

      this.http
        .get('http://localhost:5000/get_convert_format', {
          headers: new HttpHeaders(headerDict),
          responseType: 'blob',
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
          (error: any) => {
            console.log(error);
        });
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

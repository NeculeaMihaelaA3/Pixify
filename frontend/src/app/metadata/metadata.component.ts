import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent implements OnInit{

  public imageSrc: any = 'assets/img/dummy-logo.png';
  public file: File | undefined;
  public msg: String = "";
  public metadata: Object = "";
  public isVisible: boolean = false;
  public lastButtonClicked: String = "";
  public notImage: boolean = false;
  
  constructor(private cd: ChangeDetectorRef, private http: HttpClient){
    this.metadata = "";
    this.isVisible = false;
    this.notImage = false;
  }

  ngOnInit(): void {
    this.metadata = "";
    this.isVisible = false;
    this.notImage = false;
  }
  
  onButtonClick(buttonName: string) {
    this.lastButtonClicked = buttonName;
  }

  onFileSelected(event: any){
    this.notImage = false;
    this.file = <File>event.target.files[0];
    var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
      this.imageSrc = 'assets/img/dummy-logo.png';
      this.metadata = "";
      this.notImage = true;
      this.cd.detectChanges();
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
			this.msg = "";
			this.imageSrc = reader.result; 
      this.cd.detectChanges(); // Trigger change detection
		}
  }

  function(): void{
    const myAbsolutelyNotNullElement = window.document.getElementById("my-file")!;
    myAbsolutelyNotNullElement.click();
  }

  async postImage(data: any): Promise<any> {
    const token = localStorage.getItem('secret');
    var jwt:String = "empty";
    //console.log(token);
    if (token) {
      console.log("the token exists! ");
      jwt = token 
      // console.log(token)
    } else {
      // handle the case where the token is null
      console.log("The token is null!!");
    }

    const headerDict = {
      'jwt': `Bearer ${jwt}`,
    }
    const response = await this.http.post('http://localhost:5000/photoMetadata', data, {headers: new HttpHeaders(headerDict)}).toPromise();
    return response;
  }

  async getMetadata(){
    const token = localStorage.getItem('secret');
    var jwt:String = "mamama are mere";
    //console.log(token);
    if (token) {
      console.log("the token exists! ");
      jwt = token 
      // console.log(token)
    } else {
      // handle the case where the token is null
      console.log("The token is null!!");
    }
    // console.log(token)
    const headerDict = {
      'jwt': `Bearer ${jwt}`,
    }
    
    if(!this.file){
      console.log("No file selected");
      // console.log(this.file);
    }else{
      const formData = new FormData();
      formData.append('file', this.file);
      console.log(typeof(this.file));
      
      this.isVisible = true;
      const response = await this.postImage(formData);
      console.log(response);
      //this.isVisible = true;

      this.cd.detectChanges();
      console.log("!!!!!!!!!!!!!!!!!!!")

      this.http.get('http://localhost:5000/getmetadata', {headers: new HttpHeaders(headerDict)}).subscribe(
        response => {
          this.metadata = response;
          this.isVisible = false;
          // console.log(this.metadata);
          this.cd.detectChanges();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  copy(){
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log(`Copied to clipboard !!`);
        })
        .catch((error) => {
          console.error(`Error copying to clipboard: ${error}`);
        });
    };
    
    const textArea = window.document.getElementById('metadata') as HTMLTextAreaElement;
    const text = textArea.value;
    copyToClipboard(text);
  }
}

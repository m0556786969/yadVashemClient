import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddImageComponent } from "../add-image/add-image.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
//צריך לעשות import לבחירת תמונה


@Component({
  selector: 'app-scan-collection',
  standalone: true,
  templateUrl: './scan-collection.component.html',
  styleUrls: ['./scan-collection.component.css', '/node_modules/bootstrap/dist/css/bootstrap.css'],
  imports: [CommonModule, FormsModule, AddImageComponent, HttpClientModule]
})
export class ScanCollectionComponent {

  constructor(private http: HttpClient) { }
  collection: number = 4567;
  title!: string;
  nextImage!: number;
  originalNextImage!: number;
  array: {
    imageIndex: number,
    hasBack: boolean,
    path: string,
    file: File | undefined,
    backPath: string,
    backFile: File | undefined,
    savedSuccessfully: boolean
  }[] = [];
  addCard() {
    if (this.title)
      this.array.push({
        imageIndex: this.nextImage,
        hasBack: false,
        path: `images/${this.collection}/${this.Concatenate0(this.nextImage)}.jpg`,
        file: undefined,
        backPath: `images/${this.collection}/${this.Concatenate0(this.nextImage++)}_XX.jpg`,
        backFile: undefined,
        savedSuccessfully: false
      });
  }
  removeLast() {
    this.nextImage--;
    this.array.pop();
  }

  async save() {
    for (let i = 0; i < this.array.length; i++) {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(`https://localhost:7295/api/Item`, {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({
            collectionSymbolization: this.collection,
            title: this.title,
            imageIndex: this.array[i].imageIndex,
            path: this.array[i].path,
            backPath: this.array[i].hasBack ? this.array[i].backPath : null
          })
        });
        if (response.ok) this.array[i].savedSuccessfully = true;
      }
      catch (err) {
        console.log("ERROR", err);
      }


      const file = this.array[i].file;
      if (!file) continue;
      const formData = new FormData();
      formData.append('image', file);

      formData.append('data', JSON.stringify({
        collectionSymbolization: this.collection,
        title: this.title,
        imageIndex: this.array[i].imageIndex,
        path: this.array[i].path,
        backPath: this.array[i].hasBack ? this.array[i].backPath : null
      }));
      console.log("collection", this.collection);


      this.http.post(`https://localhost:7295/api/Image/${this.collection}/${this.Concatenate0(this.array[i].imageIndex)}.jpg`, formData).subscribe(
        (response) => {
          console.log('Image uploaded successfully', response);
          // Handle success response from the server
        },
        (error) => {
          console.error('Error uploading image', error);
          // Handle error response from the server
        }
      );
      if (this.array[i].hasBack) {
        const backFormData = new FormData();
        const backFile = this.array[i].backFile;
        if (!backFile) continue;
        backFormData.append('image', backFile);
        this.http.post(`https://localhost:7295/api/Image/${this.collection}/${this.Concatenate0(this.array[i].imageIndex)}_XX.jpg`, backFormData).subscribe(
          (response) => {
            console.log('Image uploaded successfully', response);
            // Handle success response from the server
          },
          (error) => {
            console.error('Error uploading image', error);
            // Handle error response from the server
          }
        );
      }
    }
  }

  // uploadImage(formData: FormData) {
  //   return ;
  // }

  async bring() {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      let response = await fetch(`https://localhost:7295/api/Collection/${this.collection}`);
      /*let response = await fetch('https://localhost:7295/api/Item', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          itemId: 12120,
          collectionSymbolization: this.collection,
          title: "ghjgjhghjgj"
        })
      });*/
      console.log(response);
      const c = await response.json();
      console.log(c);
      this.title = c.title;
      this.nextImage = c.newImgNumber;
      this.originalNextImage = c.newImgNumber;

    } catch (err) {
      console.log(err);

    }
  }

  Concatenate0(number:number)
    {
        let num = number.toString();
        while (num.length < 5)
        {
            num = "0" + num;
        }

        return num;
    }
}

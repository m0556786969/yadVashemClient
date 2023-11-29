import { EventEmitter, Output, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-choose-image',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './choose-image.component.html',
  styleUrls: ['./choose-image.component.css', '/node_modules/bootstrap/dist/css/bootstrap.css']
})

export class ChooseImageComponent {
  ///////////
  @Input() selectedImage: File | undefined;
  @Output() onSelectImage = new EventEmitter<File>();
  /////////
  //@Input() imgDetails!: { selectedImage: File | undefined; };

  // selectedImage: File | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef;

  openFileExplorer() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.onSelectImage.emit(file);
    if (file) {
      // Here, you can store the selected file in a variable or process it as needed
      this.selectedImage = file;
    }
  }
}

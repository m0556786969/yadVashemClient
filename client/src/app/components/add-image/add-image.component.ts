import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChooseImageComponent } from "../choose-image/choose-image.component";
import {MatIcon, MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-add-image',
  standalone: true,
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.css', '/node_modules/bootstrap/dist/css/bootstrap.css'],
  imports: [CommonModule, FormsModule, ChooseImageComponent, MatIconModule]
})
export class AddImageComponent {
  imageSelected($event: File) {
    this.imgDetails.file = $event;
  }
  backImageSelected($event: File) {
    this.imgDetails.backFile = $event;
  }
  @Input() imgDetails!: {
    imageIndex: number,
    hasBack: boolean,
    path: string,
    file: File | undefined,
    backPath: string,
    backFile: File | undefined,
    savedSuccessfully: boolean
  };
  @Input() isLast!: boolean;
  @Output() remove = new EventEmitter();
}

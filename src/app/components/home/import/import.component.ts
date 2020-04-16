import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/http/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  selectedFile: File;
  jsonToUpload: JSON;

  constructor(private roomService: RoomService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, 'UTF-8');
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        const parsed = JSON.parse(fileReader.result);
        this.jsonToUpload = parsed.exportData;
        console.log(this.jsonToUpload);
        console.log(parsed);
      }
    };
    fileReader.onerror = (error) => {
      console.log(error);
    };
  }

  onUpload() {
    this.roomService.importv2Room(this.jsonToUpload).subscribe(room => {
      this.router.navigate([`creator/room/${room.id}`]);
    });
  }

}

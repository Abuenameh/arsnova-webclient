import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/util/notification.service';
import { ContentType } from '../../../models/content-type.enum';
import { Content } from '../../../models/content';

@Component({
  selector: 'app-content-delete',
  templateUrl: './content-delete.component.html',
  styleUrls: ['./content-delete.component.scss']
})
export class ContentDeleteComponent implements OnInit {
  ContentType: typeof ContentType = ContentType;
  format: ContentType;
  content: Content;

  constructor(private router: Router,
              private notification: NotificationService,
              public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close('abort');
  }

  closeDialog(action: string) {
    this.dialogRef.close(action);
  }

  ngOnInit() {
  }
}

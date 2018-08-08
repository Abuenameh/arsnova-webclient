import { Component, OnInit } from '@angular/core';
import { Room } from '../../../models/room';
import { RoomService } from '../../../services/http/room.service';
import { Router } from '@angular/router';
import { RegisterErrorStateMatcher } from '../../dialogs/register/register.component';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { NotificationService } from '../../../services/util/notification.service';

export class JoinErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-room-join',
  templateUrl: './room-join.component.html',
  styleUrls: ['./room-join.component.scss']
})
export class RoomJoinComponent implements OnInit {

  room: Room;
  demoId = '82458028';

  roomFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  matcher = new RegisterErrorStateMatcher();

  constructor(private roomService: RoomService,
              private router: Router,
              public notificationService: NotificationService
  ) {
  }

  ngOnInit() {
  }

  getRoom(id: string): void {
    this.roomService.getRoomByShortId(id)
      .subscribe(room => {
        this.room = room;
        if (!room) {
          this.notificationService.show(`No room was found with id: ${id}`);
        } else {
          this.roomService.addToHistory(this.room.id);
          this.router.navigate([`/participant/room/${this.room.shortId}`]);
        }
      });
  }

  joinRoom(id: string): void {
    if (!this.roomFormControl.hasError('required') && !this.roomFormControl.hasError('minlength')) {
      this.getRoom(id);
    }
  }

  joinDemo(): void {
    this.getRoom(this.demoId);
  }
}

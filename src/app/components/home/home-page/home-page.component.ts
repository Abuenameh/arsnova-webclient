import { Component, OnInit, Renderer2 } from '@angular/core';
import { EventService } from '../../../services/util/event.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  deviceType: string;

  constructor(
    private eventService: EventService,
    private liveAnnouncer: LiveAnnouncer,
    private _r: Renderer2
  ) {
  }



  ngOnInit() {
    this.deviceType = localStorage.getItem('deviceType');
    this.announce();
    this._r.listen(document, 'keyup', (event) => {
      if (event.keyCode === 49 && this.eventService.focusOnInput === false) {
        document.getElementById('session_id-input').focus();
      } else if (event.keyCode === 51 && this.eventService.focusOnInput === false) {
        document.getElementById('new_session-button').focus();
      } else if (event.keyCode === 52 && this.eventService.focusOnInput === false) {
        document.getElementById('language-menu').focus();
      } else if ((event.keyCode === 57 || event.keyCode === 27) && this.eventService.focusOnInput === false) {
        this.announce();
      } else if (event.keyCode === 27 && this.eventService.focusOnInput === true) {
        document.getElementById('session_enter-button').focus();
      }
    });
  }

  public announce() {
    // this.liveAnnouncer.announce('Willkommen auf dieser Seite' + document.getElementById('announcer_text').textContent, 'assertive');
    this.liveAnnouncer.announce('Sie befinden sich auf der Startseite von fragpunktjetzt. ' +
      'Drücken Sie die Taste 1 um einen Sitzungs-Code einzugeben, die Taste 2 um auf das Sitzungs-Menü zu gelangen, ' +
      'die Taste 3 um eine neue Sitzung zu erstellen, die Taste 4 um zur Sprachauswahl zu gelangen, ' +
      'oder die Taste 9 um diese Ansage zu wiederholen.', 'assertive');
  }
}

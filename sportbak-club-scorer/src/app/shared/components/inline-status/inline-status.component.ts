import { Component, Input } from '@angular/core';
import { StatusService } from '../../../status/status.service';

@Component({
  selector: 'sbk-inline-status',
  templateUrl: './inline-status.component.html',
  styleUrls: ['./inline-status.component.scss']
})
export class InlineStatusComponent {
  @Input() showHealthyStatus = false;
  constructor(public statusService: StatusService) {}
}
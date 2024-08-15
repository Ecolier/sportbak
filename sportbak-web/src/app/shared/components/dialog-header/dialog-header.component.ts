import {Component, Input} from '@angular/core';
import {DialogService} from '../dialog/dialog.service';

@Component({
  selector: 'sbk-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss'],
})
export class DialogHeaderComponent {
  @Input() title?: string;
  constructor(private dialogService: DialogService) {}
  close() {
    this.dialogService.close();
  }
}

import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'spinning-loader',
  templateUrl: './spinning-loader.component.html',
  styleUrls: ['./spinning-loader.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpinningLoaderComponent implements OnInit {
  @Input() isMedium:boolean = false;
  @Input() hasCtn:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
}

import {trigger, state, style, transition, animate, query, animateChild} from '@angular/animations';
import {AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {SafeStyle} from '@angular/platform-browser';

export type ScorerEditingState = 'editing' | 'idle';

@Component({
  selector: 'sbk-scorer-editable',
  templateUrl: './scorer-editable.component.html',
  styleUrls: ['./scorer-editable.component.scss'],
  animations: [
    trigger('bubble', [
      state('idle', style({
        'border-radius': '40px',
        'width': '40px',
        'inset': 'auto',
        'height': '40px',
      })),
      state('editing', style({
        'border-radius': '4px',
        'width': '100%',
        'height': '100%',
        'inset': '0px',
      })),
      transition('idle <=> editing', [
        animate('0ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
    ]),
    trigger('changeEditingState', [
      transition('idle => editing', [
        query('@bubble', animateChild()),
      ]),
    ]),
  ],
})
export class ScorerEditableComponent implements AfterViewInit {
  @HostListener('keydown', ['$event'])
  onkeyDown(event: KeyboardEvent) {
    if (this.isEditing) {
      if (event.key === 'Enter') {
        this.toggleEditing();
        this.nameChange.next(this.name);
        this.scoreChange.next(this.score);
      }
    }
  }
  @HostBinding('style') get style(): SafeStyle {
    return {
      'flex-direction': this.rightLayout ? 'row-reverse' : 'row',
    };
  }

  @Input() rightLayout = false;
  @Input() name: string;
  @Input() score: number;
  @ViewChild('firstInput') firstTextInput!: ElementRef<HTMLInputElement>;
  @Output() nameChange = new EventEmitter<string>();
  @Output() scoreChange = new EventEmitter<number>();
  isEditing = false;
  get editingstate(): ScorerEditingState {
    return this.isEditing ? 'editing' : 'idle';
  }
  ngAfterViewInit() {
    this.firstTextInput.nativeElement.disabled = true;
  }
  toggleEditing() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.firstTextInput.nativeElement.disabled = false;
      this.firstTextInput.nativeElement.focus();
    } else {
      this.firstTextInput.nativeElement.disabled = true;
      this.firstTextInput.nativeElement.blur();
    }
  }
}

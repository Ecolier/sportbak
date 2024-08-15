import {Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TeamModel} from 'src/app/shared/models/team/team.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {SportConstants} from 'src/app/shared/values/sport';

@Component({
  selector: 'score-selector',
  templateUrl: './score-selector.component.html',
  styleUrls: ['./score-selector.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScoreSelectorComponent extends FBKComponent {
  team1GoalsInput: number = 0;
  team2GoalsInput: number = 0;
  team1Sets: number[];
  team2Sets: number[];
  @Input() team1: TeamModel;
  @Input() team2: TeamModel;
  input1Focused: boolean = false;
  input2Focused: boolean = false;
  sportConstants = SportConstants;
  @Input() sport: string;
  @Output() onValidateScore = new EventEmitter();
  @Output() onCancelScore = new EventEmitter();
  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'ScoreSelectorComponent');
  }

  fbkOnInit() {
    this.team1Sets = this.team1.sets;
    this.team2Sets = this.team2.sets;
    this.team1GoalsInput = this.team1.goals;
    this.team2GoalsInput = this.team2.goals;
  }

  updateTeam1GoalsInput(value) {
    this.team1GoalsInput = value;
  }
  updateTeam2GoalsInput(value) {
    this.team2GoalsInput = value;
  }

  validate() {
    this.onValidateScore.emit({team1Goals: this.team1GoalsInput, team2Goals: this.team2GoalsInput});
  }

  cancel() {
    this.onCancelScore.emit();
  }

  toggleFocusInput1() {
    this.input1Focused = !this.input1Focused;
  }

  toggleFocusInput2() {
    this.input2Focused = !this.input2Focused;
  }
}

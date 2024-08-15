import {NgModule} from '@angular/core';
import {GameDateComponent} from 'src/app/shared/components/game-date/game-date.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {CompetitionsConfrontationsRankingPlayersComponent} from './components/confrontations-ranking/confrontations-ranking-players/confrontations-ranking-players';
import {CompetitionsConfrontationsRankingTeamsComponent} from './components/confrontations-ranking/confrontations-ranking-teams/confrontations-ranking-teams';
import {FormatInputComponent} from './components/format-input/format-input.component';
import {GameRowComponent} from './components/game-row/game-row.component';
import {GsButtonComponent} from './components/gs-button/gs-button.component';
import {GsModalComponent} from './components/gs-modal/gs-modal.component';
import {InfoLabelComponent} from './components/info-label/info-label.component';
import {ManagerAlertComponent} from './components/manager-alert/manager-alert.component';
import {ManagerCompetitionSpanComponent} from './components/manager-competition-span/manager-competition-span.component';
import {ManagerInputComponent} from './components/manager-input/manager-input.component';
import {ManagerModalComponent} from './components/manager-modal/manager-modal.component';
import {ManagerMultisportChoiceComponent} from './components/manager-multisport-choice/manager-multisport-choice.component';
import {ManagerMultisportCreatorComponent} from './components/manager-multisport-creator/manager-multisport-creator.component';
import {ManagerTeamAdderComponent} from './components/manager-team-adder/manager-team-adder.component';
import {PlayerSelectorComponent} from './components/player-selector/player-selector.component';
import {ShirtSelectorComponent} from './components/shirt-selector/shirt-selector.component';
import {TeamEditorComponent} from './components/team-editor/team-editor.component';
import {FilterDirective} from './directives/filtered-input/filtered-input.directive';
import {MinuteSecondsPipe} from './pipes/minute-seconds.pipe';
import {PluckPipe} from './pipes/pluck.pipe';
import {RequestStatusComponent} from '../calendar/request-status/request-status.component';
import {NotificationIconPipe} from './pipes/notificationIcon.pipe';
import {BadgeComponent} from './components/badge/badge.component';
import {BookingStatusBadgeComponent} from './components/booking-status-badge/booking-status-badge.component';
import {BookingCardComponent} from './components/booking-card/booking-card.component';
import {UserCardComponent} from './components/user-card/user-card.component';
import {AvatarComponent} from './components/avatar/avatar.component';
import {ManagerTextareaComponent} from './components/manager-textarea/manager-textarea.component';
import {TipComponent} from '../../shared/components/tip/tip.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    GameDateComponent,
    FormatInputComponent,
    InfoLabelComponent,
    GsModalComponent,
    GsButtonComponent,
    RequestStatusComponent,
    CompetitionsConfrontationsRankingPlayersComponent,
    CompetitionsConfrontationsRankingTeamsComponent,
    ManagerCompetitionSpanComponent,
    ManagerAlertComponent,
    ManagerInputComponent,
    ManagerModalComponent,
    ManagerMultisportChoiceComponent,
    ManagerMultisportCreatorComponent,
    ManagerTeamAdderComponent,
    PlayerSelectorComponent,
    ShirtSelectorComponent,
    TeamEditorComponent,
    GameRowComponent,
    FilterDirective,
    MinuteSecondsPipe,
    PluckPipe,
    NotificationIconPipe,
    BadgeComponent,
    BookingStatusBadgeComponent,
    BookingCardComponent,
    UserCardComponent,
    AvatarComponent,
    ManagerTextareaComponent,
    TipComponent,
  ],
  exports: [
    GameDateComponent,
    FormatInputComponent,
    InfoLabelComponent,
    GsModalComponent,
    GsButtonComponent,
    RequestStatusComponent,
    CompetitionsConfrontationsRankingPlayersComponent,
    CompetitionsConfrontationsRankingTeamsComponent,
    ManagerCompetitionSpanComponent,
    ManagerAlertComponent,
    ManagerInputComponent,
    ManagerModalComponent,
    ManagerMultisportChoiceComponent,
    ManagerMultisportCreatorComponent,
    ManagerTeamAdderComponent,
    PlayerSelectorComponent,
    ShirtSelectorComponent,
    TeamEditorComponent,
    GameRowComponent,
    FilterDirective,
    MinuteSecondsPipe,
    PluckPipe,
    NotificationIconPipe,
    BadgeComponent,
    BookingStatusBadgeComponent,
    BookingCardComponent,
    UserCardComponent,
    SharedModule,
    AvatarComponent,
    ManagerTextareaComponent,
    TipComponent,
  ],
})
export class ManagerSharedModule {}

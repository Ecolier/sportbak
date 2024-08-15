import {Component, ElementRef, HostBinding, Input, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ManagerProvider} from 'src/app/manager/shared/services/manager.service';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {Field} from 'src/app/shared/models/field.model';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {ManagerMenuService} from '../../layout/manager-menu/manager-menu.service';
import {SessionService} from '../session.service';

export type SessionListViewMode = 'list' | 'grid';
export type SessionListFilter = 'enabled' | 'disabled' | 'unequipped';

@Component({
  selector: 'sbk-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
})
export class SessionListComponent extends FBKComponent implements OnDestroy {
  @Input() @HostBinding('attr.viewMode') viewMode: SessionListViewMode = 'list';
  @Input() filters: SessionListFilter[] = ['enabled', 'disabled', 'unequipped'];

  private _isLoading = true;
  private readonly ngUnsubscribe$ = new Subject<void>();
  private readonly complex = this.managerService.allManagerData$.complex;
  private readonly fields = this.complex.fields;
  private fieldQueryResult: string[] = this.fields.map((field) => field._id);

  videoConnectedFields: Field[] = [];
  videoDisconnectedFields: Field[] = [];
  videoUnsupportedFields: Field[] = [];
  isSearchFocused = false;
  fieldSearchQuery = '';

  constructor(
    private sessionService: SessionService,
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
    private managerService: ManagerProvider,
    protected managerMenuService: ManagerMenuService) {
    super(_refElement, translate, 'SessionListComponent');
  }

  /**
   *
   * @return all fields that should be displayed when filtering and querying through search.
   */
  get allDisplayedFields() {
    const filteredFields = this.getFieldsForFilters(this.filters).map((field) => field._id);
    return filteredFields.filter((x) => this.fieldQueryResult.includes(x));
  }

  /**
   *
   * @param filters an array of filters
   * @return an array of fields which are associated to the given filters
   */
  getFieldsForFilters(filters: SessionListFilter[]) {
    return filters.map((filter) => {
      if (filter === 'enabled') return this.videoConnectedFields;
      if (filter === 'disabled') return this.videoDisconnectedFields;
      if (filter === 'unequipped') return this.videoUnsupportedFields;
    }).reduce((prev, curr) => [...prev, ...curr], []);
  }

  /**
   *
   * @param fieldId the ID of the field to find
   * @return a single field ID equal to the field ID param if it exists in the search results
   */
  findInFieldSearchResults(fieldId: string) {
    return this.fieldQueryResult.find((_fieldId) => _fieldId === fieldId);
  }

  searchForField(query: string) {
    if (query === '') this.fieldQueryResult = this.fields.map((field) => field._id);
    else this.fieldQueryResult = this.fields.filter((field) => field.name.toUpperCase().includes(query.toUpperCase())).map((field) => field._id);
  }

  focusSearch() {
    this.isSearchFocused = true;
  }

  blurSearch() {
    this.isSearchFocused = false;
  }

  hasFilter(filter: SessionListFilter) {
    return this.filters.find((_filter) => _filter === filter);
  }

  toggleFilter(filter: SessionListFilter) {
    if (this.filters.find((_filter) => _filter === filter)) this.filters = this.filters.filter((_filter) => _filter !== filter);
    else this.filters = [...new Set([...this.filters, filter])];
  }

  setViewMode(viewMode: SessionListViewMode) {
    this.viewMode = viewMode;
  }

  ngOnDestroy() {
    this.sessionService.disconnect();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
  }

  fbkOnInit() {
    this.managerMenuService.setActiveMenuItemKey('session');
    this.sessionService.connect(this.fields);
    this.videoUnsupportedFields = this.fields.filter((field) => field['video_enabled'] === false);
    this.sessionService.isConnected$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(([fieldId, isConnected]) => {

      // This syntax using Set behavior allows us to merge two arrays and remove duplicate objects
      this.videoUnsupportedFields = [
        ...new Set([
          ...this.videoUnsupportedFields,
          this.fields.find((field) => field._id === fieldId)]),
      ];
      if (isConnected) {
        this.videoConnectedFields = [
          ...new Set([
            ...this.videoConnectedFields,
            this.fields.find((field) => field._id === fieldId)]),
        ];

        // The field is no more disconnected nor unsupported at this point
        this.videoDisconnectedFields = this.videoDisconnectedFields.filter((field) => field._id !== fieldId);
        this.videoUnsupportedFields = this.videoUnsupportedFields.filter((field) => field._id !== fieldId);
      } else {
        this.videoDisconnectedFields = [
          ...new Set([
            ...this.videoDisconnectedFields,
            this.fields.find((field) => field._id === fieldId)]),
        ];
        this.videoConnectedFields = this.videoConnectedFields.filter((field) => field._id !== fieldId);
        this.videoUnsupportedFields = this.videoUnsupportedFields.filter((field) => field._id !== fieldId);
      }
      this._isLoading = false;
      this.reorderFields();
    });
  }

  reorderFields() {
    this.videoConnectedFields = this.videoConnectedFields.sort((fieldA, fieldB) => fieldA.position - fieldB.position);
    this.videoDisconnectedFields = this.videoDisconnectedFields.sort((fieldA, fieldB) => fieldA.position - fieldB.position);
    this.videoUnsupportedFields = this.videoUnsupportedFields.sort((fieldA, fieldB) => fieldA.position - fieldB.position);
  }

  get isLoading() {
    return this._isLoading;
  }
}

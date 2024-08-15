
# SportBak website

The official website for SportBak.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.3.

## Commands

Start the app: ``` npm start ```

Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

Build the app: ``` npm run-script build ```

The built files are in /dist/finticks-demo.

## General 

As a general rule of thumb, do your best to follow the **LIFT** guidelines: 

- **L**ocate: make locating code intuitive, simple, and fast. Use descriptive file names and variable names. Long names are fine. Avoid using abbreviation except for common, well-known ones (e.g. "btn" for button, "mgr" for manager).

- **I**dentify: name the file such that you instantly know what it contains and represents.

- **F**lat: keep a flat folder structure as long as possible. (consider creating subfolders when a folder reaches 7-9 items).

- **T**ry to be DRY : DON'T REPEAT YOURSELF! (Without sacrificing readability).

(_source: https://angular.io/guide/styleguide#application-structure-and-ngmodules_)

## Modules

_NgModules are a great way to organize an application and keep code related to a specific functionality or feature separate from other code. Use NgModules to consolidate components, directives, and pipes into __cohesive blocks of functionality__. Focus each block on a feature or business domain, a workflow or navigation flow, a common collection of utilities, or one or more providers for services._

(source: https://angular.io/guide/module-types)

__TL;DR__ Use modules when it makes sense to group multiple components into a logical unit (e.g. Calendar is a module because it groups a DayComponent, a CalendarMenuComponent, etc.)

## Components

There is a set of questions that should spring to mind before creating any component :
- Might such a component already exist?
  - Yes: use the shared component (see next section).
  - Yes but I need a different style for it:
    - It is a style intrinsic to the component: change the component.scss
    - It is a style that contextually changes (e.g. add margin to suit the layout): style it from parent component.
  - No:
    - Will my component need to be reused?
      - Yes: create it and declare it in a shared module (see next section).
      - No: create it and declare it in the module it will be used in.

## Shared Components

When creating a module, don't forget to import common modules to have access to generic components and services: 

- SharedModule represents a collection of components and services reused globally

- ManagerSharedModule represents a collection of components and services reused throughout the manager module.

```typescript
@NgModule({
  imports: [ManagerSharedModule],
  declarations: [
    MyFirstComponent,
    MySecondComponent
  ],
  exports: [
    ManagerSharedModule, // re-export ManagerSharedModule so that it is available to all modules that import this module
    MyFirstComponent,
    MySecondComponent
  ]
})
```

## Components and service Library

### Toast

A toast is a component that visually represents the feedback of a user action. (e.g. when a user fails to authenticate, we might notify them with a discardable piece of UI).

#### Open a toast

```typescript
// my.component.ts
constructor(private toastService: ToastService) {}

function onFormSubmitted(username: string) {
  this.toastService.open(`Thank you, ${username}, for your feedback!`);
}
```

### Dialog

A dialog is a modal window (meaning any other action is impossible unless we deal with it) that can be discarded by clicking on the overlay or on a close button. Due to its nature, it is usually found outside the regular data and document flow.

#### Open and close a dialog

```typescript
// my-modal-content.component.ts
class BookingComponent {
  username: string;
  field: string;

  constructor(
    @Inject(SBK_DIALOG_DATA) private data
    private dialogService: DialogService) {
    Object.assign(this, data); // properties username and field are assigned values
  }

  function cancelBooking() {
    this.dialogService.close();
  }
}

// my.component.ts
constructor(private dialogService: DialogService) {}

function createBooking(username: string, field: string) {
  this.dialogService.open(BookingComponent, { player: username , field: field });
}
```

### Button

```html
<sbk-btn (click)="sayHelloWorld()" class="outline round">
  <!-- TODO: create other types of content depending on future needs -->
  <sbk-btn-title>What do we say to the world ?</sbk-btn-title>
</sbk-btn>
```

Available button classes (feel free to add more in the fbk-btn.component.scss):
```
outline
round
(small | medium | large)
(light | dark)
(validate | success) | (error | cancel) // semantic names for color
```

## Git branches

A feature is first pushed to the develop branch. 
Then this branch is uploaded to the website for testing on the dev URL.
Once everything has been tested, merge the develop branch into the prod branch.
Then upload the prod branch on the official website URL.

This gives us the possibility to do a quick change on the official website(for example change of image/video/text) and not have to wait before the dev version is stable before we put this change on the official website.

## Team training

Once a new feature has been implemented, if the feature requires team training (meaning teaching the team and showing them how the new feature works) DO NOT archive the trello card for the feature. Instead, slide it into the "Formation Commerciaux et Support" column.
And organise a quick meeting with the members of the team to show the feature.
This makes sure that the team is up to date with what can and can't be done on the website when they give a presentation to a prospect.


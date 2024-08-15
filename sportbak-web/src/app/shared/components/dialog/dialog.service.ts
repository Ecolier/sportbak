import {ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, InjectionToken, Injector, RendererFactory2, Type} from '@angular/core';
import {DialogComponent} from './dialog.component';

type DialogComponentRef = ComponentRef<DialogComponent>;
export const FBK_DIALOG_DATA = new InjectionToken('fbk.dialog.data');

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  openDialog?: DialogComponentRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2,
    private injector: Injector,
    private applicationRef: ApplicationRef) {}

  open<T>(contentComponentType: Type<T>, data?: any): [DialogComponentRef, ComponentRef<T>] {
    if (this.openDialog) this.openDialog.destroy();
    const dialogComponentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const dialogComponentRef = dialogComponentFactory.create(this.injector);

    const contentDataInjector = Injector.create({
      providers: [
        {provide: FBK_DIALOG_DATA, useValue: data},
      ],
      parent: this.injector,
    });

    const contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(contentComponentType);
    const contentComponentRef = contentComponentFactory.create(contentDataInjector);

    dialogComponentRef.instance.dialogContentRef = contentComponentRef;

    this.applicationRef.attachView(dialogComponentRef.hostView);
    const renderer = this.rendererFactory.createRenderer(null, null);
    renderer.appendChild(this.applicationRef.components[0].location.nativeElement, dialogComponentRef.location.nativeElement);
    this.openDialog = dialogComponentRef;
    return [dialogComponentRef, contentComponentRef];
  }

  close() {
    this.openDialog.destroy();
  }
}


import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, InjectionToken, Injector, RendererFactory2 } from '@angular/core';
import { ToastComponent } from './toast.component';

export const SBK_DIALOG_ID = new InjectionToken('sbk.dialog.id');
export const SBK_TOAST_OPTIONS = new InjectionToken('sbk.dialog.options');

const defaultDelay = 3000;

type ToastComponentRef = ComponentRef<ToastComponent>

const randomBytes = (size: number): String => {
  const buffer: number[] = []
  for (let i = 0; i != size; ++i) {
    buffer.push(Math.floor(Math.random() * 255))
  }
  return String.fromCharCode(...buffer);
}

export interface ToastOptions {
  class: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  openToasts = new Map<string, ToastComponentRef>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2,
    private injector: Injector,
    private applicationRef: ApplicationRef) {}

  open(message: string, options?: ToastOptions): ComponentRef<ToastComponent> {
    if (this.openToasts.size !== 0) this.openToasts.forEach((toastRef, id) => this.close(id));
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ToastComponent); 
    const toastId = randomBytes(8).toString();
    const toastIdInjector = Injector.create({
      providers: [
        { provide: SBK_DIALOG_ID, useValue: toastId },
        { provide: SBK_TOAST_OPTIONS, useValue: options }
      ], parent: this.injector
    })
    const toastComponent = componentFactory.create(toastIdInjector);
    toastComponent.instance.message = message;
    toastComponent.instance.delay = options?.delay || defaultDelay;
    this.openToasts.set(toastId, toastComponent);
    this.applicationRef.attachView(toastComponent.hostView);
    const renderer = this.rendererFactory.createRenderer(null, null);
    renderer.appendChild(this.applicationRef.components[0].location.nativeElement, toastComponent.location.nativeElement);
    return toastComponent;
  }

  close(id: string) {
    this.openToasts.get(id)?.destroy();
    this.openToasts.delete(id);
  }
}
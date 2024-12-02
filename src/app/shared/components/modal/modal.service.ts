// modal.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface ModalConfig {
  title: string;
  subtitle: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = signal<{
    isVisible: boolean;
    config: ModalConfig | null;
  }>({
    isVisible: false,
    config: null,
  });

  private timeoutId?: number;

  get isVisible() {
    return this.modalState().isVisible;
  }

  get config() {
    return this.modalState().config;
  }

  show(config: ModalConfig) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.modalState.set({
      isVisible: true,
      config,
    });

    if (config.duration) {
      this.timeoutId = window.setTimeout(() => {
        this.hide();
      }, config.duration);
    }
  }

  public hide() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.modalState.set({
      isVisible: false,
      config: null,
    });
  }

  showError(message: string, duration: number = 5000) {
    this.show({
      title: 'Error',
      subtitle: message,
      duration,
    });
  }

  showSuccess(message: string, duration: number = 3000): Observable<void> {
    this.show({
      title: 'Éxito',
      subtitle: message,
      duration,
    });

    return new Observable<void>((subscriber) => {
      setTimeout(() => {
        subscriber.next();
        subscriber.complete();
      }, duration);
    });
  }
}

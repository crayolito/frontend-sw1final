import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="modalService.isVisible"
      class="fixed inset-0 min-h-screen w-full flex items-center justify-center z-50 px-6 py-8"
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>

      <!-- Modal -->
      <div
        class="animate-modal-appear relative w-full max-w-2xl bg-white rounded-xl shadow-xl"
      >
        <!-- Contenido -->
        <div class="py-12 px-14">
          <!-- Icono -->
          <div class="mb-8 flex justify-center">
            <!-- Error Icon -->
            <img
              *ngIf="modalService.config?.title === 'Error'"
              src="assets/modal-error.png"
              class="h-32 w-32"
              alt="Error icon"
            />

            <!-- Success Icon -->
            <img
              *ngIf="modalService.config?.title === 'Éxito'"
              src="assets/modal-correcto.png"
              class="h-32 w-32"
              alt="Success icon"
            />
          </div>

          <!-- Título -->
          <h3
            class="text-center text-4xl font-bold  mb-4"
            [class.text-red-600]="modalService.config?.title === 'Error'"
            [class.text-green-600]="modalService.config?.title === 'Éxito'"
          >
            {{ modalService.config?.title }}
          </h3>

          <!-- Mensaje -->
          <p class="text-center text-gray-600 text-3xl font-bold">
            {{ modalService.config?.subtitle }}
          </p>
        </div>

        <!-- Close button -->
        <button
          (click)="modalService.hide()"
          class="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-modal-appear {
        animation: modal-appear 0.2s ease-out;
      }

      @keyframes modal-appear {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `,
  ],
})
export class ModalComponent {
  public modalService = inject(ModalService);

  handleBackgroundClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.modalService.hide();
    }
  }
}

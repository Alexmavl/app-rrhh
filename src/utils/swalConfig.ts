import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const swalConfig = Swal.mixin({
  customClass: {
    popup:
      "rounded-2xl shadow-2xl border border-gray-200 bg-white text-gray-900 font-sans",
    title: "font-bold text-xl text-gray-900 mb-2",
    htmlContainer: "text-gray-600 text-sm leading-relaxed",
    confirmButton:
      "text-white font-semibold px-5 py-2.5 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg",
    cancelButton:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2.5 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all",
    denyButton:
      "bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg",
    actions: "gap-2 mt-4",
    icon: "border-4 border-gray-100",
  },
  buttonsStyling: false,
  reverseButtons: true,
  showConfirmButton: true,
  background: "#fff",
  didRender: (popup) => {
    const confirmButton = popup.querySelector(".swal2-confirm") as HTMLElement;
    if (confirmButton) {
      confirmButton.style.backgroundColor = "#023778";
    }
  },
});

/* Configuraciones predefinidas para diferentes tipos de alertas */

export const swalSuccess = (title: string, text?: string) =>
  swalConfig.fire({
    icon: "success",
    title,
    text,
    confirmButtonText: "Aceptar",
    timer: 3000,
    timerProgressBar: true,
  });

export const swalError = (title: string, text?: string) =>
  swalConfig.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Entendido",
  });

export const swalWarning = (title: string, text?: string) =>
  swalConfig.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "Aceptar",
  });

export const swalInfo = (title: string, text?: string) =>
  swalConfig.fire({
    icon: "info",
    title,
    text,
    confirmButtonText: "Entendido",
  });

export const swalConfirm = (
  title: string,
  text: string,
  confirmText: string = "Sí, confirmar",
  cancelText: string = "Cancelar"
) =>
  swalConfig.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });

export const swalDelete = (
  itemName: string = "este registro",
  confirmText: string = "Sí, eliminar",
  cancelText: string = "Cancelar"
) =>
  swalConfig.fire({
    title: "¿Estás seguro?",
    text: `Esta acción eliminará ${itemName}. No podrás revertir esto.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      popup:
        "rounded-2xl shadow-2xl border border-gray-200 bg-white text-gray-900 font-sans",
      title: "font-bold text-xl text-gray-900 mb-2",
      htmlContainer: "text-gray-600 text-sm leading-relaxed",
      confirmButton:
        "bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg",
      cancelButton:
        "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2.5 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all",
      actions: "gap-2 mt-4",
      icon: "border-4 border-gray-100",
    },
  });

export const swalLoading = (title: string = "Procesando...", text?: string) => {
  swalConfig.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const swalClose = () => {
  Swal.close();
};

export const swalCustom = (options: any) => {
  return swalConfig.fire({
    ...options,
    didRender: (popup) => {
      const confirmButton = popup.querySelector(".swal2-confirm") as HTMLElement;
      if (confirmButton && !options.customClass?.confirmButton) {
        confirmButton.style.backgroundColor = "#023778";
      }
      if (options.didRender) {
        options.didRender(popup);
      }
    },
  });
};
// src/utils/swalConfig.ts
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const swalConfig = Swal.mixin({
  customClass: {
    popup:
      "rounded-2xl shadow-lg border border-gray-200 bg-white text-gray-900 font-sans",
    title: "font-semibold text-lg text-gray-800",
    htmlContainer: "text-gray-600 text-sm leading-relaxed",
    confirmButton:
      "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-blue-400",
    cancelButton:
      "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg mx-1 focus:outline-none focus:ring-2 focus:ring-gray-300",
  },
  buttonsStyling: false,
  reverseButtons: true,
  showConfirmButton: true,
  background: "#fff",
});

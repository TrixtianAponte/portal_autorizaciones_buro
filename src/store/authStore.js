import { create } from "zustand";

const useAuthStore = create((set) => ({
  rfc: "",
  ciec: "",
  tieneCIEC: true,
  datosRegistro: null,
  otpEnviado: false,
  otpValidado: false,
  usuarioRegistrado: false, // 🚀 Estado para bloquear cambios después del OTP

  setRFC: (rfc) => set({ rfc }),
  setCIEC: (ciec) => set({ ciec }),
  setTieneCIEC: (tieneCIEC) => set({ tieneCIEC }),
  setDatosRegistro: (datosRegistro) => set({ datosRegistro }),
  setOtpEnviado: (otpEnviado) => set({ otpEnviado }),
  setOtpValidado: (otpValidado) => set({ otpValidado }),
  setUsuarioRegistrado: (usuarioRegistrado) => set({ usuarioRegistrado }), // 🚀 Nueva función para manejar el estado
}));

export default useAuthStore;

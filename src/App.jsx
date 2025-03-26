import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import FormularioInicial from "./components/FormularioInicial";
import ModalRegistro from "./components/ModalRegistro";
import VerificacionOTP from "./components/VerificacionOTP";
import useAuthStore from "./store/authStore";

export default function App() {
  const { otpEnviado, otpValidado } = useAuthStore();
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          {otpEnviado && !otpValidado ? (
            <VerificacionOTP />
          ) : (
            <FormularioInicial abrirModal={() => setMostrarModal(true)} />
          )}
        </div>
        {mostrarModal && <ModalRegistro cerrarModal={() => setMostrarModal(false)} />}
      </div>
    </BrowserRouter>
  );
}

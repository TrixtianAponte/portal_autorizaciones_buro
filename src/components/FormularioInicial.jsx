import { useState } from "react";
import useAuthStore from "../store/authStore";
import CheckboxPrivacidad from "./CheckboxPrivacidad";

export default function FormularioInicial({ abrirModal }) {
  const { rfc, ciec, tieneCIEC, usuarioRegistrado, setRFC, setCIEC, setTieneCIEC } = useAuthStore();
  const [aceptoPolitica, setAceptoPolitica] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [modalConfirmacion, setModalConfirmacion] = useState(false);
  const [rfcValido, setRfcValido] = useState(true); // ✅ Estado para marcar si el RFC es válido

  // ✅ Expresiones regulares para validar RFC
  const regexRFC12 = /^[A-Z]{3}\d{6}[A-Z\d]{3}$/i;
  const regexRFC13 = /^[A-Z]{4}\d{6}[A-Z\d]{3}$/i;

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });

    // Ocultar después de 4 segundos
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 4000);
  };

  // ✅ Validar RFC en tiempo real
  const handleRFCChange = (e) => {
    const rfcInput = e.target.value.toUpperCase(); // 🔥 Convertir a mayúsculas automáticamente
    setRFC(rfcInput);

    if (regexRFC12.test(rfcInput) || regexRFC13.test(rfcInput)) {
      setRfcValido(true);
    } else {
      setRfcValido(false);
    }
  };

  const handleSubmit = async (e, forzarRegistro = false) => {
    e.preventDefault();

    if (!aceptoPolitica) {
      mostrarMensaje("⚠️ Debes aceptar la política de privacidad.", "error");
      return;
    }

    if (!rfcValido) {
      mostrarMensaje("⚠️ El RFC debe tener 12 o 13 caracteres, incluyendo homoclave.", "error");
      return;
    }

    const datos = { 
      rfc, 
      tiene_ciec: tieneCIEC,
      ciec_or_otp: tieneCIEC ? ciec : "OTP",
      forzarRegistro
    };

    try {
      const respuesta = await fetch("http://localhost:5001/guardar-rfc-ciec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await respuesta.json();

      if (resultado.yaRegistrado && !forzarRegistro) {
        setModalConfirmacion(true); // 🛑 Abrir modal de confirmación
        return;
      }

      mostrarMensaje(resultado.mensaje, "success");

      // ✅ Limpiar los campos después del registro exitoso
      setRFC("");
      setCIEC("");
      setAceptoPolitica(false);
      setRfcValido(true);
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      mostrarMensaje("❌ Error al conectar con el servidor.", "error");
    }
  };

  return (
    <div className="relative flex flex-col gap-4">
      {/* 📌 Mensaje de alerta */}
      {mensaje.texto && (
        <div
          className={`absolute top-0 left-0 w-full p-3 text-white rounded-md transition-opacity duration-500 ${
            mensaje.tipo === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* 📌 Modal de Confirmación */}
      {modalConfirmacion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center">
            <h3 className="text-lg font-bold">⚠️ Registro duplicado</h3>
            <p className="text-gray-600 mt-2">Ya registraste este RFC hoy. ¿Deseas registrarte nuevamente?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setModalConfirmacion(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={(e) => {
                  setModalConfirmacion(false);
                  handleSubmit(e, true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Sí, registrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📌 Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold">Bienvenido</h2>
        <p>Proporciona tus credenciales para validar tu información</p>

        {/* ✅ Campo RFC con validaciones */}
        <label className="block">
          RFC:
          <input
            type="text"
            value={rfc}
            onChange={handleRFCChange}
            className={`w-full border p-2 rounded ${rfcValido ? "border-gray-300" : "border-red-500"}`} // 🛑 Bordes rojos si el RFC es inválido
            required
          />
          {!rfcValido && <p className="text-red-500 text-sm mt-1">⚠️ El RFC debe tener 12 o 13 caracteres, incluyendo homoclave</p>}
        </label>

        <label className="block">
          ¿Tienes CIEC?
          <select
            value={tieneCIEC}
            onChange={(e) => setTieneCIEC(e.target.value === "true")}
            className="w-full border p-2 rounded"
            disabled={usuarioRegistrado}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </label>

        {tieneCIEC && (
          <label className="block">
            Contraseña (CIEC):
            <input type="password" value={ciec} onChange={(e) => setCIEC(e.target.value)} className="w-full border p-2 rounded" required />
          </label>
        )}

        {!tieneCIEC && (
          <button
            type="button"
            onClick={abrirModal}
            disabled={usuarioRegistrado}
            className={`p-2 rounded ${usuarioRegistrado ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
          >
            Registrarse sin CIEC
          </button>
        )}

        {/* ✅ Checkbox de privacidad */}
        <CheckboxPrivacidad aceptoPolitica={aceptoPolitica} setAceptoPolitica={setAceptoPolitica} />

        {/* ✅ Botón de registro bloqueado si el RFC es inválido */}
        <button
          type="submit"
          disabled={!rfcValido}
          className={`p-2 rounded ${rfcValido ? "bg-green-500 text-white" : "bg-gray-400 cursor-not-allowed"}`}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

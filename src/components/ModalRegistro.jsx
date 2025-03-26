import { useState } from "react";
import useAuthStore from "../store/authStore";

export default function ModalRegistro({ cerrarModal }) {
  const { setDatosRegistro, setOtpEnviado } = useAuthStore();

  const [datos, setDatos] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    situacion_laboral: "",
    correo_electronico: "",
    codigo_postal: "",
    tiene_codigo_referido: false,
    codigo_referido: "",
  });

  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState(false); // Estado para confirmación

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e, confirmacionForzada = false) => {
    e.preventDefault();
    setError(null);

    const requestBody = {
        ...datos,
        codigo_referido: datos.codigo_referido || null,
        confirmacion: confirmacionForzada, // Asegurar que se envía cuando el usuario acepta
    };

    console.log("📤 Enviando datos al backend:", requestBody);

    try {
        const response = await fetch("http://localhost:5001/registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("📩 Respuesta del backend:", data);

        if (!response.ok) {
            if (data.accion_requerida) {
                if (!confirmacionForzada) {
                    // 📌 Mostrar el modal de confirmación
                    setConfirmacion(true);
                    return;
                }
            }
            setError(data.error || "Error al registrar usuario.");
            return;
        }

        setDatosRegistro({
            ...datos,
            otp: data.otp,
            otp_expira: data.otp_expira,
        });

        setOtpEnviado(true);
        cerrarModal();
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        setError("Ocurrió un error al procesar el registro. Intenta de nuevo.");
    }
    
};



  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Registro de Usuario</h3>

        {error && <div className="bg-red-500 text-white p-2 rounded mb-3">{error}</div>}

        {confirmacion ? (
          <div>
            <p className="text-yellow-600">⚠️ Ya ha realizado un registro en el último día.</p>
            <p>¿Desea continuar con otro registro?</p>
            <button
              onClick={(e) => handleSubmit(e, true)}
              className="bg-green-500 text-white p-2 rounded w-full mt-4"
            >
              Aceptar
            </button>
            <button
              onClick={() => setConfirmacion(false)}
              className="bg-gray-400 text-white p-2 rounded w-full mt-2"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="text" name="primer_nombre" placeholder="Primer Nombre" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.primer_nombre} required />
            <input type="text" name="segundo_nombre" placeholder="Segundo Nombre (Opcional)" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.segundo_nombre} />
            <input type="text" name="apellido_paterno" placeholder="Apellido Paterno" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.apellido_paterno} required />
            <input type="text" name="apellido_materno" placeholder="Apellido Materno" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.apellido_materno} required />
            <input type="text" name="situacion_laboral" placeholder="Situación Laboral" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.situacion_laboral} required />
            <input type="email" name="correo_electronico" placeholder="Correo Electrónico" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.correo_electronico} required />
            <input type="text" name="codigo_postal" placeholder="Código Postal" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.codigo_postal} required />

            <div className="flex items-center mt-2">
              <input type="checkbox" name="tiene_codigo_referido" onChange={handleChange} checked={datos.tiene_codigo_referido} />
              <label className="ml-2 text-sm">¿Tienes un código de referido?</label>
            </div>

            {datos.tiene_codigo_referido && (
              <input type="text" name="codigo_referido" placeholder="Código Referido" className="w-full border p-2 mt-2" onChange={handleChange} value={datos.codigo_referido} />
            )}

            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-4">Enviar Código OTP</button>
            <button type="button" onClick={cerrarModal} className="bg-gray-400 text-white p-2 rounded w-full mt-2">Cancelar</button>
          </form>
        )}
      </div>
    </div>
  );
}

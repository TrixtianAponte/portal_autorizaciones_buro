import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function VerificacionOTP() {
  const navigate = useNavigate();
  const { setOtpValidado, setUsuarioRegistrado } = useAuthStore();
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async () => {
    setMensaje(null);
    const otpLimpio1 = otp1.trim();
    const otpLimpio2 = otp2.trim();

    if (!otpLimpio1 || !otpLimpio2) {
      setMensaje({ tipo: "error", texto: "⚠️ Debes ingresar ambos códigos OTP." });
      return;
    }

    if (otpLimpio1 !== otpLimpio2) {
      setMensaje({ tipo: "error", texto: "❌ Los códigos no coinciden. Verifica e intenta nuevamente." });
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/verificar-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpLimpio1 }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpValidado(true);
        setUsuarioRegistrado(true); // 🚀 Bloquear opciones después de validar OTP
        navigate("/");
      } else {
        setMensaje({ tipo: "error", texto: data.error || "⚠️ Código incorrecto o expirado." });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "❌ Error al conectar con el servidor" });
      console.error("❌ Error en la solicitud:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">Verificación OTP</h3>

      <input
        type="text"
        placeholder="Ingresa tu código OTP"
        value={otp1}
        onChange={(e) => setOtp1(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Confirma tu código OTP"
        value={otp2}
        onChange={(e) => setOtp2(e.target.value)}
        className="border p-2 rounded"
      />

      <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded">
        Validar
      </button>

      {mensaje && (
        <p className={mensaje.tipo === "error" ? "text-red-500" : "text-green-500"}>
          {mensaje.texto}
        </p>
      )}
    </div>
  );
}

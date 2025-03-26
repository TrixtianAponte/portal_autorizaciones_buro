import { useState } from "react";
import RegisterModal from "./RegisterModal";
import OTPVerification from "./OTPVerification";

const AuthForm = () => {
  const [rfc, setRfc] = useState("");
  const [ciec, setCiec] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ciec) {
      setShowModal(true);
    } else {
      console.log("Enviar RFC y CIEC al backend");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Bienvenido</h2>
        <p className="mb-4">Proporciona las siguientes credenciales:</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">RFC:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña (CIEC):</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={ciec}
              onChange={(e) => setCiec(e.target.value)}
            />
            <button
              type="button"
              className="text-blue-500 mt-2"
              onClick={() => setShowModal(true)}
            >
              ¿No tienes CIEC?
            </button>
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="mr-2" required />
            <label>Acepto la política de privacidad</label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Enviar
          </button>
        </form>
      </div>

      {showModal && <RegisterModal setShowModal={setShowModal} setEmail={setEmail} setShowOtp={setShowOtp} />}
      {showOtp && <OTPVerification email={email} setShowOtp={setShowOtp} />}
    </div>
  );
};

export default AuthForm;

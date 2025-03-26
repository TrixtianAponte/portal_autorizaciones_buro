import { useState } from "react";

const OTPVerification = ({ email, setShowOtp }) => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log(`Verificando OTP: ${otp} para ${email}`);
    setShowOtp(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Verificación OTP</h2>
        <p>Se envió un código a {email}</p>
        <input
          type="text"
          className="w-full p-2 border rounded my-2"
          placeholder="Ingrese OTP"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerify} className="w-full bg-blue-600 text-white p-2 rounded">
          Validar OTP
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;

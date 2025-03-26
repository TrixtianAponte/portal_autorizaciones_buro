import React, { useState } from "react";
import axios from "axios";

function Auth() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOTP = async () => {
    await axios.post("http://localhost:5000/send-otp", { email });
    alert("OTP enviado a tu correo");
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <input
        type="email"
        placeholder="Tu correo"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2"
      />
      <button onClick={sendOTP} className="bg-blue-500 text-white px-4 py-2 rounded">
        Enviar OTP
      </button>
      <input
        type="text"
        placeholder="Ingresa OTP"
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 mt-2"
      />
    </div>
  );
}

export default Auth;
 

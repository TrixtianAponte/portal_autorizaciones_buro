import { useState } from "react";

const RegisterModal = ({ setShowModal, setEmail, setShowOtp }) => {
  const [formData, setFormData] = useState({
    primerNombre: "",
    segundoNombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    situacionLaboral: "",
    correoElectronico: "",
    codigoPostal: "",
    tieneCodigoReferido: false,
    codigoReferido: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    setEmail(formData.correoElectronico);
    setShowModal(false);
    setShowOtp(true);
    console.log("Enviar datos al backend:", formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Registro</h2>

        <input type="text" name="primerNombre" placeholder="Primer Nombre" className="w-full p-2 border rounded mb-2" onChange={handleChange} />
        <input type="text" name="correoElectronico" placeholder="Correo Electrónico" className="w-full p-2 border rounded mb-2" onChange={handleChange} />

        <button onClick={handleRegister} className="w-full bg-green-600 text-white p-2 rounded">
          Enviar Código OTP
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;

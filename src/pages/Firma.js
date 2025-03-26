import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

function Firma() {
  const sigPad = useRef();

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Firma Electrónica</h2>
      <SignatureCanvas ref={sigPad} penColor="black" canvasProps={{ className: "border" }} />
      <button onClick={() => alert(sigPad.current.toDataURL())} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
        Guardar Firma
      </button>
    </div>
  );
}

export default Firma;


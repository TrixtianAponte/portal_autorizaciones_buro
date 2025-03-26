import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Portal de Autorización</h1>
      <Link to="/auth" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Iniciar Autenticación
      </Link>
    </div>
  );
}

export default Home;


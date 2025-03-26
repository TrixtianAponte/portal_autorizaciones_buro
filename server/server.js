import express from "express";
import cors from "cors";
import pkg from "pg"; // PostgreSQL
const { Pool } = pkg;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

// 🛠 Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 📌 Configuración de la base de datos PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// ✅ Verificar conexión con PostgreSQL
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Error conectando a PostgreSQL:", err);
  } else {
    console.log("✅ Conexión exitosa con PostgreSQL en", res.rows[0].now);
  }
});

// 📌 Inicializar Express
const app = express();
app.use(cors());
app.use(express.json());

// 📧 Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔍 Verificar conexión SMTP antes de enviar correos
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error en SMTP:", error);
  } else {
    console.log("✅ Servidor de correo listo para enviar mensajes");
  }
});

// 📩 Función para enviar OTP
const enviarOTP = async (correo, otp) => {
  const mailOptions = {
    from: `"Soporte Técnico" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: "🔐 Código de Verificación OTP",
    text: `Tu código OTP es: ${otp}. No lo compartas con nadie.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP enviado a ${correo} con ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    throw new Error(error.message);
  }
};

// 📌 Ruta para registrar usuario y enviar OTP
app.post("/registrar", async (req, res) => {
  try {
    const {
      primer_nombre,
      segundo_nombre,
      apellido_paterno,
      apellido_materno,
      situacion_laboral,
      correo_electronico,
      codigo_postal,
      tiene_codigo_referido,
      codigo_referido,
      confirmacion, // <-- Recibe este campo del frontend
    } = req.body;

    console.log("🔹 Datos recibidos:", req.body);

    // 📌 Buscar si el correo se registró en las últimas 2 horas
    const registroReciente = await pool.query(
      "SELECT created_at FROM otp WHERE correo_electronico = $1 AND created_at >= NOW() - INTERVAL '2 HOURS'",
      [correo_electronico]
    );

    if (registroReciente.rows.length > 0 && !confirmacion) {
      return res.status(400).json({
        error: "⚠️ Ya ha registrado su correo en las últimas 2 horas.",
        mensaje: "¿Desea crear un nuevo registro?",
        accion_requerida: true,
      });
    }

    // 📌 Buscar si el correo se registró en el último día
    const registroDia = await pool.query(
      "SELECT created_at FROM otp WHERE correo_electronico = $1 AND created_at >= NOW() - INTERVAL '24 HOURS'",
      [correo_electronico]
    );

    // 🚀 Si el usuario **NO ha confirmado**, le pedimos confirmación
    if (registroDia.rows.length > 0 && !confirmacion) {
      return res.status(400).json({
        error: "⚠️ Ya ha realizado un registro en el último día.",
        mensaje: "¿Desea continuar con otro registro?",
        accion_requerida: true,
      });
    }

    // 🔢 Generar código OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ⏳ Definir expiración del OTP (10 minutos)
    const otp_expira = new Date();
    otp_expira.setMinutes(otp_expira.getMinutes() + 10);

    // 📝 Insertar un nuevo registro sin sobrescribir los anteriores
    const resultado = await pool.query(
      `INSERT INTO otp 
      (primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, situacion_laboral, correo_electronico, codigo_postal, tiene_codigo_referido, codigo_referido, otp, otp_expira, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) RETURNING *`,
      [primer_nombre, segundo_nombre, apellido_paterno, apellido_materno, situacion_laboral, correo_electronico, codigo_postal, tiene_codigo_referido, codigo_referido, otp, otp_expira]
    );

    console.log("✅ Nuevo usuario registrado:", resultado.rows[0]);

    // 📩 Enviar OTP por correo
    await enviarOTP(correo_electronico, otp);

    res.status(201).json({
      mensaje: "✅ Usuario registrado y OTP enviado con éxito",
      usuario: resultado.rows[0],
    });

  } catch (error) {
    console.error("❌ Error en /registrar:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});




// 🔑 Ruta para verificar OTP
app.post("/verificar-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    const otpLimpio = otp.trim(); // 🔥 Asegurar que no tenga espacios

    console.log("🔹 OTP recibido para verificación:", otpLimpio);

    if (!otpLimpio) {
      return res.status(400).json({ error: "⚠️ Debes ingresar un código OTP." });
    }

    // 📌 Buscar el OTP en la base de datos
    const resultado = await pool.query(
      "SELECT * FROM otp WHERE otp = $1 AND otp_expira > NOW()",
      [otpLimpio]
    );

    if (resultado.rows.length === 0) {
      console.log("❌ OTP incorrecto o expirado.");
      return res.status(400).json({ error: "⚠️ Código incorrecto o expirado." });
    }

    console.log("✅ OTP validado correctamente:", otpLimpio);
    res.json({ mensaje: "OTP validado correctamente." });

  } catch (error) {
    console.error("❌ Error al verificar OTP:", error);
    res.status(500).json({ error: "Error en la validación del OTP." });
  }
});

// 🆕 Ruta para guardar RFC y CIEC en la tabla "registro"
app.post("/guardar-rfc-ciec", async (req, res) => { 
  try {
    const { rfc, tiene_ciec, ciec_or_otp, forzarRegistro } = req.body;

    console.log("🔹 Datos recibidos para registro RFC:", req.body);

    if (!rfc) {
      return res.status(400).json({ error: "⚠️ El RFC es obligatorio." });
    }

    // 📌 Verificar si el RFC ya se registró hoy
    const rfcHoy = await pool.query(
      `SELECT * FROM registro 
       WHERE rfc = $1 
       AND DATE(fecha_registro) = CURRENT_DATE`, 
      [rfc]
    );

    if (rfcHoy.rows.length > 0 && !forzarRegistro) {
      return res.status(200).json({ 
        mensaje: "⚠️ Ya registraste este RFC hoy. ¿Deseas registrarte nuevamente?", 
        yaRegistrado: true 
      });
    }

    // 📝 Insertar en la nueva tabla con la fecha de registro
    const resultado = await pool.query(
      `INSERT INTO registro (rfc, tiene_ciec, ciec_or_otp, fecha_registro) 
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [rfc, tiene_ciec, ciec_or_otp]
    );

    console.log("✅ Registro exitoso:", resultado.rows[0]);

    res.status(201).json({
      mensaje: "✅ RFC registrado correctamente",
      registro: resultado.rows[0],
      yaRegistrado: false
    });

  } catch (error) {
    console.error("❌ Error en /guardar-rfc-ciec:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});




// 🌐 Servidor en ejecución
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en ejecución en http://localhost:${PORT}`);
});

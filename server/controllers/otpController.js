const pool = require("../config/db");
const nodemailer = require("nodemailer");

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // OTP de 6 dígitos

  try {
    // Guardar OTP en la BD
    await pool.query("INSERT INTO otp_codes (email, code) VALUES ($1, $2)", [email, otp]);

    // Configurar el servicio de correo
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar OTP por correo
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código OTP",
      text: `Tu código OTP es: ${otp}`,
    });

    res.json({ message: "OTP enviado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error enviando OTP" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await pool.query("SELECT * FROM otp_codes WHERE email = $1 AND code = $2", [email, code]);

    if (result.rowCount > 0) {
      res.json({ message: "OTP válido" });
    } else {
      res.status(400).json({ error: "OTP incorrecto" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error verificando OTP" });
  }
};

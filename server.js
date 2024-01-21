const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport(smtpTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
}));

app.post("/enviar-mensagem", async (req, res) => {
  const { nome, email, numero, mensagem } = req.body;

  if (!nome || !email || !numero || !mensagem) {
    return res.status(400).json({
      success: false,
      message: "Por favor, forneça todos os campos necessários.",
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Substitua pelo seu endereço de e-mail para receber os dados
    subject: "Nova mensagem de contato",
    text: `Nome: ${nome}\nEmail: ${email}\nNúmero: ${numero}\nMensagem: ${mensagem}`,
  };

  try {
    // Envio do e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado com sucesso:", info);
    res.json({ success: true, message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error.message);
    res.status(500).json({ success: false, message: "Erro ao enviar a mensagem" });
  }
});

app.get("/", (req, res) => {
  res.send("Bem-vindo à página inicial do seu aplicativo!!!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

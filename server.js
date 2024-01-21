const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Use o body-parser para processar dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure a API Key do SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Rota para lidar com o envio de mensagens
app.post('/enviar-mensagem', (req, res) => {
  const { nome, email, numero, mensagem } = req.body;

  // Certifique-se de que os dados são recebidos corretamente
  if (!nome || !email || !numero || !mensagem) {
    return res.status(400).json({ success: false, message: 'Por favor, forneça todos os campos necessários.' });
  }

  // Configuração do e-mail
  const msg = {
    to: 'matheusfortunatoaw@gmail.com', // Coloque o seu e-mail aqui
    from: 'matheusfortunatoaw@hotmail.com',
    subject: 'Nova mensagem de contato',
    text: `Nome: ${nome}\nEmail: ${email}\nNúmero: ${numero}\nMensagem: ${mensagem}`,
  };

  // Envio do e-mail
  sgMail.send(msg)
    .then(() => {
      console.log('E-mail enviado com sucesso');
      res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
    })
    .catch((error) => {
      console.error('Erro ao enviar e-mail:', error.response ? error.response.body : error.message);
      res.status(500).json({ success: false, message: 'Erro ao enviar a mensagem' });
    });
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.send('Bem-vindo à página inicial do seu aplicativo!');
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

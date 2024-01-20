const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Use o body-parser para processar dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure a API Key do SendGrid
sgMail.setApiKey('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');

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

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

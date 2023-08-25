const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => { 
    fs.readFile('index.html', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Erro ao carregar o arquivo');
        } else {
            res.send(data);
        }
    });
});

app.post('/save', (req, res) => {
    const jsonData = JSON.stringify(req.body, null, 2); 
    fs.writeFile('dados.json', jsonData, 'utf-8', err => {
      if (err) {
        console.error('Erro ao salvar os dados no arquivo JSON:', err);
        res.status(500).json({ message: 'Erro ao salvar os dados' });
      } else {
        res.json({ message: 'Dados salvos com sucesso' });
      }
    });
  });

const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

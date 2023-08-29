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

app.delete('/delete/:id', (req, res) => {
    const itemIdToDelete = req.params.id;
    fs.readFile('dados.json', 'utf-8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o arquivo JSON:', err);
        res.status(500).json({ message: 'Erro ao excluir o item' });
      } else {
        const jsonData = JSON.parse(data);
        const updatedData = jsonData.filter(item => item.id !== itemIdToDelete);
        fs.writeFile('dados.json', JSON.stringify(updatedData, null, 2), 'utf-8', err => {
          if (err) {
            console.error('Erro ao salvar os dados no arquivo JSON:', err);
            res.status(500).json({ message: 'Erro ao excluir o item' });
          } else {
            res.json({ message: 'Item excluído com sucesso' });
          }
        });
      }
    });
  });
  

const PORT = 3333;
app.listen(PORT, () => {
    console.log(`Aperte crtl + c para desligar o servidor`)
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

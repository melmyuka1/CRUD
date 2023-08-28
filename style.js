const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))
const downloadJSONButton = document.getElementById('downloadJSONButton');


let id
let itens =  [];

// Carrega os itens do arquivo dados.json
const getItensBDFromFile = async () => {
  try {
      const response = await fetch('dados.json');
      const jsonData = await response.json();
      return jsonData || [];
  } catch (error) {
      console.error('Erro ao ler os dados do arquivo JSON:', error);
      return [];
  }
};

const save = (data) => {
  fetch('/save', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
      console.log(result.message); // Mensagem de sucesso do servidor
  })
  .catch(error => {
      console.error('Erro ao salvar os dados no servidor:', error);
  });
};


function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sNome.value = itens[index].nome
    sFuncao.value = itens[index].funcao
    sSalario.value = itens[index].salario
    id = index
  } else {
    sNome.value = ''
    sFuncao.value = ''
    sSalario.value = ''
  }
  
}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}

function insertItem(item, index) {
  let tr = document.createElement('tr')

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
  
  if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
    return
  }

  e.preventDefault();

  if (id !== undefined) {
    itens[id].nome = sNome.value
    itens[id].funcao = sFuncao.value
    itens[id].salario = sSalario.value
  } else {
    itens.push({'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined

  save(itens); 
}

function loadFromJSONFile() {
  fetch('dados.json')
    .then(response => response.json())
    .then(jsonData => {
      itens = jsonData;
      loadItens(); 
    })
    .catch(error => {
      console.error('Erro ao carregar dados do arquivo JSON:', error);
    });
}

loadItens()

async function loadItens() {
  try {
    itens = await getItensBDFromFile();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
  } catch (error) {
    console.error('Erro ao carregar os itens:', error);
  }
}

const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/ola', (req, res) => {
  res.send('Hello World!');
});

app.post("/clientes", (req, res) => {
  const cliente = req.body;

  if (!cliente || Object.keys(cliente).length === 0) {
    return res.status(400).json({ resposta: "Body não preenchido" });
  }

  try {
    let bd = [];

    if (fs.existsSync('bd.json')) {
      const data = fs.readFileSync('bd.json', 'utf-8');
      bd = JSON.parse(data);
    }

    bd.push(cliente);

    fs.writeFileSync('bd.json', JSON.stringify(bd, null, 2));

    console.log('✅ Cliente cadastrado:', cliente);

    res.status(201).json({ resposta: "Cliente cadastrado com sucesso!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ resposta: "Erro interno no servidor" });
  }
});

app.get ("/clientes", (req, res )=> {
  try {
    const clientes = JSON.parse (fs.readFileSync('bd.json', 'utf-8'))
    res.status(200).json(clientes)
  } catch (error) {
    res.status(500).json ({resposta:error.message})

  }
})

app.get("/clientes/:cpf", (req, res) => {
  const { cpf } = req.params;
  try {
    if (!fs.existsSync('bd.json')) {
      return res.status(404).json({ resposta: "Nenhum cliente cadastrado ainda" });
    }
    const data = fs.readFileSync('bd.json', 'utf-8');
    const clientes = JSON.parse(data);
    const cpfBuscado = cpf.replace(/[^\d]/g, '');
    const clienteEncontrado = clientes.find((cliente) => {
      if (!cliente.cpf) return false;
      const cpfDoCliente = cliente.cpf.replace(/[^\d]/g, '');
      return cpfDoCliente === cpfBuscado;
    });
    if (!clienteEncontrado) {
      return res.status(404).json({ resposta: "Cliente não encontrado com este CPF" });
    }
    res.status(200).json(clienteEncontrado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ resposta: error.message });
  }
});
app.delete("/clientes/:cpf", (req, res) => {
  const { cpf } = req.params;

  try {
    if (!fs.existsSync('bd.json')) {
      return res.status(404).json({ 
        resposta: "Nenhum cliente cadastrado ainda" 
      });
    }

    const data = fs.readFileSync('bd.json', 'utf-8');
    let clientes = JSON.parse(data);

    const cpfLimpo = cpf.replace(/[^\d]/g, '');

    const indice = clientes.findIndex(cliente => 
      cliente.cpf.replace(/[^\d]/g, '') === cpfLimpo
    );

    if (indice === -1) {
      return res.status(404).json({ 
        resposta: "Cliente não encontrado" 
      });
    }

    const clienteRemovido = clientes.splice(indice, 1)[0];

    fs.writeFileSync('bd.json', JSON.stringify(clientes, null, 2));

    res.json({
      resposta: "Cliente deletado com sucesso",
      cliente: clienteRemovido
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      resposta: "Erro ao deletar cliente",
      erro: error.message 
    });
  }
});


app.put("/clientes/:cpf", (req, res)=>{
    const cpf = req.params.cpf
    const dados =  req.body
    try {
        const clientes = JSON.parse ( fs.readFileSync('bd.json', 'utf8'))
        const indice_cliente = clientes.findIndex(
            (cliente)=> cliente.cpf.replace(/\D/g,"") == cpf )
    if (indice_cliente == -1 ){
        return res.status(404).json ({resposta:"clientes nao encotrado!"})

    }
    clientes[indice_cliente] = dados
    fs.writeFileSync('bd.json', JSON.stringify(clientes), 'utf8')
    res.status(200). json({resposta: "cliente alterado com sucesso!"})
} catch(error){
    res.status(500).json({resposta:error.message})
}
})


app.listen(port, () => {
  console.log(`🚀 API rodando em http://localhost:${port}`);
});



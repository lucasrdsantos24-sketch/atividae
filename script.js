class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }
}

class FabricaProduto {
  static criar(tipo) {
    const valores = {
      pastel: 5,
      caldo: 7,
      refrigerante: 4,
      suco: 6
    };
    return new Produto(tipo, valores[tipo]);
  }
}

class Item {
  constructor(produto, quantidade) {
    this.produto = produto;
    this.quantidade = quantidade;
  }

  total() {
    return this.produto.preco * this.quantidade;
  }
}

class Pedido {
  constructor() {
    this.itens = [];
  }

  adicionar(item) {
    this.itens.push(item);
  }

  total() {
    return this.itens.reduce((soma, i) => soma + i.total(), 0);
  }

  limpar() {
    this.itens = [];
  }
}

class Controle {
  constructor() {
    if (Controle.instancia) return Controle.instancia;
    this.pedido = new Pedido();
    Controle.instancia = this;
  }

  adicionar(tipo, qtd) {
    const produto = FabricaProduto.criar(tipo);
    const item = new Item(produto, qtd);
    this.pedido.adicionar(item);
  }

  itens() {
    return this.pedido.itens;
  }

  total() {
    return this.pedido.total();
  }

  finalizar() {
    const valor = this.total();

    let desconto = 0;
    if (valor > 100) desconto = valor * 0.2;
    else if (valor > 50) desconto = valor * 0.1;

    const taxa = valor * 0.05;
    const final = valor - desconto + taxa;

    localStorage.setItem("pedido", final);
    this.pedido.limpar();

    return final;
  }
}

const app = new Controle();

const produto = document.getElementById("produto");
const qtd = document.getElementById("qtd");
const lista = document.getElementById("lista");
const total = document.getElementById("total");

const add = document.getElementById("btnAdicionar");
const fim = document.getElementById("btnFinalizar");

function atualizar() {
  lista.innerHTML = "";

  app.itens().forEach(i => {
    const li = document.createElement("li");
    li.textContent = `${i.produto.nome} x${i.quantidade} = R$ ${i.total()}`;
    lista.appendChild(li);
  });

  total.innerText = app.total();
}

add.addEventListener("click", () => {
  const tipo = produto.value;
  const quantidade = parseInt(qtd.value);

  if (!quantidade || quantidade <= 0) {
    alert("Quantidade inválida");
    return;
  }

  app.adicionar(tipo, quantidade);
  atualizar();
});

fim.addEventListener("click", () => {
  const resultado = app.finalizar();
  alert("Total final: " + resultado);
  atualizar();
});

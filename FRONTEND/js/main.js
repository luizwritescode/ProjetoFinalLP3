const app = {};

var PORT = 5093;

const API_URL = "http://127.0.0.1:" + PORT + "/api";

app.state = {
  screen: "index",
};

app.storeOnLocalStorage = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

app.getFromLocalStorage = function (key) {
  return JSON.parse(localStorage.getItem(key));
};

// Função para fazer requisições GET
app.get = async function (
  url,
  callback,
  error_callback = function (status) {
    // console.log("Erro de conexão com o servidor")
  }
) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      if (request.responseText != "")
        callback(JSON.parse(request.responseText), request.status);
      else callback(null, request.status);
    } else {
      console.log("Erro ao fazer a requisição GET");
    }
  };
  request.onerror = error_callback;
  request.send();
};

// Função para fazer requisições POST
app.post = async function (
  url,
  data,
  callback,
  error_callback = function (status) {}
) {
  var request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback(JSON.parse(request.responseText), request.status);
    } else {
      console.log("Erro ao fazer a requisição POST");
    }
  };
  request.onerror = error_callback;
  request.send(JSON.stringify(data));
};

// Função para fazer requisições PUT
app.put = async function (
  url,
  data,
  callback,
  error_callback = function (status) {}
) {
  var request = new XMLHttpRequest();
  request.open("PUT", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback(JSON.parse(request.responseText), request.status);
    } else {
      console.log("Erro ao fazer a requisição PUT");
    }
  };
  request.onerror = error_callback;
  request.send(JSON.stringify(data));
};

// Função para fazer requisições DELETE
app.delete = async function (
  url,
  callback,
  error_callback = function (status) {}
) {
  var request = new XMLHttpRequest();
  request.open("DELETE", url, true);
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      callback(JSON.parse(request.responseText), request.status);
    } else {
      console.log("Erro ao fazer a requisição DELETE");
    }
  };
  request.onerror = error_callback;
  request.send();
};


// Função para bind o menu de navegação
app.bindNavigation = function () {
  const index_link = document.getElementById("index-link");
  const clientes_link = document.getElementById("clientes-link");
  const pedidos_link = document.getElementById("pedidos-link");

  const index_page = document.getElementById("index-page");
  const clientes_page = document.getElementById("clientes-page");
  const pedidos_page = document.getElementById("pedidos-page");

  app.getFromLocalStorage("screen") == null
    ? (app.state.screen = "index")
    : (app.state.screen = app.getFromLocalStorage("screen"));

  //inicializar aba correta do local storage
  if (app.state.screen == "index") {
    index_link.classList.add("selected");
    clientes_link.classList.remove("selected");
    pedidos_link.classList.remove("selected");
    index_page.classList.add("active");
    clientes_page.classList.remove("active");
    pedidos_page.classList.remove("active");
  } else if (app.state.screen == "clientes") {
    index_link.classList.remove("selected");
    clientes_link.classList.add("selected");
    pedidos_link.classList.remove("selected");
    index_page.classList.remove("active");
    clientes_page.classList.add("active");
    pedidos_page.classList.remove("active");
  } else if (app.state.screen == "pedidos") {
    index_link.classList.remove("selected");
    clientes_link.classList.remove("selected");
    pedidos_link.classList.add("selected");
    index_page.classList.remove("active");
    clientes_page.classList.remove("active");
    pedidos_page.classList.add("active");
  }

  index_link.addEventListener("click", function () {
    index_page.classList.add("active");
    clientes_page.classList.remove("active");
    pedidos_page.classList.remove("active");

    index_link.classList.add("selected");
    clientes_link.classList.remove("selected");
    pedidos_link.classList.remove("selected");

    app.state.screen = "index";

    app.storeOnLocalStorage("screen", "index");
  });

  clientes_link.addEventListener("click", function () {
    index_page.classList.remove("active");
    clientes_page.classList.add("active");
    pedidos_page.classList.remove("active");

    index_link.classList.remove("selected");
    clientes_link.classList.add("selected");
    pedidos_link.classList.remove("selected");

    app.state.screen = "clientes";
    app.storeOnLocalStorage("screen", "clientes");
  });

  pedidos_link.addEventListener("click", function () {
    index_page.classList.remove("active");
    clientes_page.classList.remove("active");
    pedidos_page.classList.add("active");

    index_link.classList.remove("selected");
    clientes_link.classList.remove("selected");
    pedidos_link.classList.add("selected");

    app.state.screen = "pedidos";

    app.storeOnLocalStorage("screen", "pedidos");
  });
};

// Função para bind os formularios de adcionar clientes e pedidos
app.bindForms = function () {
  const cliente_form = document.getElementById("cliente-form");
  const pedido_form = document.getElementById("pedido-form");

  cliente_form.addEventListener("submit", function (event) {
    event.preventDefault();

    const cliente_message = document.getElementById("cliente-message");
    cliente_message.innerHTML = "Carregando...";

    const cliente = {
      nome: document.getElementById("cliente-nome").value,
      email: document.getElementById("cliente-email").value,
      telefone: document.getElementById("cliente-telefone").value,
    };

    app.post(
      API_URL + "/Cliente",
      cliente,
      function (data, status) {
        if (status == 200) {
          cliente_message.innerHTML = "Cliente cadastrado com sucesso";
          //reload table
          app.getClientes();
        }
      },
      function (status) {
        console.log(status);
        cliente_message.innerHTML = "Erro ao cadastrar cliente";
      }
    );
  });

  pedido_form.addEventListener("submit", function (event) {
    event.preventDefault();

    const pedido_message = document.getElementById("pedido-message");
    pedido_message.innerHTML = "Carregando...";

    const pedido = {
      cliente: document.getElementById("pedido-cliente").value,
      municipioOrigem: document.getElementById("pedido-origem").value,
      municipioDestino: document.getElementById("pedido-destino").value,
      qtdCarros: document.getElementById("pedido-qtdcarros").value,
      data: document.getElementById("pedido-data").value,
      clienteNavigation: {},
    };

    app.post(
      API_URL + "/Pedido",
      pedido,
      function (data, status) {
        if (status == 200) {
          pedido_message.innerHTML = "Pedido cadastrado com sucesso";
          //reload table
          app.getPedidos();
        }
      },
      function (status) {
        console.log(status);
        pedido_message.innerHTML = "Erro ao cadastrar pedido";
      }
    );
  });
};

// Função para bind os botoes de "Novo" e "Buscar" na aba de clientes
app.bindClienteMenu = function () {
  const cliente_novo = document.getElementById("cliente-novo");
  const cliente_busca = document.getElementById("cliente-busca");

  cliente_novo.addEventListener("click", function () {
    cliente_novo.classList.add("active");
    cliente_busca.classList.remove("active");
  });

  cliente_busca.addEventListener("click", function () {
    cliente_novo.classList.remove("active");
    cliente_busca.classList.add("active");
  });
};

// Função para popular a tabela de clientes
app.populateClientesTable = function (data) {
  const clientes_table = document.getElementById("clientes-table");

  // limpar tabela
  clientes_table.innerHTML = "";

  // criar cabecalho
  const header = document.createElement("thead");
  header.innerHTML =
    "<tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Opções</th></tr>";
  clientes_table.appendChild(header);

  // criar linhas
  for (let i = 0; i < data.length; i++) {
    if (data[i].nome == null) continue;

    const cliente = data[i];

    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" +
      cliente.nome +
      "</td><td>" +
      cliente.email +
      "</td><td>" +
      cliente.telefone +
      "</td><td><a href='#' class='btn-success btn-list'>Editar</a><a href='#' class='btn-danger'>X</a></td>";
    clientes_table.appendChild(row);
  }

  if (data.length == 0) {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan='5'>Nenhum cliente cadastrado</td>";
    clientes_table.appendChild(row);
  } else
  {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan='5'>Total de clientes: " + data.length + "</td>";
    clientes_table.appendChild(row);
  }
};


// Função para popular a tabela de pedidos
app.populatePedidosTable = function (data) {
  const pedidos_table = document.getElementById("pedidos-table");

  // limpar tabela
  pedidos_table.innerHTML = "";

  // criar cabeçalho
  const header = document.createElement("thead");
  header.innerHTML =
    "<tr><th>Id</th><th>Cliente</th><th>Origem</th><th>Destino</th><th>Carros</th><th>Vans</th><th>Valor</th><th>Data</th><th>Status</th><th>Opções</th></tr>";
  pedidos_table.appendChild(header);

  // criar linhas
  for (let i = 0; i < data.length; i++) {
    if (data[i].cliente == null) continue;

    const pedido = data[i];

    const valor = Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(pedido.valor);

    const data_simples = pedido.data.split("T")[0];

    //BUG!! As vezes o pedido.clienteNavigation vem undefined, quando ja deveria ter sido carregado na Função getPedidos
    const nome_cliente =
      pedido.clienteNavigation == undefined
        ? app.clientes.find((x) => x.id == app.pedidos[i].cliente)
        : pedido.clienteNavigation.nome;

    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" +
      pedido.id +
      "</td>" +
      "<td>" +
      nome_cliente +
      "</td><td>" +
      pedido.municipioOrigem +
      "</td><td>" +
      pedido.municipioDestino +
      "</td><td>" +
      pedido.qtdCarros +
      "</td><td>" +
      pedido.qtdVans +
      "</td><td>" +
      valor +
      "</td><td>" +
      data_simples +
      "</td><td>" +
      pedido.status;
    pedidos_table.appendChild(row);


    //create and bind edit and delete buttons
  let edit_button = document.createElement("a")
  edit_button.classList.add("pedido-edit")
  edit_button.classList.add("btn-success")
  edit_button.classList.add("btn-list")
  edit_button.innerHTML = "Editar"
  edit_button.href = "#"
  edit_button.addEventListener("click", function () {
    const id = app.pedidos[i].id;
    app.showPedido(id);
  });

  let delete_button = document.createElement("a")
  delete_button.classList.add("pedido-delete")
  delete_button.classList.add("btn-danger")
  delete_button.innerHTML = "X"
  delete_button.href = "#"
  delete_button.addEventListener("click", function () {
    const id = app.pedidos[i].id;
    app.deletePedido(id);
  });

  let td = document.createElement("td")

  td.appendChild(edit_button)
  td.appendChild(delete_button)
  row.appendChild(td)

  }

  if (data.length == 0) {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan='10'>Nenhum pedido cadastrado</td>";
    pedidos_table.appendChild(row);
  } else {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan='10'>Total: " + data.length + "</td>";
    pedidos_table.appendChild(row);
  }
};


// Função para get os clientes da API e popular a tabelas e selects
app.getClientes = async function () {
  // get clientes
  await app.get(API_URL + "/Cliente", function (data, status) {
    const cliente_count = document.getElementById("cliente-count");
    cliente_count.innerHTML = data.length;

    app.clientes = data;

    app.populateClientesTable(app.clientes);
    app.populateClienteSelect(app.clientes, "pedido-cliente");
  });
};

// Função para get os pedidos da API e popular a tabelas
app.getPedidos = async function () {
  // get pedidos
  await app.get(API_URL + "/Pedido", function (data, status) {
    const pedido_count = document.getElementById("pedido-count");
    pedido_count.innerHTML = data.length;

    app.pedidos = data;

    for (let i = 0; i < app.pedidos.length; i++) {
      app.pedidos[i].clienteNavigation = app.clientes.find(
        (x) => x.id == app.pedidos[i].cliente
      );
    }

    
    app.populatePedidosTable(app.pedidos);
  });
};

// Função para get o status da API
app.getStatus = async function () {
  const status_label = document.getElementById("status");
  status_label.innerHTML = "Conectando ao servidor...";

  await app.get(
    API_URL + "/Status",
    function (data, status) {
      if (status == 200) {
        status_label.innerHTML = "Conectado ao servidor";
        status_label.style.color = "green";
      }
    },
    function (status) {
      status_label.innerHTML = "Erro de conexão com o servidor";
      status_label.style.color = "red";
    }
  );
};

// Função para get os municipios da API e popular os selects
app.getMunicipios = async function () {
  await app.get(API_URL + "/Distancias/Municipios", function (data, status) {
    app.municipios = data;

    app.populateMunicipioSelect(app.municipios, "pedido-origem");
    app.populateMunicipioSelect(app.municipios, "pedido-destino");
  });
};

// Função para popular o select de clientes
app.populateClienteSelect = function (data, select, selected="") {
  if (typeof select == "string") {
    select = document.getElementById(select);
  }
  // limpar select
  select.innerHTML =
    "<option value='' disabled selected>Selecione um cliente</option>";

  // criar linhas
  for (let i = 0; i < data.length; i++) {
    const cliente = data[i];

    const option = document.createElement("option");
    option.value = cliente.id;
    option.innerHTML = cliente.nome;

    if (cliente.id == selected) {
      option.selected = true;
    }

    select.appendChild(option);
  }
};

// Função para popular o select de municipios
app.populateMunicipioSelect = function (data, select, selected="") {
  if (typeof select == "string") {
    select = document.getElementById(select);
  }

  // limpar selects
  select.innerHTML = "<option value='' disabled selected>Selecione um municipio</option>";

  // criar linhas
  for (let i = 0; i < data.length; i++) {
    let municipio = data[i];

    let option = document.createElement("option");
    option.value = municipio;
    option.innerHTML = municipio;

    if (municipio == selected) {
      option.selected = true;
    }
    
    select.appendChild(option);
  }
};

//mostrar pedido na aba do inspetor
app.showPedido = function (id) {
  const inspetor = document.getElementById("inspetor");

  const form = document.createElement("form");
  form.id = "pedido-edit-form";

  // limpar inspetor
  inspetor.innerHTML = "";

  const pedido = app.pedidos.find((x) => x.id == id);

  const nome_cliente = pedido.clienteNavigation.nome;

  const data = pedido.data.split("T")[0];

  const fields = ["Cliente", "Origem", "Destino", "Carros", "Vans", "Valor", "Data", "Status"];

  const title = document.createElement("h3");
  title.innerHTML = id + " : Pedido";
  inspetor.appendChild(title)

  for(var i = 0; i < fields.length; i++){
    var field = fields[i];


    var input_div = document.createElement("div");
    input_div.classList.add("input-div");

    var label = document.createElement("label");
    label.innerHTML = field + ": ";

    var input;

    switch(field){
      case "Cliente":
        input = document.createElement("select")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        app.populateClienteSelect(app.clientes, input, pedido.clienteNavigation.id)
        break;
      case "Origem":
        input = document.createElement("select")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        input.type = "select"
        app.populateMunicipioSelect(app.municipios, input, pedido.municipioOrigem)
        break;
      case "Destino":
        input = document.createElement("select")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        input.type = "select"
        app.populateMunicipioSelect(app.municipios, input, pedido.municipioDestino)
        break;
      case "Data":
        input = document.createElement("input")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        input.type = "date"
        input.value = data
        break;
      case "Status":
        input = document.createElement("select")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        var status = ["Aberto", "Fechado"]
        for(var j = 0; j < status.length; j++){
          var option = document.createElement("option")
          option.value = status[j]
          option.innerHTML = status[j]
          if(status[j] == pedido.status){
            option.selected = true
          }
          input.appendChild(option)
        }
        break;
      case 'Valor':
        input = document.createElement("input")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        input.type = "number"
        input.value = pedido.valor
        break;
      case 'Carros':
        input = document.createElement("input")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        input.type = "number"
        input.value = pedido.qtdCarros
        break;
      case 'Vans':
        input = document.createElement("input")
        input.id = "pedido-" + field.toLowerCase() + "-edit";
        input.type = "number"
        input.value = pedido.qtdVans
        break;
    }

    input_div.appendChild(label);
    input_div.appendChild(input);

    form.appendChild(input_div);

  }

  const submit_button = document.createElement("input");
  submit_button.type = "submit";
  submit_button.value = "Salvar";


  let submit_div = document.createElement("div");
  submit_div.classList.add("submit-div");

  
  let pedido_edit_message = document.createElement("span");
  pedido_edit_message.id = "pedido-edit-message";
  submit_div.appendChild(pedido_edit_message);
  submit_div.appendChild(submit_button);

  form.appendChild(submit_div);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const data = {
      id: id,
      cliente: document.getElementById("pedido-cliente-edit").value,
      municipioOrigem: document.getElementById("pedido-origem-edit").value,
      municipioDestino: document.getElementById("pedido-destino-edit").value,
      qtdCarros: document.getElementById("pedido-carros-edit").value,
      qtdVans: document.getElementById("pedido-vans-edit").value,
      data: document.getElementById("pedido-data-edit").value,
      status: document.getElementById("pedido-status-edit").value,
      clienteNavigation: {}
    };

    app.put(API_URL + "/Pedido", data, function (data, status) {
      if (status == 200) {
        pedido_edit_message.innerHTML = "Pedido editado com sucesso!";
        app.getPedidos();
      } else {
        pedido_edit_message.innerHTML = "Erro ao editar pedido!";
      }
    });


  })

  inspetor.appendChild(form);
   
};

// inicializar funcoes de binds, conexoes, etc
app.init = async function () {
  app.bindNavigation();
  app.bindForms();

  app.bindClienteMenu();

  // get async data from server syncronously

  await app.getStatus();
  await app.getClientes();
  await app.getPedidos();
  await app.getMunicipios();
};

// inicializar script quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded",async function () {
  await app.init();

  if (app.clientes == undefined)
     app.populateClientesTable([]);

  if (app.pedidos == undefined) 
    app.populatePedidosTable([]);
    
});

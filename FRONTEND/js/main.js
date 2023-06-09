
const app = {}

var PORT = 5093;

const API_URL = "http://127.0.0.1:"+PORT+"/api"

app.state = {
    screen: "index"
}

app.storeOnLocalStorage = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

app.getFromLocalStorage = function (key) {
    return JSON.parse(localStorage.getItem(key));
}

// Funcao para fazer requisicoes GET
app.get = function (url,
                    callback,
                    error_callback = function (status) {
                        // console.log("Erro de conexão com o servidor")
                    } 
                    ) {

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            
            if(request.responseText != "")
                callback(JSON.parse(request.responseText), request.status);

            else 
                callback(null, request.status);
        } else {
            console.log("Erro ao fazer a requisição GET");
        }
    }
    request.onerror = error_callback
    request.send();
}

// Funcao para fazer requicisoes POST
app.post = function (url, data, callback, error_callback = function (status) { }) {
    debugger
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            callback(JSON.parse(request.responseText), request.status);
        } else {
            console.log("Erro ao fazer a requisição POST");
        }
    }
    request.onerror = error_callback
    request.send(JSON.stringify(data));
}


// Funcao para bind o menu de navegacao
app.bindNavigation = function () {

    const index_link = document.getElementById("index-link");
    const clientes_link = document.getElementById("clientes-link");
    const pedidos_link = document.getElementById("pedidos-link");

    const index_page = document.getElementById("index-page");
    const clientes_page = document.getElementById("clientes-page");
    const pedidos_page = document.getElementById("pedidos-page");

    app.getFromLocalStorage("screen") == null ? app.state.screen = "index" : app.state.screen = app.getFromLocalStorage("screen");

    //inicializar aba correta do local storage
    if(app.state.screen == "index")
    {
        index_link.classList.add("selected");
        clientes_link.classList.remove("selected");
        pedidos_link.classList.remove("selected");
        index_page.classList.add("active");
        clientes_page.classList.remove("active");
        pedidos_page.classList.remove("active");
    } else if( app.state.screen == "clientes") {
        index_link.classList.remove("selected");
        clientes_link.classList.add("selected");
        pedidos_link.classList.remove("selected");
        index_page.classList.remove("active");
        clientes_page.classList.add("active");
        pedidos_page.classList.remove("active");
    } else if( app.state.screen == "pedidos") {
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
    })

    clientes_link.addEventListener("click", function () {
        index_page.classList.remove("active");
        clientes_page.classList.add("active");
        pedidos_page.classList.remove("active");

        index_link.classList.remove("selected");
        clientes_link.classList.add("selected");
        pedidos_link.classList.remove("selected");

        app.state.screen = "clientes";
        app.storeOnLocalStorage("screen", "clientes")
    })

    pedidos_link.addEventListener("click", function () {
        index_page.classList.remove("active");
        clientes_page.classList.remove("active");
        pedidos_page.classList.add("active");

        index_link.classList.remove("selected");
        clientes_link.classList.remove("selected");
        pedidos_link.classList.add("selected");

        app.state.screen = "pedidos";

        app.storeOnLocalStorage("screen", "pedidos")
    })
}

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
            telefone: document.getElementById("cliente-telefone").value
        }

        app.post(API_URL+"/Cliente", cliente, function (data, status) {
            if (status == 200) {

                //reload table
                app.getClientes();

            } else {
                cliente_message.innerHTML = "Erro ao cadastrar cliente";
            }
        })
    })
}
                

app.bindClienteMenu = function () {
    const cliente_novo = document.getElementById("cliente-novo");
    const cliente_busca = document.getElementById("cliente-busca");

    cliente_novo.addEventListener("click", function () {
        cliente_novo.classList.add("active");
        cliente_busca.classList.remove("active");
    })

    cliente_busca.addEventListener("click", function () {
        cliente_novo.classList.remove("active");
        cliente_busca.classList.add("active");
    })
    
}

app.populateClientesTable = function (data) {
    
        const clientes_table = document.getElementById("clientes-table");
    
        // limpar tabela
        clientes_table.innerHTML = "";
    
        // criar cabecalho
        const header = document.createElement("thead");
        header.innerHTML = "<tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Opções</th></tr>";
        clientes_table.appendChild(header);
    
        // criar linhas
        for (let i = 0; i < data.length; i++) {

            if(data[i].nome == null)
                continue;

            const cliente = data[i];
    
            const row = document.createElement("tr");
            row.innerHTML = "<td>"+cliente.nome+"</td><td>"+cliente.email+"</td><td>"+cliente.telefone+"</td><td><a href='#' class='btn-success btn-list'>Editar</a><a href='#' class='btn-danger'>X</a></td>";
            clientes_table.appendChild(row);
        }

        if(data.length == 0)
        {
            const row = document.createElement("tr");
            row.innerHTML = "<td colspan='5'>Nenhum cliente cadastrado</td>";
            clientes_table.appendChild(row);
        }

}

app.getClientes = function () {
    
    // get clientes
    app.get(API_URL+"/Cliente", function (data, status) {

        const cliente_count = document.getElementById("cliente-count");
        cliente_count.innerHTML = data.length - 1 ;

        app.clientes = data;

        app.populateClientesTable(app.clientes);
    });
}

app.getPedidos = function () {
        // get pedidos
        app.get(API_URL+"/Pedido", function (data, status) {
            
            const pedido_count = document.getElementById("pedido-count");
            pedido_count.innerHTML = data.length - 1;

            app.pedidos = data;
    
        })
}

app.getStatus = function () {
    
    app.get(API_URL+"/Status", function (data, status) {

        if(status == 200)
        {
            const status_label = document.getElementById("status");
            status_label.innerHTML = "Conectado ao servidor";
            status_label.style.color = "green";
        }

    },
    function(status) {
        status_label.innerHTML = "Erro de conexão com o servidor";
        status_label.style.color = "red";
    }
    );
}

// inicializar funcoes de binds, conexoes, etc
app.init = function () {
    app.bindNavigation();
    app.bindForms();

    app.bindClienteMenu();

    const status_label = document.getElementById("status");
    status_label.innerHTML = "Conectando ao servidor...";

    app.getStatus();
    app.getClientes();
    app.getPedidos();

}


// inicializar script quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
    
    app.init();

    if( app.clientes == undefined )
        app.clientes = [];

    if(app.pedidos == undefined)
        app.pedidos = [];
    
    app.populateClientesTable(app.clientes);
})

const app = {}

var PORT = 5093;

const API_URL = "http://127.0.0.1:"+PORT+"/api"

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



// Funcao para bind o menu de navegacao
app.bindNavigation = function () {

    const index_link = document.getElementById("index-link");
    const clientes_link = document.getElementById("clientes-link");
    const pedidos_link = document.getElementById("pedidos-link");

    const index_page = document.getElementById("index-page");
    const clientes_page = document.getElementById("clientes-page");
    const pedidos_page = document.getElementById("pedidos-page");

    index_link.addEventListener("click", function () {
        index_page.classList.add("active");
        clientes_page.classList.remove("active");
        pedidos_page.classList.remove("active");

        index_link.classList.add("selected");
        clientes_link.classList.remove("selected");
        pedidos_link.classList.remove("selected");
    })

    clientes_link.addEventListener("click", function () {
        index_page.classList.remove("active");
        clientes_page.classList.add("active");
        pedidos_page.classList.remove("active");

        index_link.classList.remove("selected");
        clientes_link.classList.add("selected");
        pedidos_link.classList.remove("selected");
    })

    pedidos_link.addEventListener("click", function () {
        index_page.classList.remove("active");
        clientes_page.classList.remove("active");
        pedidos_page.classList.add("active");

        index_link.classList.remove("selected");
        clientes_link.classList.remove("selected");
        pedidos_link.classList.add("selected");
    })
}



// inicializar funcoes de binds, conexoes, etc
app.init = function () {
    app.bindNavigation();
}


// inicializar script quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
    app.init();

    const status_label = document.getElementById("status");
    status_label.innerHTML = "Conectando ao servidor...";

    app.get(API_URL+"/Status", function (data, status) {

        if(status == 200)
        {
            status_label.innerHTML = "Conectado ao servidor";
            status_label.style.color = "green";
        }

    },
    function(status) {
        status_label.innerHTML = "Erro de conexão com o servidor";
        status_label.style.color = "red";
    }
    );


    // get clientes
    app.get(API_URL+"/Cliente", function (data, status) {

        const cliente_count = document.getElementById("cliente-count");
        cliente_count.innerHTML = data.length;

    });

    // get pedidos
    app.get(API_URL+"/Pedido", function (data, status) {
            
            const pedido_count = document.getElementById("pedido-count");
            pedido_count.innerHTML = data.length;
    
        })
})
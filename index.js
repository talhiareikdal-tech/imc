if(window.location.pathname.endsWith('index.html') && !localStorage.getIdem('token')){
    window.location.href = "login";
}

         function abrirTab(index){
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

            document.querySelectorAll('.tab-content')[index].classList.add('active');
            document.querySelectorAll('.tab-btn')[index].classList.add('active');
        }
        function formatarResposta(resultado){
            if(resultado.erro){
                return `<div style="color: #721c24; padding: 15px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; font-weight: bold">
                    errro: ${resultado.erro}</div>`;
            }    
            let html=`<div style="padding: 15px; background: #d4edda; color: #155724; borde": 1px solid #c3e6cb; border-radius: 5px;">`;
                html+=`<h3 style="margin-top=0; margin-bottom: 15px; border-bottom: 1px solid #c3e6cb; padding-bottom: 5px;">Sucesso</h3>`;
                html+=`<ul style="list-style-type: none; padding-left: 0; margin: 0;">`;
                
                for(const[key, value] of Object.entries(resultado)){
                    let label= key.charAt(0).toUpperCase() + key.slice(1);
                    if(key.toLowerCase() === "imc"){
                        label == "IMC";
                    }
                    html+=`<li style="margin-bottom: 8px; font-size: 16px;">
                        <strong style="color: #0b2e13">${label}</strong> ${value}
                        </li>`
                }
                html+=`</ul>
                </div>`;
                return html;
        }
        async function cadastrarCliente(){
            const dados = {
                nome: document.getElementById("nome").value,
                cpf: document.getElementById("cpf").value,
                cep: document.getElementById("cep").value
            }

            try {
                const res = await fetch("http://localhost:3000/cadastro_cliente", {
                    method: "POST", 
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });
              
                const resultado = await res.json();
             
                document.getElementById("resultadoImc").innerHTML = formatarResposta(resultado);
            } catch (error) {
       
             document.getElementById("resultadoImc").innerHTML = formatarResposta({
                erro: "Ocorreu um erro inesperado. Por favor tente novamente mais tarde."
             });   
            }
        }
  
    async function calcularMedia(){
            const dados = {
                nota1: document.getElementById("nota1").value,
                nota2: document.getElementById("nota2").value
            }

            try {
                const res = await fetch("http://localhost:3000/media", {
                    method: "POST", 
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });
              
                const resultado = await res.json();
             
                document.getElementById("resultadoMedia").innerHTML = formatarResposta(resultado);
            } catch (error) {
       
             document.getElementById("resultadoMedia").innerHTML = formatarResposta({
                erro: "Ocorreu um erro inesperado. Por favor tente novamente mais tarde."
             });   
            }
        }
    
    async function login(){
            const dados = {
                
                email: document.getElementById("email").value,
                senha: document.getElementById("senha").value
            }

            try {
                const res = await fetch("http://localhost:3000/login", {
                    method: "POST", 
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(dados)
                });
              
                const resultado = await res.json();
                if(resultado.token){
                    localStorage.setItem("token", resultado.token); // Mantém as informações de login salvasno navegador
                    window.location.href = "index.html"; // Redireciona para a página de dashboard
                    
                }
                    
                else{
                    alert(resultado.erro);
                }
             
            } catch (error) {
       
             document.getElementById("resultadoLogin").innerHTML = formatarResposta({
                erro: "Ocorreu um erro inesperado. Por favor tente novamente mais tarde."
             });   
            }
        }
    function logout(){
        localStorage.removeItem("token")
        window.location.href = "login.html";
    }
    async function buscaCep(){
    const cep = document.getElementById("cep").value;

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if(!response.ok) {
                    throw new error('Erro na requisição:' + response.status);
                }
                return response.json();
            })
            .then(data => {
               // alert(data)
               document.getElementById('rua').value= data.logradouro
               document.getElementById('cidade').value= data.localidade
               document.getElementById('estado').value= data.estado
               document.getElementById('numero').focus()
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    async function cadastrarCliente(){
        const dados = {
            nome: document.getElementById("nome").value,
            cpf: document.getElementById("cpf").value,
            cep: document.getElementById("cep").value,
            rua: document.getElementById("rua").value,
            cidade: document.getElementById("cidade").value,
            estado: document.getElementById("estado").value,
            numero: document.getElementById("numero").value
        }


        try {
            const res = await fetch("http://localhost:3000/clientes", {
                method: "POST", 
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(dados)
            });
          
            const resultado = await res.json();
         
            document.getElementById("resultadoCliente").innerHTML = formatarResposta(resultado);
        } catch (error) {
   
         document.getElementById("resultadoCliente").innerHTML = formatarResposta({
            erro: "Ocorreu um erro inesperado. Por favor tente novamente mais tarde."
         });   
        }
    }
    async function buscarClientes(){
        const cpfBusca = document.getElementById("buscar_cpf").value.trim()
        if(!cpfBusca){
            listarClientes()
            return;
        }
        try {
            const res = await fetch("http://localhost:3000/clientes")
            const clientes = await res.json();
            const cpfLimpo = cpfBusca.replace(/\D/g, '');
            const filtrados = clientes.filter(c=>c.cpf && c.cpf.replace(/\D/g,'')==cpfLimpo);
            renderizarClientes(filtrados);
        } catch (error) {
            const container = document.getElementById("listarClientes");
            if(container){
                container.innerHTML=`<div style= "color:#721c24; padding:15px; background:#f8d7da; border: 1px solid #f5c6cb; border-radius: 5px"> façha ao buscar cliente</div>`
            }
        }
    }
    async function listarClientes(){
        const buscarInput = document.getElementById("buscar_cpf")
        if(buscarInput){
            buscarInput.value = '';
        }
        try {
            const res = await fetch("http://localhost:3000/clientes");
            const clientes = await res.json();
            renderizarClientes(clientes);
        } catch (error) {
            const container = document.getElementById("listarClientes");
            if(container){
                container.innerHTML=`<div style= "color:#721c24; padding:15px; background:#f8d7da; border: 1px solid #f5c6cb; border-radius: 5px"> falha ao carregar clientes do servidor</div>`
            }
        }
    }
    function renderizarClientes(clientes){
        const container = document.getElementById("listarClientes");
        
    }

   
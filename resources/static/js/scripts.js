const btnFI = document.getElementById("btn finalizar-inscricao");

btnFI.addEventListener("click", insertUser)

async function insertUser(){

     const usuario = {

          cpf: document.getElementById("input_cpf").value,
          nome: document.getElementById("input_nome").value + " " +document.getElementById("input_sobrenome").value,
          idade: document.getElementById("input_idade").value,
          email: document.getElementById("input_email").value,
          dia: "1",
          primReserva: null,
          segReserva: null,
          situação: true
          
        };
      
        let url = "http://localhost:8080/users";
      
        let resultado = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuario) // Converte o objeto usuario em JSON
        });
      
        if (resultado.status === 201) {
          console.log("Usuário adicionado com sucesso");
        }
          else if (resultado.status === 200) {       
           console.log("Usuario adicionado com sucesso!");
       }
          
       else {  
           console.log("Erro ao adicionar o usuario. Status:", resultado.status);
       }
}

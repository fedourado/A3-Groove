const btn = document.getElementById("btn_enviar");
const txtInput = document.getElementById("txt_input");
const txtOutput = document.getElementById("txt_output");
const deleteBtn = document.getElementById("btn_excluir");
const btnUpdateReserva = document.getElementById("btn_atualizar_reserva");
const btnAddUser = document.getElementById("btn_adicionar");

btn.addEventListener("click", getUserData);
deleteBtn.addEventListener("click", deleteUserData);
btnAddUser.addEventListener("click", addUserData);
btnUpdateReserva.addEventListener("click", updateUserReserva);

// Função para obter os dados do usuário
async function getUserData() {
  let codigo = txtInput.value;
  let url = "http://localhost:8080/user/" + codigo;

  let resultado = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(resultado);

  if (resultado.status == 200) {
    let dados = await resultado.json();
    console.log(dados);
    let cpf = dados["cpf"];
    let nome = dados["nome"];
    let idade = dados["idade"];
    let email = dados["email"];
    let reserva = dados["reserva"];
    txtOutput.value = "CPF: " + cpf + "\n" + "Nome: " + nome + "\n" + "Idade: " + idade + "\n" + "Email: " + email + "\n" + "Reserva: " + reserva;
  } else {
    console.log("Usuário não encontrado");
    txtOutput.value = "Usuário não encontrado";
  }
}

// Função para adicionar um novo usuário
async function addUserData() {
  const usuario = {
    cpf: document.getElementById("input_cpf").value,
    nome: document.getElementById("input_nome").value,
    idade: document.getElementById("input_idade").value,
    email: document.getElementById("input_email").value,
    reserva: document.getElementById("input_reserva").value
  };

  let url = "http://localhost:8080/user";

  let resultado = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario) // Converte o objeto usuario em JSON
  });

  if (resultado.status === 201) {
    txtOutput.value = "Usuário adicionado com sucesso!";
    console.log("Usuário adicionado com sucesso");
  }
    else if (resultado.status === 200) {
     txtOutput.value = "Usuario adicionado com sucesso!";
     console.log("Usuario adicionado com sucesso!");
 }
    
 else {
     txtOutput.value = "Erro: " + resultado.status + " - Não foi possível adicionar o usuario.";
     console.log("Erro ao adicionar o usuario. Status:", resultado.status);
 }
}



// Função para atualizar o atributo reserva do usuário
async function updateUserReserva() {
     let codigo = txtInput.value;    
     let url = "http://localhost:8080/user/" + codigo + "?reserva=" + encodeURIComponent(document.getElementById("input_reserva").value);
 
     // Verifique se o campo de reserva não está vazio
     if (!document.getElementById("input_reserva").value) {
         txtOutput.value = "Erro: O campo 'reserva' não pode estar vazio.";
         console.log("Erro: O campo 'reserva' não pode estar vazio.");
         return; 
     }
 
     let resultado = await fetch(url, {
         method: "PUT",
         headers: {
             "Content-Type": "application/json",
         },
     });   
 
     console.log("Status da resposta:", resultado.status); 
 
     if (resultado.status === 200) {
         txtOutput.value = "Reserva atualizada com sucesso!";
         console.log("Reserva atualizada com sucesso");
     } else if (resultado.status === 404) {
         txtOutput.value = "Erro: Usuário não encontrado.";
         console.log("Erro: Usuário não encontrado");
     } else {
         txtOutput.value = "Erro: " + resultado.status + " - Não foi possível atualizar a reserva.";
         console.log("Erro ao atualizar a reserva. Status:", resultado.status);
     }
 }

// Função para excluir o usuário

async function deleteUserData() {
  let codigo = txtInput.value;    
  let url = "http://localhost:8080/user/" + codigo;
      
  let resultado = await fetch(url, {
    method: "DELETE",    
    headers: {   
      "Content-Type": "application/json",    
    },
  });   

  console.log("Status da resposta:", resultado.status); 

  if (resultado.status === 200) {
    txtOutput.value = "Usuário excluído com sucesso!";
    console.log("Usuário excluído com sucesso");
  } else if (resultado.status === 204) {
    txtOutput.value = "Usuário excluído com sucesso!";
    console.log("Usuário excluído com sucesso, status 204");
  } else if (resultado.status === 404) {
    txtOutput.value = "Erro: Usuário não encontrado.";
    console.log("Erro: Usuário não encontrado");
  } else {
    txtOutput.value = "Erro: " + resultado.status + " - Não foi possível excluir o usuário.";
    console.log("Erro ao excluir o usuário. Status:", resultado.status);
  }
}

function isValidCPF(cpf) 
{ // Verifica se o CPF tem 11 dígitos e não é uma sequência de dígitos iguais 
    if (cpf.length !== 11) { 
        return false; 
    } 
    
    return true; 
} 

function getPersonDetails(cpf) { 
    // Aqui você pode verificar se o CPF está cadastrado em sua base de dados 
    var people = {
        "99999999999": { nome: "João", sobrenome: "Silva", ingresso: "Day" }, 
        "99988877760": { nome: "Paula", sobrenome: "Bronkys", ingresso: "VIP" }, 
        "12345678910": { nome: "Maria", sobrenome: "Oliveira", ingresso: "Pass" }
    }
    return people[cpf]; 
} 

$(document).ready(function() { 
    console.log("JQuery está funcionand!")

    $('#cpfForm').on('submit', function(e) { 
        e.preventDefault(); 
        console.log("Formlário enviado")

        var cpf = $('#cpf').val(); 
        
        if (!isValidCPF(cpf)) { 
            console.log("CPF inválido")
            $('#result').html('<div class="alert alert-danger mt-3">CPF inválido. Por favor, tente novamente.</div>'); 
            $('#position').val(''); // Limpa o campo de posição 
            $('#name').val(''); 
            $('#ticket').val('');
            return; 
        } 

        var details = getPersonDetails(cpf);

        if (!details) { 
            console.log("CPF não cadastrado"); 
            $('#result').html('<div class="alert alert-warning mt-3">CPF não cadastrado. Por favor, verifique seu CPF.</div>'); 
            $('#position').val(''); // Limpa o campo de posição 
            $('#name').val(''); 
            $('#ticket').val(''); 
            return; 
        }
        
        // Exemplo fictício: 
        
        var position = Math.floor(Math.random() * 100) + 1; 
        console.log("Posição na fila: " + position + "ª")
        $('#result').html(''); // Limpa mensagens de erro anteriores 
        $('#position').val(position + "ª");
        $('#name').val(details.nome + " " + details.sobrenome);
        $('#ticket').val(details.ingresso);
    }); 
});
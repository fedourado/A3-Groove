$(document).ready(function() {
    console.log("JQuery está funcionando!");

    var removedCpfs = [];

    function isValidCPF(cpf) {
        // Verifica se o CPF tem 11 dígitos e não é uma sequência de dígitos iguais
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }
        return true;
    }

    function getPersonDetails(cpf) {
        // Aqui você pode verificar se o CPF está cadastrado em sua base de dados
        var people = {
            "99999999999": { nome: "João", sobrenome: "Silva", ingresso: "Day" },
            "99988877760": { nome: "Paula", sobrenome: "Bronkys", ingresso: "VIP" },
            "12345678910": { nome: "Maria", sobrenome: "Oliveira", ingresso: "Pass" },
            "32036039099": { nome: "Carlos", sobrenome: "Oliveira", ingresso: "Pass" }
        };
        return people[cpf];
    }

    $('#cpfForm').on('submit', function(e) {
        e.preventDefault();
        console.log("Formulário enviado");

        var cpf = $('#cpf').val();

        if (!isValidCPF(cpf)) {
            console.log("CPF inválido");
            $('#result').html('<div class="alert alert-danger mt-3">CPF inválido. Por favor, tente novamente.</div>');
            $('#position').val(''); // Limpa o campo de posição
            $('#name').val('');
            $('#ticket').val('');
            return;
        }

        if (removedCpfs.includes(cpf)) {
            console.log("CPF removido");
            $('#result').html('<div class="alert alert-danger mt-3">Você já saiu da fila e não pode mais consultar sua posição.</div>');
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

        if (details.ingresso === "VIP") {
            console.log("Ingresso VIP");
            $('#result').html('<div class="alert alert-info mt-3">Esse ingresso não precisa de fila. Espere o recebimento do e-mail para adquiri-lo.</div>');
            $('#position').val(''); // Limpa o campo de posição
            $('#name').val('');
            $('#ticket').val('');
            return;
        }

        // Exemplo fictício:
        var position = Math.floor(Math.random() * 100) + 1;
        console.log("Posição na fila: " + position + "ª");
        $('#result').html(''); // Limpa mensagens de erro anteriores
        $('#position').val(position + "ª");
        $('#name').val(details.nome + " " + details.sobrenome);
        $('#ticket').val(details.ingresso);
        $('#exit-btn').data('position', position); // Armazena a posição para usar no botão de sair
        $('#exit-btn').data('cpf', cpf); // Armazena o CPF para usar na remoção
    });

    // Gerencia a saída da fila
    $('#exit-btn').on('click', function() {
        var position = $(this).data('position');
        if (position !== undefined) {
            $('#confirmationModal').modal('show');
        } else {
            alert('Nenhuma posição na fila para sair.');
        }
    });

    $('#confirm-checkbox').on('change', function() {
        $('#confirm-exit-btn').prop('disabled', !this.checked);
    });

    $('#confirm-exit-btn').on('click', function() {
        var cpf = $('#exit-btn').data('cpf');
        if (cpf !== undefined) {
            // Remove a pessoa da fila
            $('#position').val('');
            $('#name').val('');
            $('#ticket').val('');
            $('#exit-btn').data('position', undefined); // Limpa a posição armazenada
            $('#exit-btn').data('cpf', undefined); // Limpa o CPF armazenado
            $('#confirmationModal').modal('hide');
            
            // Exibir o modal de sucesso
            $('#successModal').modal('show');

            // Adiciona o CPF ao array de CPFs removidos
            removedCpfs.push(cpf);
        }
    });

    // Remove o backdrop quando o modal de sucesso é fechado
    $('#successModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    });

    // Garantir que o backdrop seja removido sempre que qualquer modal for fechado
    $('.modal').on('hidden.bs.modal', function () {
        if ($('.modal').hasClass('show')) {
            $('body').addClass('modal-open');
        } else {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        }
    });
});

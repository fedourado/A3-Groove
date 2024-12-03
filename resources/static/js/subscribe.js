document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.day-elipse');
    const tableContainer = document.getElementById('ticket-table');
    const tableBody = document.querySelector('table tbody');
    const continueBtn = document.getElementById('btn-finalizar');
    const finalizeSubscribeBtn = document.getElementById('finalizar-btn');
    const formContainer = document.getElementById('checkout-form-container');
    const removeButton = document.getElementById('btn-remover');
    const daySelectContainer = document.getElementById('day-select-container');
    const confirmationModalElement = document.getElementById('confirmationModal');
    const submissionConfirmationModalElement = document.getElementById('successModal');
    const errorModalElement = document.getElementById('errorModal');
    const modalElement = document.getElementById('modalAlert');

    let ticketSelected = false;
    let selectedTicketType = null; // Variável para armazenar o tipo de ingresso selecionado

    // Verificação de existência dos elementos
    if (!tableContainer || !tableBody || !continueBtn || !finalizeSubscribeBtn || !formContainer || !removeButton || !daySelectContainer || !confirmationModalElement || !submissionConfirmationModalElement || !modalElement) {
        console.error('Um ou mais elementos não foram encontrados no DOM');
        return;
    }

    // Inicializa os modais
    const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
    });
    const confirmationModal = new bootstrap.Modal(confirmationModalElement);
    const submissionConfirmationModal = new bootstrap.Modal(submissionConfirmationModalElement);
    const errorModal = new bootstrap.Modal(errorModalElement); // Inicializa o modal de erro
    const confirmRemoveButton = document.getElementById('confirm-remove-button');
    console.log('Modais inicializados');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            const ticketType = this.getAttribute('data-ticket');
            console.log(`Card clicado: ${ticketType}`);

            // Verifica se já existe um ingresso selecionado
            if (ticketSelected) {
                modal.show(); // Mostrar o modal de alerta
            } else {
                updateTicketTable(ticketType);
                ticketSelected = true;
                selectedTicketType = ticketType; // Armazena o tipo de ingresso selecionado
                tableContainer.classList.remove('d-none');
                continueBtn.classList.remove('d-none');

                // Mostrar/ocultar o formulário com base no tipo de ingresso
                daySelectContainer.style.display = (ticketType === 'Groove Day') ? 'block' : 'none';
            }
        });
    });

    function updateTicketTable(ticketType) {
        console.log(`Atualizando tabela com ingresso: ${ticketType}`);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td></td>
            <td>Groove</td>
            <td>${ticketType}</td>
            <td></td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-danger" onclick="removeTicket(this)">Remover</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    }

    window.removeTicket = function (button) {
        if (formContainer.style.display === 'block') {
            confirmationModal.show();
            confirmRemoveButton.onclick = function () {
                confirmationModal.hide();
                location.reload();
            };
        } else {
            const row = button.closest('tr');
            row.remove();
            ticketSelected = false;
            selectedTicketType = null; // Reseta o tipo de ingresso selecionado
            tableContainer.classList.add('d-none');
            continueBtn.classList.add('d-none');
            daySelectContainer.style.display = 'none';
        }
    };

    if (removeButton) {
        removeButton.addEventListener('click', function () {
            if (formContainer.style.display === 'block') {
                confirmationModal.show();
                confirmRemoveButton.onclick = function () {
                    confirmationModal.hide();
                    location.reload();
                };
            } else {
                formContainer.remove();
                tableContainer.classList.add('d-none');
                daySelectContainer.style.display = 'none';
            }
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', function () {
            formContainer.style.display = 'block';
            continueBtn.style.display = 'none';
        });
    }

    function validateCPF(cpfInput) {
        const cpf = cpfInput.value;

        // Verifica o formato do CPF
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            cpfInput.classList.add('is-invalid');
            return false;
        }

        // Remove formatação (pontos e hífen) para cálculo
        const cpfNumbers = cpf.replace(/\D/g, '');

        // Verifica se o CPF tem 11 dígitos
        if (cpfNumbers.length !== 11) {
            cpfInput.classList.add('is-invalid');
            return false;
        }

        // Função para calcular o dígito verificador
        const calculateVerifier = (cpfArray, length) => {
            let sum = 0;
            for (let i = 0; i < length; i++) {
                sum += parseInt(cpfArray[i]) * (length + 1 - i);
            }
            const remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        };

        // Divide o CPF em partes para cálculo
        const firstNineDigits = cpfNumbers.slice(0, 9).split('');
        const firstVerifier = calculateVerifier(firstNineDigits, 9);

        const firstTenDigits = cpfNumbers.slice(0, 10).split('');
        const secondVerifier = calculateVerifier(firstTenDigits, 10);

        // Verifica se os dígitos verificadores calculados correspondem aos fornecidos
        const isValid =
            firstVerifier === parseInt(cpfNumbers[9]) &&
            secondVerifier === parseInt(cpfNumbers[10]);

        if (!isValid) {
            cpfInput.classList.add('is-invalid');
            return false;
        } else {
            cpfInput.classList.remove('is-invalid');
            return true;
        }
    }

    const checkoutForm = document.getElementById('checkout-form-container');
    if (checkoutForm) {
        finalizeSubscribeBtn.addEventListener('click', async function (event) {
            event.preventDefault();
        
            const cpfInput = document.getElementById('document-number');
            if (!validateCPF(cpfInput)) {
                console.log('CPF inválido');
                return;
            }
        
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value + " " + document.getElementById('last-name').value;
            const age = document.getElementById('age').value;
        
            let dia;
            let situacao = true;
        
            if (selectedTicketType === "Groove Day") {
                const dayText = document.getElementById('day-select').value;
                dia = (dayText === "Dia 1 - Dia 20 de Setembro (Sábado)") ? "1" : "2";
            } else if (selectedTicketType === "Groove Pass") {
                dia = "Pass";
            } else if (selectedTicketType === "Groove Vip") {
                situacao = false;
                dia = "VIP";
            }
        
            const url = (selectedTicketType === "Groove Vip") 
                ? "http://localhost:8080/users/VIP" 
                : "http://localhost:8080/users";
        
            const data = {
                cpf: cpfInput.value, // Use .value para obter o texto do input
                email: email,
                nome: name,
                idade: age,
                dia: dia,
                primReserva: null,
                segReserva: null,
                situação: situacao
            };
        
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data) // Serializa o objeto corretamente
                });
        
                if (response.ok) {
                    console.log("Usuário adicionado com sucesso!");
                    submissionConfirmationModal.show();
                } else {
                    console.error("Erro ao adicionar o usuário. Status:", response.status);
                    errorModal.show();
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                errorModal.show();
            }
        });
    }
})
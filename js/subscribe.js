document.addEventListener('DOMContentLoaded', function() {
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
    const modalElement = document.getElementById('modalAlert');
    let ticketSelected = false; // Variável de controle para seleção de ingresso

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
    const confirmRemoveButton = document.getElementById('confirm-remove-button');
    console.log('Modais inicializados');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const ticketType = this.getAttribute('data-ticket');
            console.log(`Card clicado: ${ticketType}`);

            // Verifica se já existe um ingresso selecionado
            if (ticketSelected) {
                modal.show(); // Mostrar o modal de alerta
            } else {
                updateTicketTable(ticketType);
                ticketSelected = true; // Marca como selecionado
                tableContainer.classList.remove('d-none'); // Mostra a tabela
                continueBtn.classList.remove('d-none'); // Mostra o botão de continuar

                // Mostrar/ocultar o formulário com base no card clicado
                if (ticketType === 'Groove Day') {
                    daySelectContainer.style.display = 'block'; // Mostra o formulário
                } else {
                    daySelectContainer.style.display = 'none'; // Oculta o formulário
                }
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

    window.removeTicket = function(button) {
        if (formContainer.style.display === 'block') {
            confirmationModal.show(); // Exibe o modal de confirmação
            confirmRemoveButton.onclick = function() {
                confirmationModal.hide(); // Esconde o modal
                location.reload(); // Recarrega a página
            };
        } else {
            const row = button.closest('tr');
            row.remove();
            ticketSelected = false; // Marca como não selecionado após remoção
            tableContainer.classList.add('d-none'); // Oculta a tabela se não houver ingressos
            continueBtn.classList.add('d-none'); // Oculta o botão de continuar se não houver ingressos
            daySelectContainer.style.display = 'none'; // Oculta o formulário ao remover o ingresso
        }
    };

    if (removeButton) {
        removeButton.addEventListener('click', function() {
            if (formContainer.style.display === 'block') {
                confirmationModal.show(); // Exibe o modal de confirmação
                confirmRemoveButton.onclick = function() {
                    confirmationModal.hide(); // Esconde o modal
                    location.reload(); // Recarrega a página
                };
            } else {
                formContainer.remove();
                tableContainer.classList.add('d-none');
                daySelectContainer.style.display = 'none'; // Oculta o formulário
            }
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            formContainer.style.display = 'block'; // Mostra o formulário
            continueBtn.style.display = 'none'; // Oculta o botão de continuar
        });
    }

    const checkoutForm = document.getElementById('checkout-form-container');
    if (checkoutForm) {
        finalizeSubscribeBtn.addEventListener('click', function(event) { 
            event.preventDefault();
            checkoutForm.dispatchEvent(new Event('submit')); 
        });

        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Formulário submetido');

            // Validação do CPF
            const cpfInput = document.getElementById('document-number');
            const cpf = cpfInput.value;
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!cpfRegex.test(cpf)) {
                cpfInput.classList.add('is-invalid');
                console.log('CPF inválido');
            } else {
                cpfInput.classList.remove('is-invalid');
            }

            // Continua somente se a validação do CPF for bem-sucedida
            if (cpfRegex.test(cpf)) {
                const email = document.getElementById('email').value;
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const ticketType = tableBody.querySelector('tr td:nth-child(3)').textContent;

                const data = {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    cpf: cpf,
                    ticketType: ticketType
                };

                console.log('Dados para enviar:', data);

                fetch('sua_api_url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(response => response.json())
                  .then(data => {
                      console.log('Sucesso:', data);
                      submissionConfirmationModal.show(); // Mostrar o modal de confirmação
                  })
                  .catch(error => {
                      console.error('Erro:', error);
                  });
            }
        });
    } else {
        console.error('Formulário de checkout não encontrado');
    }
});

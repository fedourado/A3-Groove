document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.day-elipse');
    const tableContainer = document.getElementById('ticket-table');
    const tableBody = document.querySelector('table tbody');
    const finalizeButton = document.getElementById('btn-finalizar');
    const formContainer = document.getElementById('checkout-form-container');
    let ticketSelected = false; // Variável de controle para seleção de ingresso

    // Inicializa o modal com backdrop estático e desativa a tecla ESC para fechar
    const modalElement = document.getElementById('modalAlert');
    const modal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
    });

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
                finalizeButton.classList.remove('d-none'); // Mostra o botão de finalizar
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
        const row = button.closest('tr');
        row.remove();
        ticketSelected = false; // Marca como não selecionado após remoção
        tableContainer.classList.add('d-none'); // Oculta a tabela se não houver ingressos
        finalizeButton.classList.add('d-none'); // Oculta o botão de finalizar se não houver ingressos
    };

    finalizeButton.addEventListener('click', function() {
        formContainer.style.display = 'block'; // Mostra o formulário
        finalizeButton.style.display = 'none'; // Oculta o botão de finalizar
    });

    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validação do CPF
        const cpfInput = document.getElementById('document-number');
        const cpf = cpfInput.value;
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!cpfRegex.test(cpf)) {
            cpfInput.classList.add('is-invalid');
        } else {
            cpfInput.classList.remove('is-invalid');
        }

        // Validação do Telefone
        const phoneInput = document.getElementById('phone');
        const phoneNumber = phoneInput.value;
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!phoneRegex.test(phoneNumber)) {
            phoneInput.classList.add('is-invalid');
        } else {
            phoneInput.classList.remove('is-invalid');
        }

        // Continua somente se as duas validações forem
        if (cpfRegex.test(cpf) && phoneRegex.test(phoneNumber)) {
            const email = document.getElementById('email').value;
            const firstName = document.getElementById('name').value;
            const lastName = document.getElementById('last-name').value;
            const ticketType = tableBody.querySelector('tr td:nth-child(3)').textContent;

            const data = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                cpf: cpf,
                phoneNumber: phoneNumber,
                ticketType: ticketType
            };

            fetch('sua_api_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => response.json())
              .then(data => {
                  console.log('Sucesso:', data);
                  // Redirecionar ou mostrar mensagem de sucesso
              })
              .catch(error => {
                  console.error('Erro:', error);
              });
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const setorSelect = document.getElementById('setor2');
    const confirmButton = document.getElementById('finalizar-btn');
    const setorEscolhido = document.getElementById('setorEscolhido');
    const successModalElement = new bootstrap.Modal(document.getElementById('popup-confirm')); // Inicialize o modal
    const closeButton = document.getElementById('btn-fechar'); // Botão para fechar o modal

    setorSelect.addEventListener('change', function() {
        const setor = setorSelect.value;

        if (setor) {
            confirmButton.disabled = false;
        } else {
            confirmButton.disabled = true;
        }
    });

    const setorForm = document.getElementById('setorForm');
    setorForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão de envio do formulário

        const setor = setorSelect.value;
        setorEscolhido.textContent = setor;
        successModalElement.show(); // Mostrar o modal de confirmação
    });

    closeButton.addEventListener('click', function() {
        successModalElement.hide(); // Fechar o modal de confirmação
    });
});

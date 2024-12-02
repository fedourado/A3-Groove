document.addEventListener('DOMContentLoaded', function() {
    const checkbox1 = document.getElementById('flexCheckDefault');
    const checkbox2 = document.getElementById('flexCheckChecked');
    const finalizeBtn = document.getElementById('finalizar-btn');
    const cpfInput = document.getElementById('document-number');
    const ageInput = document.getElementById('age');

    // Verificação de existência dos elementos
    if (!checkbox1 || !checkbox2 || !finalizeBtn || !cpfInput || !ageInput) {
        console.error('Um ou mais elementos não foram encontrados no DOM');
        return;
    }

    // Máscara de CPF
    function maskCPF(value) {
        return value.replace(/\D/g, "")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // Event listener para aplicar a máscara de CPF e impedir inserção de letras
    cpfInput.addEventListener('input', function() {
        cpfInput.value = maskCPF(cpfInput.value);
    });

    // Função para validar idade
    function validateAge() {
        const age = parseInt(ageInput.value, 10);
        if (age < 16) {
            ageInput.setCustomValidity('Você deve ter mais de 16 anos!');
            ageInput.classList.add('is-invalid');
        } else {
            ageInput.setCustomValidity('');
            ageInput.classList.remove('is-invalid');
        }
    }

    // Função para limpar a mensagem de erro quando o usuário começa a digitar novamente
    function clearAgeError() {
        ageInput.setCustomValidity('');
        ageInput.classList.remove('is-invalid');
    }

    // Garanti que o campo idade só permita números e seja >= 16
    ageInput.addEventListener('input', function() {
        clearAgeError(); // Limpa a mensagem de erro antes de validar novamente
        validateAge();
    });

    function updateButtonState() {
        finalizeBtn.disabled = !(checkbox1.checked && checkbox2.checked);
    }

    checkbox1.addEventListener('change', updateButtonState);
    checkbox2.addEventListener('change', updateButtonState);

    // Inicializa o estado do botão de finalizar
    updateButtonState();
});

const cpfInput = document.getElementById('cpf');

// Máscara de CPF
function maskCPF(value) {
    return value.replace(/\D/g, "")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// aplica a máscara de CPF e impedir inserção de letras
cpfInput.addEventListener('input', function() {
    cpfInput.value = maskCPF(cpfInput.value);
});
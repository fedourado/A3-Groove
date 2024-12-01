document.addEventListener('DOMContentLoaded', function() {
    const setorSelect = document.getElementById('setor');
    const confirmButton = document.getElementById('finalizar-btn');
    const setorEscolhido = document.getElementById('setorEscolhido');

    setorSelect.addEventListener('change', function() {
        const setor = setorSelect.value;

        if (setor) {
            confirmButton.disabled = false;
        } else {
            confirmButton.disabled = true;
        }
    });

    confirmButton.addEventListener('click', function() {
        const setor = setorSelect.value;
        setorEscolhido.textContent = setor;
        $('#popup-confirm').modal('show');
    });
});

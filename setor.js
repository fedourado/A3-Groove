document.addEventListener('DOMContentLoaded', function() {
    const setorSelect2 = document.getElementById('setor2');
    const setorSelect1 = document.getElementById("setor")
    const confirmButton = document.getElementById('finalizar-btn');
    const setorEscolhido = document.getElementById('setorEscolhido');
    const successModalElement = new bootstrap.Modal(document.getElementById('popup-confirm')); // Inicialize o modal
    const closeButton = document.getElementById('btn-fechar'); // Botão para fechar o modal

    function getParameterByName(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name); // Retorna o valor do parâmetro 'cpf'
    }
    const cpf = getParameterByName('cpf');
    console.log(cpf)


    setorSelect2.addEventListener('change', function() {
        const setor = setorSelect2.value;
        console.log(setor)

        if (setor) {
            confirmButton.disabled = false;
        } else {
            confirmButton.disabled = true;
        }
    });

    const setorForm = document.getElementById('setorForm');
    setorForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Previne o comportamento padrão de envio do formulário

        const setor1 = setorSelect1.value;
        const setor2 = setorSelect2.value;

        setorEscolhido.textContent = setor1 +" e "+ setor2;

        o
    });

    closeButton.addEventListener('click', function() {
        successModalElement.hide(); // Fechar o modal de confirmação
    });

    closeButtonFailure.addEventListener('click', function () {
        failureModalElement.hide(); // Fechar o modal de falha
    });

    confirmButton.addEventListener('click', async () => {
        try {
            // Tenta atualizar as reservas Prim e Seg
            await updatePrimReserva(cpf);
            await updateSegReserva(cpf);

            // Exibe o modal de sucesso após ambas as atualizações
            successModalElement.show();
        } catch (error) {
            console.error("Erro ao processar reservas:", error);

            // Exibe o modal de falha se ocorrer erro
            failureModalElement.show();
        }

    async function updatePrimReserva(cpf) {
        const setor = setorSelect1.value; // Assumindo que setorSelect é um elemento do tipo select onde o usuário escolhe o setor
    
        try {
            // Primeira requisição para obter os dados do usuário
            let url = "http://localhost:8080/users/" + cpf;
            const response = await fetch(url, {
                headers: { "Content-Type": "application/json" },
            });
    
            if (response.status === 200) {
                const data = await response.json();
                console.log(data.dia);
    
                // URL para o PUT (sem basear em data.dia, apenas usando o cpf e setor)
                let positionUrl = "http://localhost:8080/users/" + cpf + "/prim-reserva";
    
                // Faz a requisição para atualizar a posição no método PUT
                const resp = await fetch(positionUrl, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(setor),
                });
    
                if (resp.status === 200) {
                    const setoresValidos = ["Pista", "PistaPremium", "Camarote", "VIP"];
                    const diasEspeciais = ["VIP", "Pass"];
    
                    if (diasEspeciais.includes(data.dia) && setoresValidos.includes(setor)) {
                        // Decrementar ambos os setores Prim e Seg
                        let primSectorUrl = "http://localhost:8080/sectors/Prim" + setor + "/decrement";
                        let segSectorUrl = "http://localhost:8080/sectors/Seg" + setor + "/decrement";
    
                        // Decrementa Prim
                        const primDecrementResp = await fetch(primSectorUrl, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                        });
    
                        if (primDecrementResp.status === 200) {
                            console.log("Setor Prim atualizado com sucesso.");
                        } else {
                            console.log("Erro ao atualizar o setor Prim. Status: " + primDecrementResp.status, "warning");
                        }
    
                        // Decrementa Seg
                        const segDecrementResp = await fetch(segSectorUrl, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                        });
    
                        if (segDecrementResp.status === 200) {
                            console.log("Setor Seg atualizado com sucesso.");
                        } else {
                            console.log("Erro ao atualizar o setor Seg. Status: " + segDecrementResp.status, "warning");
                        }
                    } else {
                        // Decrementa com base em Prim ou Seg prefixado ao setor
                        let day = "";
                        if (data.dia === "1") {
                            day = "Prim" + setor;
                        } else if (data.dia === "2") {
                            day = "Seg" + setor;
                        }
    
                        let sectorUrl = "http://localhost:8080/sectors/" + day + "/decrement";
                        const decrementResp = await fetch(sectorUrl, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                        });
    
                        if (decrementResp.status === 200) {
                            console.log("Setor atualizado com sucesso.");
                        } else {
                            console.log("Erro ao atualizar o setor. Status: " + decrementResp.status, "warning");
                        }
                    }
                } else {
                    console.log("Erro ao atualizar a posição do usuário.", "warning");
                }
            } else {
                console.log("CPF não encontrado. Por favor, verifique seu CPF.", "warning");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    }
    
    
    
    async function updateSegReserva(cpf) {
        const setor = setorSelect2.value; // Assumindo que setorSelect2 é um elemento do tipo select onde o usuário escolhe o setor
    
        try {
            // Primeira requisição para obter os dados do usuário
            let url = "http://localhost:8080/users/" + cpf;
            const response = await fetch(url, {
                headers: { "Content-Type": "application/json" },
            });
    
            if (response.status === 200) {
                const data = await response.json();
                console.log(data.dia);
    
                // URL para o PUT (sem basear em data.dia, apenas usando o cpf e setor)
                let positionUrl = "http://localhost:8080/users/" + cpf + "/seg-reserva";
    
                // Faz a requisição para atualizar a posição no método PUT
                const resp = await fetch(positionUrl, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(setor),
                });
    
                if (resp.status === 200) {
                    const setoresValidos = ["Pista", "PistaPremium", "Camarote", "VIP"];
                    const diasEspeciais = ["VIP", "Pass"];
    
                    if (diasEspeciais.includes(data.dia) && setoresValidos.includes(setor)) {
                        // Decrementar ambos os setores Prim e Seg
                        let primSectorUrl = "http://localhost:8080/sectors/Prim" + setor + "/decrement";
                        let segSectorUrl = "http://localhost:8080/sectors/Seg" + setor + "/decrement";
    
                        // Decrementa Prim
                        const primDecrementResp = await fetch(primSectorUrl, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                        });
    
                        if (primDecrementResp.status === 200) {
                            console.log("Setor Prim atualizado com sucesso.");
                        } else {
                            console.log("Erro ao atualizar o setor Prim. Status: " + primDecrementResp.status, "warning");
                        }
    
                        // Decrementa Seg
                        const segDecrementResp = await fetch(segSectorUrl, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                        });
    
                        if (segDecrementResp.status === 200) {
                            console.log("Setor Seg atualizado com sucesso.");
                        } else {
                            console.log("Erro ao atualizar o setor Seg. Status: " + segDecrementResp.status, "warning");
                        }
                    } else {
                        // Decrementa com base em Prim ou Seg prefixado ao setor
                        let day = "";
                        if (data.dia === "1") {
                            day = "Prim" + setor;
                        } else if (data.dia === "2") {
                            day = "Seg" + setor;
                        }
    
                        let sectorUrl = "http://localhost:8080/sectors/" + day + "/decrement";
                        const decrementResp = await fetch(sectorUrl, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                        });
    
                        if (decrementResp.status === 200) {
                            console.log("Setor atualizado com sucesso.");
                        } else {
                            console.log("Erro ao atualizar o setor. Status: " + decrementResp.status, "warning");
                        }
                    }
                } else {
                    console.log("Erro ao atualizar a posição do usuário.", "warning");
                }
            } else {
                console.log("CPF não encontrado. Por favor, verifique seu CPF.", "warning");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    }
    
})
});  
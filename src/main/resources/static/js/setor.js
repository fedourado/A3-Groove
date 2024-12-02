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

        const setor = setorSelect.value;
        setorEscolhido.textContent = setor;
        successModalElement.show(); // Mostrar o modal de confirmação
    });

    closeButton.addEventListener('click', function() {
        successModalElement.hide(); // Fechar o modal de confirmação
    });

    confirmButton.addEventListener('click', async () => {

        await updatePrimReserva(cpf)
        await updateSegReserva(cpf)
        
    
    });

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
                    // Agora, vamos criar a URL para o método PATCH, que depende de data.dia e setor
    
                    let day = ""; // Inicializa a variável day
    
                    // Adiciona o setor específico para a URL do PATCH baseado em data.dia
                    if (data.dia === "1") {
                        // Quando o dia for 1, usa "Prim" antes do setor
                        if (setor === "Pista") {
                            day = "PrimPista";
                        } else if (setor === "PistaPremium") {
                            day = "PrimPistaPremium";
                        } else if (setor === "Camarote") {
                            day = "PrimCamarote";
                        } else if (setor === "VIP") {
                            day = "PrimVIP";
                        }
                    } else if (data.dia === "2") {
                        // Quando o dia for 2, usa "Seg" antes do setor
                        if (setor === "Pista") {
                            day = "SegPista";
                        } else if (setor === "PistaPremium") {
                            day = "SegPistaPremium";
                        } else if (setor === "Camarote") {
                            day = "SegCamarote";
                        } else if (setor === "VIP") {
                            day = "SegVIP";
                        }
                    }
    
                    // Agora, `day` estará corretamente configurado com o valor do setor baseado em `data.dia`
                    let sectorUrl = "http://localhost:8080/sectors/" + day + "/decrement";
    
                    // Faz a requisição para atualizar o setor com o método PATCH
                    const decrementResp = await fetch(sectorUrl, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                    });
    
                    if (decrementResp.status === 200) {
                        console.log("Setor atualizado com sucesso.");
    
                        // Chama o endpoint dequeue somente se o dia não for "VIP"
                        if (data.dia !== "VIP") {
                            let dequeueUrl = "http://localhost:8080/"+data.dia+"/dequeue";
                            const dequeueResp = await fetch(dequeueUrl, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                            });
    
                            if (dequeueResp.status === 200) {
                                console.log("Usuário removido da fila com sucesso.");
                            } else {
                                console.log("Erro ao remover o usuário da fila. Status: " + dequeueResp.status);
                            }
                        }
                    } else {
                        console.log("Erro ao atualizar o setor. Status: " + decrementResp.status, "warning");
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
        const setor = setorSelect2.value; // Assumindo que setorSelect é um elemento do tipo select onde o usuário escolhe o setor
    
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
                    // Agora, vamos criar a URL para o método PATCH, que depende de data.dia e setor
    
                    let day = ""; // Inicializa a variável day
    
                    // Adiciona o setor específico para a URL do PATCH baseado em data.dia
                    if (data.dia === "1") {
                        // Quando o dia for 1, usa "Prim" antes do setor
                        if (setor === "Pista") {
                            day = "PrimPista";
                        } else if (setor === "PistaPremium") {
                            day = "PrimPistaPremium";
                        } else if (setor === "Camarote") {
                            day = "PrimCamarote";
                        } else if (setor === "VIP") {
                            day = "PrimVIP";
                        }
                    } else if (data.dia === "2") {
                        // Quando o dia for 2, usa "Seg" antes do setor
                        if (setor === "Pista") {
                            day = "SegPista";
                        } else if (setor === "PistaPremium") {
                            day = "SegPistaPremium";
                        } else if (setor === "Camarote") {
                            day = "SegCamarote";
                        } else if (setor === "VIP") {
                            day = "SegVIP";
                        }
                    }
    
                    // Agora, `day` estará corretamente configurado com o valor do setor baseado em `data.dia`
                    let sectorUrl = "http://localhost:8080/sectors/" + day + "/decrement";
    
                    // Faz a requisição para atualizar o setor com o método PATCH
                    const decrementResp = await fetch(sectorUrl, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                    });
    
                    if (decrementResp.status === 200) {
                        console.log("Setor atualizado com sucesso.");
    
                        // Chama o endpoint dequeue somente se o dia não for "VIP"
                        if (data.dia !== "VIP") {
                            let dequeueUrl = "http://localhost:8080/"+data.dia+"/dequeue";
                            const dequeueResp = await fetch(dequeueUrl, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                            });
    
                            if (dequeueResp.status === 200) {
                                console.log("Usuário removido da fila com sucesso.");
                            } else {
                                console.log("Erro ao remover o usuário da fila. Status: " + dequeueResp.status);
                            }
                        }
                    } else {
                        console.log("Erro ao atualizar o setor. Status: " + decrementResp.status, "warning");
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
    
});    
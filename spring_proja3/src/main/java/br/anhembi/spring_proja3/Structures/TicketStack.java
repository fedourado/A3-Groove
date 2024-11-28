package br.anhembi.spring_proja3.Structures;

import br.anhembi.spring_proja3.entities.Ticket;

public class TicketStack {

    private Ticket[] stack;
    private int top;

    // Construtor que recebe qtdDisp como parâmetro
    public TicketStack(int qtdDisp) {
        if (qtdDisp <= 0) {
            throw new IllegalArgumentException("QtdDisp must be greater than 0.");
        }

        stack = new Ticket[qtdDisp];
        top = 0;

        // Inicializa a pilha com tickets
        for (int i = 0; i < qtdDisp; i++) {
            stack[i] = new Ticket(i + 1); // Exemplo de inicialização, ajuste conforme necessário
        }
    }

    public boolean isEmpty() {
        return top == 0;
    }

    public boolean isFull() {
        return top == stack.length;
    }

    public boolean stack(Ticket ticket) {
        if (isFull()) {
            return false;
        }
        stack[top++] = ticket;
        return true;
    }

    public Ticket unstack() {
        if (isEmpty()) {
            return null;
        }
        return stack[--top];
    }

    public double getOccupationRate() {
        return Math.round((double) top / stack.length * 100 * 100.0) / 100.0;
    }
}

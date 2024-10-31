package Structures;

public class TicketStack {

     private Ticket stack[];
     private int top;
     private int count;

     public TicketStack(int size) {
          stack = new Ticket[size];
          top = size; // Inicializa top com size para indicar que a pilha está cheia
          count = size; // Count também é definido como size
          // Preenche a pilha com Tickets
          for (int i = 0; i < size; i++) {
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
          if (isEmpty()) {
               return false;
          }
          stack[top++] = ticket;
          count++;
          return true;

     }

     public Ticket unstack() {
          if (isEmpty()) {
               return null;
          }
          count--;
          return stack[--top];
     }

     public double getOccupationRate() {
          return Math.round(((double) count / stack.length * 100) * 100.0) / 100.0;
      }


}

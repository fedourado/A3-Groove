package br.anhembi.spring_proja3.service;

import br.anhembi.spring_proja3.entities.User;

public class UserQueue {

     private User[] queue;
     private int first, last, size, count;

     public UserQueue(int size) {
          queue = new User[size];
          first = 0;
          last = -1; // 'last' começa em -1, será incrementado na primeira inserção
          this.size = size;
          count = 0;
     }

     public boolean isEmpty() {
          return count == 0;
     }

     public boolean isFull() {
          return last == size - 1;
     }
     public boolean isComplete() {
          return count == queue.length;
     }

     public boolean enqueue(User user) {

          if (isFull()) {
               System.out.println("Queue is full");
               return false;
          }
          if (isComplete()) {
               System.out.println("Queue is Complete");
               return false;
          }
         
          last++; // incrementa last diretamente, pois a fila não é circular
          queue[last] = user;
          count++;
          return true;
     }

     public User dequeue() {

         if (isEmpty()) {
               System.out.println("Queue is empty");
               return null;
          }
          User user = queue[first];
          for (int i = first; i < last; i++) {
               queue[i] = queue[i + 1]; // Move todos os elementos para a esquerda
          }
          queue[last] = null; // Limpa a última posição
          last--; // Decrementa o índice do último
          return user;
     }

     public double getOccupationRate() {
          return Math.round(((double) count / size * 100) * 100.0) / 100.0;
     }

     public User peek() {
          if (isEmpty()) {
               return null;
          }
          return queue[first].copy();
     }

     // Método para obter a posição de um usuário pelo CPF
     public int getUserPositionByCpf(String cpf) {

          if (isEmpty()) {
               System.out.println("Queue is empty");
               return -1;
          }

          for (int i = 0; i <= last; i++) {
               if (queue[i] != null && queue[i].getCpf().equals(cpf)) {
                    return i + 1; // Retorna a posição na fila (1-indexada)
               }
          }

          System.out.println("User with CPF " + cpf + " not found in the queue");
          return -1; // Usuário não encontrado
     }

     public boolean removeUserByCpf(String cpf) {

          int position = getUserPositionByCpf(cpf);

          // Checa se o usuário foi encontrado
          if (position == -1) {
               System.out.println("User with CPF " + cpf + " not found in the queue");
               return false;
          }

          int index = position - 1; // Ajusta para 0-indexado, pois getUserPositionByCpf retorna 1-indexado

          // Remove o usuário ao mover os elementos para a esquerda
          for (int i = index; i < last; i++) {
               queue[i] = queue[i + 1]; // Desloca todos os elementos uma posição para a esquerda
          }
          queue[last] = null; // Limpa a última posição
          last--; // Atualiza o índice do último elemento
          count--; // Decrementa o contador de elementos
          System.out.println("User with CPF " + cpf + " removed successfully.");
          return true;
     }
}

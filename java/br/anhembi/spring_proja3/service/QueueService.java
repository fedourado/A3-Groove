package br.anhembi.spring_proja3.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.anhembi.spring_proja3.Structures.UserQueue;
import br.anhembi.spring_proja3.entities.User;
import br.anhembi.spring_proja3.repository.UserRepo;
import jakarta.annotation.PostConstruct;

@Service
public class QueueService {

     private UserQueue day1Queue;
     private UserQueue day2Queue;
     private UserQueue bothQueue;

     private boolean day1TimerActive;
     private boolean day2TimerActive;
     private boolean bothTimerActive;

     @Autowired
     private EmailService emailService;

     @Autowired
     private UserRepo userRepository; // Adicionado para acessar o repositório de usuários

     @PostConstruct
     public void initQueues() {
          // Inicializa as filas
          day1Queue = new UserQueue(4000);
          day2Queue = new UserQueue(4000);
          bothQueue = new UserQueue(2000);

          // Inicializa os estados dos timers
          day1TimerActive = false;
          day2TimerActive = false;
          bothTimerActive = false;

          // Carrega usuários do banco de dados para as filas
          loadUsersToQueues();
     }

     public UserQueue getDay1Queue() {
          return day1Queue;
     }

     public UserQueue getDay2Queue() {
          return day2Queue;
     }

     public UserQueue getBothQueue() {
          return bothQueue;
     }

     public List<UserQueue> getAllQueues() {
        List<UserQueue> queues = new ArrayList<>();
        queues.add(getDay1Queue());
        queues.add(getDay2Queue());
        queues.add(getBothQueue());
        return queues;
    }

     public UserQueue getQueueByDia(String dia) {
          return switch (dia) {
               case "1" -> day1Queue;
               case "2" -> day2Queue;
               default -> bothQueue;
          };
     }

     public void enqueueUser(User user) {
          switch (user.getDia()) {
               case "1" -> day1Queue.enqueue(user);
               case "2" -> day2Queue.enqueue(user);
               default -> bothQueue.enqueue(user);
          }
          startTimerForFirstUserInQueue();
     }

     public User dequeueUser(String dia) {
          UserQueue queue = getQueueByDia(dia);
          if (queue == null || queue.isEmpty()) {
               System.out.println("Fila vazia ou dia inválido.");
               return null;
          }
          return queue.dequeue();
     }

     public void startTimerForFirstUserInQueue() {
          if (!day1Queue.isEmpty() && !day1TimerActive) {
               scheduleDequeueForUser(day1Queue.peek(), day1Queue, "day1");
               sendEmailToFirstUser(day1Queue.peek());
          }

          if (!day2Queue.isEmpty() && !day2TimerActive) {
               scheduleDequeueForUser(day2Queue.peek(), day2Queue, "day2");
               sendEmailToFirstUser(day2Queue.peek());
          }

          if (!bothQueue.isEmpty() && !bothTimerActive) {
               scheduleDequeueForUser(bothQueue.peek(), bothQueue, "both");
               sendEmailToFirstUser(bothQueue.peek());
          }
     }

     private void scheduleDequeueForUser(User user, UserQueue queue, String queueKey) {
          ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
          long delay = 2 * 60 * 60; // 2 horas em segundos

          setTimerActive(queueKey, true);

          scheduler.schedule(() -> {
               synchronized (queue) {
                    if (!queue.isEmpty() && queue.peek().equals(user)) {
                         queue.dequeue();
                         setTimerActive(queueKey, false);
                         startTimerForFirstUserInQueue();
                    }
               }
          }, delay, TimeUnit.SECONDS);
     }

     private void sendEmailToFirstUser(User user) {
          if (user.getEmail() != null && !user.getEmail().isEmpty()) {
               String body = "Olá, " + user.getNome() + "!\n\n" +
                         "Você chegou em primeiro na fila! " +
                         "Você tem um tempo limitado para escolher suas reservas. " +
                         "Por favor, acesse a tela de escolha de reservas agora para garantir seu lugar.";
               emailService.sendEmail(user.getEmail(), "Aviso: Escolha suas Reservas", body);
          }
     }

     private void setTimerActive(String queueKey, boolean isActive) {
          switch (queueKey) {
               case "day1" -> day1TimerActive = isActive;
               case "day2" -> day2TimerActive = isActive;
               case "both" -> bothTimerActive = isActive;
          }
     }

     public double getOccupationRate(String dia) {
          UserQueue queue = getQueueByDia(dia);
          return queue.getOccupationRate();
     }

     public boolean removeUserByCpf(String cpf, String dia) {
          UserQueue queue = getQueueByDia(dia);
          return queue.removeUserByCpf(cpf);
     }

     public int getUserPositionByCpf(String cpf, String dia) {
          UserQueue queue = getQueueByDia(dia);
          return queue.getUserPositionByCpf(cpf);
     }

     public User peek(String dia) {
          UserQueue queue = getQueueByDia(dia); // Verifica a fila do dia
          if (queue != null && !queue.isEmpty()) {
              return queue.peek(); // Retorna o primeiro usuário da fila
          }
          return null; // Caso a fila não exista ou esteja vazia
      }
     /**
      * Método para carregar usuários do banco de dados para as filas.
      */
     public void loadUsersToQueues() {
          List<User> users = userRepository.findAll(); // Busca todos os usuários no banco de dados
          for (User user : users) {
               enqueueUser(user); // Enfileira cada usuário com base no dia
          }
     }
}

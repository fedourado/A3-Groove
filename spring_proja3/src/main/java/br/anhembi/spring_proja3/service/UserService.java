package br.anhembi.spring_proja3.service;

import br.anhembi.spring_proja3.Structures.UserQueue;
import br.anhembi.spring_proja3.entities.User;
import br.anhembi.spring_proja3.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

     @Autowired
     private SectorsService sectorsService;

     @Autowired
     private UserRepo repo;

     @Autowired
     private EmailService emailService;

     private UserQueue day1Queue;
     private UserQueue day2Queue;
     private UserQueue bothQueue;

     @PostConstruct
     public void init() {
          // Inicializa as filas com a capacidade necessária
          day1Queue = new UserQueue(4000);
          day2Queue = new UserQueue(4000);
          bothQueue = new UserQueue(2000);

          // Carrega os usuários nas filas conforme necessário
          loadUsersToQueues();

          System.out.println("Filas de usuarios inicializadas e carregadas.");
     }

     public void loadUsersToQueues() {
          // Carrega os usuários nas filas com base em algum critério
          List<User> users = repo.findAll();
          for (User user : users) {
               if (user.getDia().equals("1")) {
                    day1Queue.enqueue(user);
               } else if (user.getDia().equals("2")) {
                    day2Queue.enqueue(user);
               } else {
                    bothQueue.enqueue(user);
               }
          }

          // Após carregar todos os usuários, verifica se o primeiro da fila precisa de um
          // timer
          startTimerForFirstUserInQueue();
     }

     // Método para iniciar o timer para o primeiro usuário da fila
     public void startTimerForFirstUserInQueue() {
          if (!day1Queue.isEmpty()) {
               User firstUser = day1Queue.peek(); // Obtém o primeiro usuário da fila
               sendEmailToFirstUser(firstUser);
               scheduleDequeueForUser(firstUser); // Inicia o timer para ele
          }

          if (!day2Queue.isEmpty()) {
               User firstUser = day2Queue.peek(); // Obtém o primeiro usuário da fila
               sendEmailToFirstUser(firstUser);
               scheduleDequeueForUser(firstUser); // Inicia o timer para ele
          }

          if (!bothQueue.isEmpty()) {
               User firstUser = bothQueue.peek(); // Obtém o primeiro usuário da fila
               sendEmailToFirstUser(firstUser);
               scheduleDequeueForUser(firstUser); // Inicia o timer para ele
          }
     }

     private void sendEmailToFirstUser(User user) {
          // Verifica se o e-mail do usuário está presente
          if (user.getEmail() != null && !user.getEmail().isEmpty()) {
               // Corpo do e-mail
               String body = "Olá, " + user.getNome() + "!\n\n" +
                         "Você chegou em primeiro na fila! " +
                         "Você tem um tempo limitado para escolher suas reservas. " +
                         "Por favor, acesse a tela de escolha de reservas agora para garantir seu lugar.";

               // Envia o e-mail
               emailService.sendEmail(user.getEmail(), "Aviso: Escolha suas Reservas", body);
          }
     }

     // Método para buscar um usuário pelo CPF
     public Optional<User> getUser(String cpf) {
          return repo.findById(cpf);
     }

     // Método para obter todos os usuários
     public List<User> getAllUsers() {
          return repo.findAll();
     }

     // Método para inserir um novo usuário
     public User insert(User obj) {
          // Verifica se o usuário já existe no banco de dados
          Optional<User> existingUser = repo.findById(obj.getCpf());

          // Se o usuário já existe e ambos os atributos de reserva estão preenchidos
          if (existingUser.isPresent()) {
               User user = existingUser.get();
               if (user.getPrimReserva() != null && user.getSegReserva() != null) {
                    System.out.println("Usuário já existe no banco e ambos os atributos de reserva estão preenchidos.");
                    return null; // Não adiciona o usuário ao banco ou à fila
               }
          }

          // Verifica se o usuário pode ser adicionado à fila (se a fila não estiver
          // cheia)
          boolean canAddToQueue = false;
          if ("1".equals(obj.getDia())) {
               canAddToQueue = !day1Queue.isFull();
          } else if ("2".equals(obj.getDia())) {
               canAddToQueue = !day2Queue.isFull();
          } else {
               canAddToQueue = !bothQueue.isFull();
          }

          // Se a fila estiver cheia, o usuário não é inserido nem no banco nem na fila
          if (!canAddToQueue) {
               System.out.println("Fila cheia. Não é possível adicionar o usuário.");
               return null;
          }

          // Adiciona o usuário ao banco de dados
          User savedUser = repo.save(obj);

          // Adiciona o usuário na fila correta, com base no "dia" do usuário
          if ("1".equals(obj.getDia())) {
               day1Queue.enqueue(savedUser);
          } else if ("2".equals(obj.getDia())) {
               day2Queue.enqueue(savedUser);
          } else {
               bothQueue.enqueue(savedUser);
          }

          // Verifica se o usuário é o primeiro da fila e inicia o contador para ele
          startTimerForFirstUserInQueue();

          return savedUser;
     }

     // Método para excluir um usuário
     public boolean delete(String cpf) {
          Optional<User> optionalUser = repo.findById(cpf);
          if (optionalUser.isPresent()) {
               repo.deleteById(cpf);

               return true;
          } else {
               return false;
          }
     }

     // Método para atualizar reservas e situação de um usuário
     public User updatePrimReserva(String cpf, String primReserva) {
          Optional<User> optionalUser = repo.findById(cpf);

          if (optionalUser.isPresent()) {
               User obj = optionalUser.get();

               // Verifica se já havia uma reserva para evitar decrementos duplicados
               if (obj.getPrimReserva() == null && primReserva != null) {
                    sectorsService.decrementQtdDisp(primReserva); // Decrementa a quantidade disponível
               }

               // Atualiza a primeira reserva
               obj.setPrimReserva(primReserva);
               return repo.save(obj);
          }

          return null;
     }

     public User updateSegReserva(String cpf, String segReserva) {
          Optional<User> optionalUser = repo.findById(cpf);

          if (optionalUser.isPresent()) {
               User obj = optionalUser.get();

               // Verifica se já havia uma reserva para evitar decrementos duplicados
               if (obj.getSegReserva() == null && segReserva != null) {
                    sectorsService.decrementQtdDisp(segReserva); // Decrementa a quantidade disponível
               }

               // Atualiza a segunda reserva
               obj.setSegReserva(segReserva);
               return repo.save(obj);
          }

          return null;
     }

     // Atualiza apenas a situação do usuário
     public User updateSituacao(String cpf, boolean situacao) {
          Optional<User> optionalUser = repo.findById(cpf);
          if (optionalUser.isPresent()) {
               User obj = optionalUser.get();
               obj.setSituação(situacao);
               return repo.save(obj);
          }
          return null;
     }

     // Métodos para obter as filas (se necessário)
     public UserQueue getDay1Queue() {
          return day1Queue;
     }

     public UserQueue getDay2Queue() {
          return day2Queue;
     }

     public UserQueue getBothQueue() {
          return bothQueue;
     }

     // Método para iniciar o timer para o usuário
     private void scheduleDequeueForUser(User user) {
          // Lógica para iniciar o timer, por exemplo, com um agendador de tarefas
          // Esse método pode ser implementado com um agendador como o Timer ou
          // ScheduledExecutorService
     }
}

package br.anhembi.spring_proja3.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.anhembi.spring_proja3.entities.User;
import br.anhembi.spring_proja3.repository.UserRepo;
@Service
@Transactional
public class UserService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepo repo;
    
    @Autowired
    private QueueService queueService;

    public Optional<User> getUser(String cpf) {
        return repo.findById(cpf);
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public User insert(User obj) {
        if (repo.existsById(obj.getCpf())) {
            System.out.println("Usuário já existe no banco.");
            return null;
        }

        boolean canAddToQueue = switch (obj.getDia()) {
            case "1" -> !queueService.getQueueByDia("1").isFull();
            case "2" -> !queueService.getQueueByDia("2").isFull();
            default -> !queueService.getQueueByDia("both").isFull();
        };

        if (!canAddToQueue) {
            System.out.println("Fila cheia. Não é possível adicionar o usuário.");
            return null;
        }

        User savedUser = repo.save(obj);
        queueService.enqueueUser(savedUser);
        return savedUser;
    }
    public User insertVIP(User obj) {
        if (repo.existsById(obj.getCpf())) {
            System.out.println("Usuário já existe no banco.");
            return null;
        }
    
        // Adiciona o usuário apenas ao banco de dados
        User savedUser = repo.save(obj);
        System.out.println("Usuário salvo no banco: " + savedUser);
        sendEmailToVIP(obj);
        return savedUser;
    }
    

    public boolean delete(String cpf) {
        if (repo.existsById(cpf)) {
            repo.deleteById(cpf);
            return true;
        }
        return false;
    }

    public User updatePrimReserva(String cpf, String primReserva) {
        Optional<User> optionalUser = repo.findById(cpf);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPrimReserva(primReserva);
            return repo.save(user);
        }
        return null;
    }

    public User updateSegReserva(String cpf, String segReserva) {
        Optional<User> optionalUser = repo.findById(cpf);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setSegReserva(segReserva);
            return repo.save(user);
        }
        return null;
    }

    public User updateSituacao(String cpf, boolean situacao) {
        Optional<User> optionalUser = repo.findById(cpf);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setSituação(situacao);
            return repo.save(user);
        }
        return null;
    }
    private void sendEmailToVIP(User user) {

        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
             // Gerar o link com o CPF do usuário
             String cpf = user.getCpf(); // Supondo que você tenha o CPF do usuário
             String link = "http://localhost:8080/selecionar-setor.html?cpf=" + cpf; // Monta o link com o CPF como
                                                                                     // parâmetro

             // Corpo do e-mail com HTML para o link clicável
             String body = "Olá, " + user.getNome()+
                       " Você escolheu um ingresso VIP "
                       + "Sendo assim voçê pode garantir seu lugar imediatamente. "
                       + "Por favor, acesse este link "+ link + " para fazer sua escolha.";

             // Envia o e-mail (certifique-se de que o seu serviço de e-mail esteja
             // configurado corretamente)
             emailService.sendEmail(user.getEmail(), "Aviso: Escolha seus setores", body);
        }

   }
}

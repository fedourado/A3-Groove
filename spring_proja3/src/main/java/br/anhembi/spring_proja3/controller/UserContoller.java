package br.anhembi.spring_proja3.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.anhembi.spring_proja3.entities.User;
import br.anhembi.spring_proja3.repository.UserRepo;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserContoller {

    @Autowired
    private UserRepo repo;

    @GetMapping("/{cpf}")
    @Transactional
    public ResponseEntity<User> getUser(@PathVariable String cpf) {
        Optional<User> obj = repo.findById(cpf);
        if (obj.isPresent()) { // se achou o produto
            return ResponseEntity.ok(obj.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    @Transactional
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = repo.findAll(); // Busca todos os usuários
        if (users.isEmpty()) { // Verifica se a lista está vazia
            return ResponseEntity.noContent().build(); // Retorna 204 No Content se não houver usuários
        } else {
            return ResponseEntity.ok(users); // Retorna a lista de usuários com 200 OK
        }
    }

    @PostMapping
    @Transactional
    public ResponseEntity<User> insert(@RequestBody User obj) {
        obj = repo.save(obj);
        return ResponseEntity.ok().body(obj);
    }

    @DeleteMapping("/{cpf}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable String cpf) {
        Optional<User> optionalUser = repo.findById(cpf);

        if (optionalUser.isPresent()) {
            repo.deleteById(cpf);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{cpf}")
    @Transactional
    public ResponseEntity<User> updateReserva(@PathVariable String cpf, @RequestParam("reserva") String reserva) {
        Optional<User> optionalUser = repo.findById(cpf);

        if (optionalUser.isPresent()) {
            User obj = optionalUser.get();
            obj.setReserva(reserva); // Atualiza apenas o atributo reserva
            repo.save(obj);
            return ResponseEntity.ok().body(obj);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

package br.anhembi.spring_proja3.controller;

import br.anhembi.spring_proja3.entities.User;
import br.anhembi.spring_proja3.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    // Método para buscar um usuário pelo CPF
    @GetMapping("/{cpf}")
    @Transactional
    public ResponseEntity<User> getUser(@PathVariable String cpf) {
        Optional<User> obj = userService.getUser(cpf);
        if (obj.isPresent()) {
            return ResponseEntity.ok(obj.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Método para obter todos os usuários
    @GetMapping
    @Transactional
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(users);
        }
    }

    // Método para inserir um novo usuário
    @PostMapping
    @Transactional
    public ResponseEntity<User> insert(@RequestBody User obj) {
        User newUser = userService.insert(obj);
        return ResponseEntity.ok().body(newUser);
    }

    // Método para excluir um usuário
    @DeleteMapping("/{cpf}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable String cpf) {
        boolean deleted = userService.delete(cpf);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Método para atualizar as reservas e situação de um usuário
    // Atualizar a primeira reserva
    @PutMapping("/{cpf}/primReserva")
    public ResponseEntity<User> updatePrimReserva(
            @PathVariable String cpf,
            @RequestParam String primReserva) {

        User updatedUser = userService.updatePrimReserva(cpf, primReserva);

        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser); // Retorna o usuário atualizado com 200 OK
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 caso o usuário não exista
        }
    }

    // Atualizar a segunda reserva
    @PutMapping("/{cpf}/segReserva")
    public ResponseEntity<User> updateSegReserva(
            @PathVariable String cpf,
            @RequestParam String segReserva) {

        User updatedUser = userService.updateSegReserva(cpf, segReserva);

        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser); // Retorna o usuário atualizado com 200 OK
        } else {
            return ResponseEntity.notFound().build(); // Retorna 404 caso o usuário não exista
        }
    }

    @PutMapping("/{cpf}/situacao")
    @Transactional
    public ResponseEntity<User> updateSituacao(
            @PathVariable String cpf,
            @RequestParam("situacao") boolean situacao) {
        User updatedUser = userService.updateSituacao(cpf, situacao);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

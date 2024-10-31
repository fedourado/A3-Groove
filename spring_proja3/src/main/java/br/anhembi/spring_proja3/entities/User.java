package br.anhembi.spring_proja3.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {

     @Id
     private String cpf;
     private String nome;
     private int idade;
     private String email;
     private String reserva;

     public User() {
     }

     public User(String cpf, String nome, int idade, String email, String reserva) {
          this.cpf = cpf;
          this.nome = nome;
          this.idade = idade;
          this.email = email;
          this.reserva = reserva;
     }

     public String getCpf() {
          return cpf;
     }

     public void setCpf(String cpf) {
          this.cpf = cpf;
     }

     public String getNome() {
          return nome;
     }

     public void setNome(String nome) {
          this.nome = nome;
     }

     public int getIdade() {
          return idade;
     }

     public void setIdade(int idade) {
          this.idade = idade;
     }

     public String getEmail() {
          return email;
     }

     public void setEmail(String email) {
          this.email = email;
     }

     public String getReserva() {
          return reserva;
     }

     public void setReserva(String reserva) {
          this.reserva = reserva;
     }

     public User copy(){
          return new User( cpf, nome, idade, email, reserva);
     }
     public String toString(){
          return "User: " + cpf +","+nome + ", (" + idade + ")+ email +\",\"+reserva + ";
     }

}

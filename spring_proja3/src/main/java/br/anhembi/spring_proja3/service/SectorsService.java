package br.anhembi.spring_proja3.service;

import br.anhembi.spring_proja3.entities.Sectors;
import br.anhembi.spring_proja3.Structures.TicketStack;
import br.anhembi.spring_proja3.repository.SectorsRepo;
import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SectorsService {

     @Autowired
     private SectorsRepo repo;

     // Instanciando pilhas diretamente para cada setor
     private TicketStack primCamaroteStack;
     private TicketStack primPistaStack;
     private TicketStack primPistaPremiumStack;
     private TicketStack primVIPStack;
     private TicketStack segCamaroteStack;
     private TicketStack segPistaStack;
     private TicketStack segPistaPremiumStack;
     private TicketStack segVIPStack;

     // Método de inicialização com @PostConstruct
     @PostConstruct
     public void init() {
          // Buscar todos os setores do banco de dados
          List<Sectors> sectors = repo.findAll();

          // Para cada setor, inicialize a pilha com a quantidade de ingressos
          for (Sectors sector : sectors) {
               int qtdDisp = sector.getQtdDisp(); // Quantidade de ingressos disponíveis

               // Instancia as pilhas diretamente para cada setor
               switch (sector.getNome()) {
                    case "PrimCamarote":
                         primCamaroteStack = new TicketStack(qtdDisp);
                         break;
                    case "PrimPista":
                         primPistaStack = new TicketStack(qtdDisp);
                         break;
                    case "PrimPistaPremium":
                         primPistaPremiumStack = new TicketStack(qtdDisp);
                         break;
                    case "PrimVIP":
                         primVIPStack = new TicketStack(qtdDisp);
                         break;
                    case "SegCamarote":
                         segCamaroteStack = new TicketStack(qtdDisp);
                         break;
                    case "SegPista":
                         segPistaStack = new TicketStack(qtdDisp);
                         break;
                    case "SegPistaPremium":
                         segPistaPremiumStack = new TicketStack(qtdDisp);
                         break;
                    case "SegVIP":
                         segVIPStack = new TicketStack(qtdDisp);
                         break;
                    default:
                         // Caso algum setor desconhecido, pode lançar uma exceção ou fazer outra ação
                         break;
               }
          }

          // Exemplo de log para verificar se as pilhas foram criadas corretamente
          System.out.println("Pilhas de ingressos inicializadas para todos os setores.");
     }

     // Métodos para acessar as pilhas de ingressos de cada setor
     public TicketStack getPrimCamaroteStack() {
          return primCamaroteStack;
     }

     public TicketStack getPrimPistaStack() {
          return primPistaStack;
     }

     public TicketStack getPrimPistaPremiumStack() {
          return primPistaPremiumStack;
     }

     public TicketStack getPrimVIPStack() {
          return primVIPStack;
     }

     public TicketStack getSegCamaroteStack() {
          return segCamaroteStack;
     }

     public TicketStack getSegPistaStack() {
          return segPistaStack;
     }

     public TicketStack getSegPistaPremiumStack() {
          return segPistaPremiumStack;
     }

     public TicketStack getSegVIPStack() {
          return segVIPStack;
     }

     // Método para obter a quantidade disponível de um setor
     public int getQtdDisp(String nome) {
          Optional<Sectors> obj = repo.findById(nome);
          return obj.map(Sectors::getQtdDisp).orElse(0); // Retorna 0 se não encontrar
     }

     // Método para obter todos os setores
     public List<Sectors> getAllSectors() {
          return repo.findAll();
     }

     // Método para inserir um novo setor
     public Sectors insert(Sectors obj) {
          return repo.save(obj);
     }

     // Método para excluir um setor
     public boolean delete(String nome) {
          Optional<Sectors> optionalSectors = repo.findById(nome);
          if (optionalSectors.isPresent()) {
               repo.deleteById(nome);
               return true;
          } else {
               return false;
          }
     }

     // Método para atualizar a quantidade disponível de um setor
     public Sectors decrementQtdDisp(String nome) {
          Optional<Sectors> optionalSectors = repo.findById(nome);

          if (optionalSectors.isPresent()) {
               Sectors obj = optionalSectors.get();

               // Decrementa qtdDisp em 1, garantindo que não fique negativo
               if (obj.getQtdDisp() > 0) {
                    obj.setQtdDisp(obj.getQtdDisp() - 1);
                    return repo.save(obj); // Salva a alteração no banco de dados
               } else {
                    System.out.println("Quantidade disponível já é 0. Não é possível decrementar.");
                    return null; // Retorna null caso a quantidade já seja 0
               }
          } else {
               System.out.println("Setor com nome '" + nome + "' não encontrado.");
               return null;
          }
     }

}

package br.anhembi.spring_proja3.controller;

import br.anhembi.spring_proja3.entities.Sectors;
import br.anhembi.spring_proja3.service.SectorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Sectors")
@CrossOrigin("*")
public class SectorsController {

     @Autowired
     private SectorsService sectorsService;

     // Método para obter a quantidade disponível de um setor
     @GetMapping("/{nome}/qtdDisp")
     @Transactional
     public ResponseEntity<Integer> getQtdDisp(@PathVariable String nome) {
          int qtdDisp = sectorsService.getQtdDisp(nome);
          if (qtdDisp > 0) {
               return ResponseEntity.ok(qtdDisp);
          } else {
               return ResponseEntity.notFound().build();
          }
     }

     // Método para obter todos os setores
     @GetMapping
     @Transactional
     public ResponseEntity<List<Sectors>> getAllSectors() {
          List<Sectors> sectors = sectorsService.getAllSectors();
          if (sectors.isEmpty()) {
               return ResponseEntity.noContent().build();
          } else {
               return ResponseEntity.ok(sectors);
          }
     }

     // Método para inserir um novo setor
     @PostMapping
     @Transactional
     public ResponseEntity<Sectors> insert(@RequestBody Sectors obj) {
          Sectors newObj = sectorsService.insert(obj);
          return ResponseEntity.ok().body(newObj);
     }

     // Método para excluir um setor
     @DeleteMapping("/{nome}")
     @Transactional
     public ResponseEntity<Void> delete(@PathVariable String nome) {
          boolean deleted = sectorsService.delete(nome);
          if (deleted) {
               return ResponseEntity.noContent().build();
          } else {
               return ResponseEntity.notFound().build();
          }
     }

     // Método para atualizar a quantidade disponível de um setor
     @PutMapping("/{nome}/decrement")
     public ResponseEntity<Sectors> decrementQtdDisp(@PathVariable String nome) {
          Sectors updatedSector = sectorsService.decrementQtdDisp(nome);

          if (updatedSector != null) {
               return ResponseEntity.ok(updatedSector); // Retorna o setor atualizado com status 200 OK
          } else {
               return ResponseEntity.badRequest().build(); // Retorna status 400 Bad Request se algo deu errado
          }
     }

}

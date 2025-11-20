package com.example.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Model.TodoEntity;
import com.example.Service.TodoService;

@RestController
@RequestMapping("/todos")
public class TodoController {

	private final TodoService service;
	
	public TodoController(TodoService service) {
		this.service = service;
	}
	
	@GetMapping
	public List<TodoEntity> getAll(){
		return service.getAllTodos();
	}
	
	@PostMapping
	public ResponseEntity<?> create(@RequestBody TodoEntity todo){
		if(todo.getTitle() == null || todo.getTitle().trim().isEmpty()) {
			return ResponseEntity.badRequest().body("Title cannot be empty");
		}
		return ResponseEntity.ok(service.createTodo(todo));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> update(@PathVariable int id, @RequestBody TodoEntity todo){
		return service.updateTodo(id,  todo)
				.map(ResponseEntity::ok)
				.orElse((ResponseEntity<TodoEntity>) ResponseEntity.status(404));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable int id){
		boolean removed = service.deleteTodo(id);
		if(removed) {
			return ResponseEntity.ok("Todo deletd");
		}
		return ResponseEntity.status(404).body("Todo not found");
	}
	
	
}

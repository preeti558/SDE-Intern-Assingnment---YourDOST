package com.example.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.Model.TodoEntity;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TodoService {

	private static final String FILE_PATH = "src/main/resources/todos.json";
	
	private List<TodoEntity> todos = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();
	private int idCounter = 1;
	
	public TodoService() {
		loadFromFile();
	}

	private void loadFromFile() {
		try {
			File file = new File(FILE_PATH);
			if(!file.exists()) {
				return;
			}
			todos = mapper.readValue(file, new TypeReference<List<TodoEntity>>() {});
			if(!todos.isEmpty()) {
				idCounter = todos.stream()
						.mapToInt(TodoEntity::getId)
						.max()
						.orElse(0) + 1;
			}
		}catch(Exception e){
			e.printStackTrace();
		}	
	}
	
	private void saveToFile() {
		try {
			mapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), todos);
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	public List<TodoEntity> getAllTodos(){
		return todos;
	}
	
	public TodoEntity createTodo(TodoEntity todo) {
		todo.setId(idCounter++);
		todos.add(todo);
		saveToFile();
		return todo;
		
	}
	
	public Optional<TodoEntity> updateTodo(int id, TodoEntity updatedTodo){
		for(TodoEntity t : todos) {
			if(t.getId() == id) {
				t.setTitle(updatedTodo.getTitle());
				t.setCompleted(updatedTodo.isCompleted());
				saveToFile();
				return Optional.of(t);
			}
		}
		return Optional.empty();
	}
	
	public boolean deleteTodo(int id) {
		boolean removed = todos.removeIf(t -> t.getId() == id);
		if(removed) {
			saveToFile();
		}
		return removed;
	}
	
	
	
}

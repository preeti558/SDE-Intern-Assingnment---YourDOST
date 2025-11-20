package com.example.Model;

import jakarta.persistence.Entity;

@Entity
public class TodoEntity {
 
	private int id;
	private String title;
	private boolean completed;
	
	public TodoEntity() {}

	public TodoEntity(int id, String title, boolean completed) {
		super();
		this.id = id;
		this.title = title;
		this.completed = completed;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	};
	
	
	
}

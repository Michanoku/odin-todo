import { format } from "date-fns";
import { storageHandler } from "./handler";

const todos = (function () {

  // Create an array to house all todos
  let todoArray = new Array();

  class Todo {
    constructor(
      title,
      priority,
      description,
      dueDate,
      checked,
      id,
    ) {
      this.title = title;
      this.priority = priority;
      this.description = description;
      this.dueDate = dueDate ? format(new Date(dueDate), "yyyy-MM-dd") : null;
      this.checked = checked;
      this.id = id ?? crypto.randomUUID();
    }
  }

  // Create a todo from the data input
  function createTodo(title, priority, description, dueDate, checked, id) {
    console.log(dueDate)
    const todo = new Todo(title, priority, description, dueDate, checked, id);
    todoArray.push(todo);
    return todo;
  };

  // Delete a todo from the todo array
  function deleteTodo(todoId) {
    const todoIndex = todoArray.findIndex((todo) => todo.id === todoId);
    todoArray.splice(todoIndex, 1);
  }

  // Return the entire todo array
  function getAllTodo() {
    return todoArray;
  };

  // Set all todos from data
  function setTodo(storedTodo) {
    todoArray = new Array();
    storedTodo.forEach(todo => {
      createTodo(
        todo.title, 
        todo.priority, 
        todo.description, 
        todo.dueDate, 
        todo.checked,
        todo.id,
      );
    })
  }

  // Get a single todo
  function getTodo(todoId) {
    const todo = todoArray.find((todo) => todo.id === todoId);
    return todo
  }

  // Toggle the check status of the todo
  function toggleTodo(todo, checked) {
    todo.checked = checked;
    storageHandler.saveData();
  }

  return { createTodo, deleteTodo, toggleTodo, getTodo, getAllTodo, setTodo };
}());
  
export { todos }
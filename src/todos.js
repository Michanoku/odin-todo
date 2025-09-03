import { format } from "date-fns";

const todos = (function () {

  // Create an array to house all todos
  let todoArray = new Array();

  class Todo {
    constructor(
      title,
      priority,
      description,
      dueDate,
      id,
    ) {
      this.title = title;
      this.priority = priority;
      this.description = description;
      this.dueDate = dueDate ? null : format(new Date(dueDate), "yyyy-MM-dd");
      this.id = id ?? crypto.randomUUID();
      this._checked = false;
    }
    get checked() {
      return this._checked;
    }
    set checked(value) {
      this._checked = value;
    }
  }

  // Create a todo from the data input
  function createTodo(title, priority, description, dueDate, id) {
    const todo = new Todo(title, priority, description, dueDate, id);
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
    for (const todo in storedTodo) {
      createTodo(
        storedTodo[todo].title, 
        storedTodo[todo].description, 
        storedTodo[todo].dueDate, 
        storedTodo[todo].priority, 
        storedTodo[todo].id,
      );
    }
  }

  // Get a single todo
  function getTodo(todoId) {
    return todoArray.find((todo) => todo.id === todoId);
  }

  // Toggle the check status of the todo
  function toggleTodo(todoId) {
    const todo = getTodo(todoId);
    todo.checked = !todo.checked;
    return todo.checked;
  }

  return { createTodo, deleteTodo, toggleTodo, getTodo, getAllTodo, setTodo };
}());
  
export { todos }
import { format } from "date-fns";

const todos = (function () {

  // Create an array to house all todos
  let todoArray = new Array();

  class Todo {
    constructor(
      id = null,
      title='Untitled',
      description=null,
      dueDate=null,
      priority='Normal',
      notes=new Array(), 
      checklist=new Array(),
    ) {
      this.id = id ?? crypto.randomUUID();
      this.title = title;
      this.description = description;
      this.dueDate = dueDate ? null : format(new Date(dateString), "yyyy-MM-dd");
      this.priority = priority;
      this.notes = notes;
      this.checklist = checklist;
      this.checked = false;
    }
  }

  // Create a todo from the data input
  function createTodo(title, description, dueDate, priority, notes, checklist, id = null) {
    const todo = new Todo(title, description, dueDate, priority, notes, checklist, id);
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
        storedTodo[todo].notes, 
        storedTodo[todo].checklist, 
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
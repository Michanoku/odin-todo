import { format } from "date-fns";

const todos = (function () {

  // Create global todo array
  const todoArray = new Array();

  class Todo {
    constructor(
      title='Untitled',
      description=null,
      dueDate=null,
      priority='Normal',
      notes=new Array(), 
      checklist=new Array(),
    ) {
      this.id = crypto.randomUUID();
      this.title = title;
      this.description = description;
      this.dueDate = dueDate === null ? null : format(new Date(dateString), "yyyy-MM-dd");
      this.priority = priority;
      this.notes = notes;
      this.checklist = checklist;
      this.color = '000000';
      this.checked = false;
    }
  }

  function createTodo(title, description, dueDate, priority, notes, checklist) {
    const todo = new Todo(title, description, dueDate, priority, notes, checklist);
    return todo.id;
  };

  function deleteTodo(todoId) {
    const todoIndex = todoArray.findIndex((todo) => todo.id === todoId);
    todoArray.splice(todoIndex, 1);
  }

  function getTodo(todoId) {
    return todoArray.find((todo) => todo.id === todoId);
  }

  function toggleTodo(todoId) {
    const todo = getTodo(todoId);
    todo.checked = !todo.checked;
    return todo.checked;
  }

  return { createTodo, deleteTodo, toggleTodo, getTodo };
}());
  
export { todos }
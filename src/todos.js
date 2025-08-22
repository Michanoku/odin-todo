import { compareAsc, format } from "date-fns";

const todos = (function () {
  class Todo {
    constructor(
      title='Untitled',
      description=null,
      dueDate=null,
      priority='Normal',
      notes=new Array(), 
      checklist=new Array(),
    ) {
      this.title = title;
      this.description = description;
      this.dueDate = dueDate === null ? null : format(new Date(dateString), "yyyy-MM-dd");
      this.priority = priority;
      this.notes = notes;
      this.checklist = checklist;
      this.checked = false;
    }
  }

  function createTodo(title, description, dueDate, priority, notes, checklist) {
    return new Todo(title, description, dueDate, priority, notes, checklist);
  }

  return { createTodo }
}());
  

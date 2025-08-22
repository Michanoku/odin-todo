const projects = (function () {
  const projectsArray = new Array();
  class Project {
    constructor(name) {
      this.name = name;
      this.id = crypto.randomUUID();
      this.todo = new Array();
    }
  }

  function createProject(name) {
    projectsArray.append(new Project(name));
  }
})();
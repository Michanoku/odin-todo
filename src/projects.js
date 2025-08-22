const projects = (function () {
  // Create array to house all projects
  const projectsArray = new Array();

  class Project {
    constructor(name) {
      this.name = name;
      this.id = crypto.randomUUID();
      // All todo objects will go in here
      this.todo = new Array();
    }
  }

  function createProject(name) {
    projectsArray.append(new Project(name));
  };

  function getAllProjects() {
    return projectsArray;
  };

  function getProject(id) {
    return projectsArray.find((project) => project.id === id);
  };



  return { createProject, getAllProjects, getProject }
})();
const projects = (function () {
  // Create array to house all projects
  const projectsArray = new Array();
  const defaultBG = 'f5f5f5';


  class Project {
    constructor(name) {
      this.id = crypto.randomUUID();
      this.name = name;
      this._backgroundColor = defaultBG;
      this._backgroundType = 'light';
    }
    get textColor() {
      return this._backgroundType === 'light' ? '#000000' : '#f5f5f5';
    }

    get backgroundColor() {
      return this._backgroundColor;
    }
    get backgroundType() {
      return this._backgroundType;
    }
    set backgroundColor(color) {
      this._backgroundColor = color;
      this._backgroundType = this.calculateBackgroundType(color);
    }

    calculateBackgroundType(backgroundColor) {
      const red = parseInt(`${backgroundColor[0]}${backgroundColor[1]}`, 16);
      const green = parseInt(`${backgroundColor[2]}${backgroundColor[3]}`, 16);
      const blue = parseInt(`${backgroundColor[4]}${backgroundColor[5]}`, 16);

      // https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
      const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
      return brightness < 128 ? 'dark' : 'light';
    }
  }

  function createProject(name) {
    const project = new Project(name);
    projectsArray.push(project);
    return project;
  };

  function deleteProject(projectId) {
    const projectIndex = projectsArray.findIndex((project) => project.id === projectId);
    projectsArray.splice(projectIndex, 1);
  }

  function getAllProjects() {
    return projectsArray;
  };

  function setProjects(storedArray) {
    projectsArray.push(...storedArray);
  }

  function getProject(projectId) {
    return projectsArray.find((project) => project.id === projectId);
  };

  function editProjectName(projectId, newName) {
    const project = getProject(projectId);
    project.name = newName;
  };

  return { createProject, deleteProject, getAllProjects, setProjects, getProject, editProjectName };
})();

export { projects }
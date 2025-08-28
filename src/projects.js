const projects = (function () {
  // Create array to house all projects
  const projectsArray = new Array();
  const defaultBG = '#f5f5f5';

  class Project {
    constructor(name, backgroundColor = defaultBG, id = null) {
      this.id = id ?? crypto.randomUUID();
      this.name = name;
      this._backgroundColor = backgroundColor;
      this._backgroundType = this.calculateBackgroundType(backgroundColor);
    }

    calculateBackgroundType(color) {
      const red = parseInt(`${color[1]}${color[2]}`, 16);
      const green = parseInt(`${color[3]}${color[4]}`, 16);
      const blue = parseInt(`${color[5]}${color[6]}`, 16);
      const brightness = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
      return brightness < 128 ? 'dark' : 'light';
    }

    get backgroundColor() {
      return this._backgroundColor;
    }

    set backgroundColor(color) {
      this._backgroundColor = color;              // set the backing field
      this._backgroundType = this.calculateBackgroundType(color);
    }

    get textColor() {
      return this._backgroundType === 'light' ? '#000000' : '#f5f5f5';
    }

    get subtextBrightness() {
      return this._backgroundType === 'light' ? '50%' : '150%';
    }
  }

  function createProject(name, backgroundColor = defaultBG, id = null) {
    const project = new Project(name, backgroundColor, id);
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
    for (const project in storedArray) {
      createProject(storedArray[project].name, storedArray[project]._backgroundColor, storedArray[project].id);
    }
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
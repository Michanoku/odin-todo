const manipulateDOM = (function () {
  const content = document.querySelector('#content');

  function addProject(project) {
    const div = document.createElement('div');
    div.textContent = project.name;
    content.appendChild(div);
  }

  return { addProject };
})();

export { manipulateDOM }
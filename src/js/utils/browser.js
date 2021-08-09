/* eslint-disable no-alert */
export function browserDownload(json) {
  const fileOutputLink = document.createElement('a');

  let filename = `output${Date.now()}.json`;
  filename = window.prompt('Insert output filename', filename);
  if (!filename) return;

  const output = JSON.stringify(json);
  const data = new Blob([output], { type: 'text/plain' });
  const url = window.URL.createObjectURL(data);
  fileOutputLink.setAttribute('download', filename);
  fileOutputLink.href = url;
  fileOutputLink.style.display = 'none';
  document.body.appendChild(fileOutputLink);
  fileOutputLink.click();
  document.body.removeChild(fileOutputLink);
}

export function browserUpload() {
  return new Promise(((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (fileEvent) => {
        const loadedData = fileEvent.target.result;
        resolve(loadedData);
      });
      reader.readAsText(file);
    });

    fileInput.click();
  }));
}


export function browserImageUpload() {
  return new Promise(((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (fileEvent) => {
        const loadedData = fileEvent.target.result;

        const fileInput = document.createElement('input');

        const image = new Image();
        image.onload = () => {
          resolve({ data: loadedData, width: image.width, height: image.height });
        };
        image.src = loadedData;
      });
      reader.readAsDataURL(file);
    });

    fileInput.click();
  }));
}

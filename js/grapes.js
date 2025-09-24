var editor = grapesjs.init({
  container: '#gjs',
  // ...
  allowScripts: 1,
  plugins: ['grapesjs-tailwind', 'grapesjs-tui-image-editor', 'grapesjs-component-code-editor'],
  pluginsOpts: {
    'grapesjs-tailwind': { /* options */ },
    'grapesjs-tui-image-editor': {
      config: {
        includeUI: {
          initMenu: 'filter',
        },
      },
    },
    'grapesjs-component-code-editor' : { /* options */ }
  }
});

/* Code editor */

const pn = editor.Panels;
const panelViews = pn.addPanel({
  id: "views"
});
panelViews.get("buttons").add([
  {
    attributes: {
      title: "Open Code"
    },
    className: "fa fa-file-code-o",
    command: "open-code",
    togglable: false, //do not close when button is clicked again
    id: "open-code"
  }
]);


let global_Content = null;

// Function to fetch HTML content from a file
function fetchHtmlContent(edit_url) {
  return fetch(`${edit_url}`)
    .then(response => response.text())
    .then(htmlContent => {
      // Create a new component in GrapesJS
      editor.addComponents(htmlContent);
    });
}

// Function to fetch CSS content from a file
function fetchCssContent(cssUrl) {
  return fetch(`${cssUrl}`)
    .then(response => response.text())
    .then(css => {
      // Get the css_composer module
      const cssComposer = editor.CssComposer;
      // Add the CSS rules to the css_composer module
      cssComposer.addRules(css);
    });
}

// Check for the 'load' URL parameter and fetch the corresponding file
const urlParams = new URLSearchParams(window.location.search);
const loadParam = urlParams.get('load');
const htmlParam = urlParams.get('html');
const cssParam = urlParams.get('css');

console.log('loadParam :', loadParam);
console.log('htmlParam :', htmlParam);
console.log('cssParam :', cssParam);

if (loadParam) {
  fetchHtmlContent(loadParam)
}
if (cssParam) {
  fetchCssContent(cssParam)
}

// document.addEventListener('DOMContentLoaded', () => {
//   const save_btn = document.getElementById('save_btn');
//   save_btn.addEventListener('click', () => {
//     //refine the html
//     const get_html = editor.getHtml();
//     const get_css = editor.getCss();
    
//     const content = {
//       html: get_html,
//       css: get_css
//     }

//     global_Content = content;

//     if(htmlParam != null || htmlParam != undefined || htmlParam != './template/_index_temp.html'){
//       const parser = new DOMParser();
//       const htmlDoc = parser.parseFromString(get_html, 'text/html');

//       // Get the body element
//       const bodyElement = htmlDoc.body;

//       // Remove all meta, title, and link tags from inside the body element
//       const tagsToRemove = bodyElement.querySelectorAll('meta, title, link');
//       tagsToRemove.forEach(tag => tag.remove());

//       // Get the modified HTML string
//       global_Content.html = htmlDoc.documentElement.outerHTML;

//       // Fetch the HTML file from the provided URL
//       fetch(`${htmlParam}`)
//         .then(response => response.text())
//         .then(update_html => {
//           const parser = new DOMParser();
//           const updateHtmlDoc = parser.parseFromString(update_html, 'text/html');
//           const updateBodyElement = updateHtmlDoc.body;

//           // Replace the body content of the fetched HTML file with the content from global_Content
//           updateBodyElement.innerHTML = bodyElement.innerHTML;

//           // Convert the updated HTML document back to a string
//           const updatedHtmlString = updateHtmlDoc.documentElement.outerHTML;

//           // Send a request to update the HTML file with the new content
//           fetch(`${htmlParam}`, {
//             method: 'PUT',
//             body: updatedHtmlString,
//             headers: {
//               'Content-Type': 'text/html'
//             }
//           })
//           .then(response => response.text())
//           .then(() => {
//             console.log(`HTML file updated successfully!`)
//             alert(`HTML file updated successfully!`)
//           })
//           .catch(error => console.error(`Error updating HTML file: ${error}`));
//         })

//       fetch(`${cssParam}`, {
//         method: 'PUT',
//         body: get_css,
//         headers: {
//           'Content-Type': 'text/css'
//         }
//       })
//       .then(() => {
//         console.log(`HTML file updated successfully!`)
//         alert(`CSS file updated Successfully!`)
//       })
//       .catch(error => console.error(`Error updating HTML file: ${error}`));
//     }
//   });
// });


document.addEventListener('DOMContentLoaded', () => {
  const save_btn = document.getElementById('save_btn');
  save_btn.addEventListener('click', () => {
    // Prompt the user for a page name
    const pageName = prompt('Enter a page name:');

    if (pageName) {
      // Refine the HTML
      const get_html = editor.getHtml();
      const get_css = editor.getCss();

      const content = {
        html: get_html,
        css: get_css
      }

      global_Content = content;

      // Create the file names with the page name
      const htmlFileName = `${pageName}.html`;
      const cssFileName = `${pageName}.css`;

      // Create the HTML file content
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>${pageName}</title>
            <meta name="description" content="">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"></script>
            <link rel="stylesheet" href="${cssFileName}">
          </head>
          <body>
            ${get_html}

            <!--custom script-->
            <script>
            </script>
          </body>
        </html>
      `;

      // Save the HTML file
      fetch(`./template/${htmlFileName}`, {
        method: 'PUT',
        body: htmlContent,
        headers: {
          'Content-Type': 'text/html'
        }
      })
      .then(response => response.text())
      .then(() => {
        console.log(`HTML file saved successfully!`)
        alert(`HTML file saved successfully!`)
      })
      .catch(error => console.error(`Error saving HTML file: ${error}`));

      // Save the CSS file
      fetch(`./template/${cssFileName}`, {
        method: 'PUT',
        body: get_css,
        headers: {
          'Content-Type': 'text/css'
        }
      })
      .then(() => {
        console.log(`CSS file saved successfully!`)
        alert(`CSS file saved successfully!`)
      })
      .catch(error => console.error(`Error saving CSS file: ${error}`));
    }
  });
});
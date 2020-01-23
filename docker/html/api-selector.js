/**
 * This function returns the RapiDoc element. It is used to access the RapiDoc component
 * and update its attributes.
 * 
 * @return {Element} the RapiDoc element.
 */
function getRapiDoc() {
   return document.getElementById("thedoc");
 }
/**
 * Updates the specifications that that is being visualised by the RapiDoc component. 
 * 
 * @param {String} specUrl - The url to the spec to load in the component.
 */
function changeSpecUrl(specUrl) {
   let docEl = getRapiDoc();
   let search = document.getElementById("search");
   if (search) {
      search.value = ""
   }
   docEl.setAttribute('spec-url', specUrl);
 }

 /**
  * This function returns the HTML element that contains the list of API specifications
  * that can be browsed within the RapiDoc viewer.
  * 
  * @returs {Element} the div container used to show the list of API specifications.
  */
 function getApiSpecsMenu() {  
   return document.getElementById("apispecs");
 }

 /**
  * This function creates a clickable UI element that loads the configured OpenAPI specification
  * into the RapiDoc component.
  * 
  * @param {*} spec - an Object that contains the following attributes: url,title,description.
  * 
  * @returns {Element} a clickable HTML div that presents the specification title and description
  *                    and when clicked it loads the specification identified by url in the RapiDoc
  *                    component.
  */
function createApiSpecElement(spec) {

   let specNode = document.createElement("div");
   specNode.className = "spec-item";
   specNode.setAttribute("data-spec", spec.url);

   let headerNode = document.createElement("div");
   headerNode.className = "spec-header";
   headerNode.innerHTML = spec.title;
   headerNode.setAttribute("data-tooltip", spec.description);
   specNode.appendChild(headerNode);

   specNode.onclick = function() {
    
   let specs = document.querySelectorAll(".spec-header.active");
   for(var s=0; s<specs.length; s++) {
      specs[s].className = "spec-header";
   }
       

   this.childNodes[0].className = "spec-header active";
   let url = this.getAttribute("data-spec");
      changeSpecUrl(url);
   }

   return specNode;
 }

 /**
  * Displays an error message as described by title, description. 
  * 
  * @param {String} title - title of the message. 
  * @param {String} text - description of the message.
  * 
  * @returns {Element} an HTML div that contains the message.
  */
function createMessage(title, text) {
   
   let messageNode = document.createElement("div");
   messageNode.className = ".spec-message"

   let titleNode = document.createElement("span");
   titleNode.className = "spec-title";
   titleNode.innerHTML = title;
   messageNode.appendChild(titleNode);

   let textNode = document.createElement("span");
   textNode.className = "spec-description"
   textNode.innerHTML = text;
   messageNode.appendChild(textNode);

   return messageNode;
}

/**
 * Loads the manifest JSON file and creates the list of UI elements to select the 
 * presented API specifications.
 * 
 * @param {String} url          - relative URL to the manifest file to load.
 * @param {Function} onSuccess  - a callback that is executed when the manifest is 
 *                                successfully retrieved and parsed into a Javascript 
 *                                object.
 * @param {Function} onError    - a callback that is executed in case of any error.
 */
function loadManifest(url, onSuccess, onError) {
  
   if (!url || url == "") {
  
      console.warn("[API Selector] - Manifest file is empty or null, removing API selector...");
      let menu = getApiSpecsMenu();
      menu.remove();
      
  } else {

      var request = new XMLHttpRequest();
      request.overrideMimeType("application/json");
      request.open('GET', url, true); 
      request.onreadystatechange = function () {
         if (request.readyState == 4) { 
            if (request.status == "200") {
               let manifest = JSON.parse(request.responseText);
               onSuccess(manifest);
            } else {
               onError(request)
            }
         }
      };
      request.send(null);
	}
}
/**
 * This function creates the list of UI elements that can be used
 * to select and load the OpenAPI specifications that are identified
 * in the manifest.
 * 
 * @param {*} manifest  - an object that provides information about the
 *                        available OpenAPI specifications, with the 
 *                        corresponding URLs.
 */
function renderManifest(manifest) {

   let menu = getApiSpecsMenu();

   if (manifest.specs.length) {

      for (var i=0; i<manifest.specs.length; i++) {

         let spec = manifest.specs[i];
         let specNode = createApiSpecElement(spec);
   
         menu.appendChild(specNode);
      }

      if (manifest.default) {
   
         let defNode = menu.querySelector("div[data-spec='" + manifest.default + "']");
         if (defNode) {
            defNode.click();
         } else {
	   console.warn("[API Selector] - There is no OpenAPI specification matching: " + manifest.default);
	 }
      }
   } else {

      let error = createMessage("Ooops!", "There are no API specifications available.");
      menu.appendChild(error);
   }
}

/** 
 * This function renders an error message that occurred while retrieving the manifest file.
 * 
 * @param {XmlHttpRequest} request - the request that caused the error. 
 */
function renderError(request) {
     
   let menu = getApiSpecsMenu();

   if (request.status == "404") {

      // we don't have a manifest we leave the content has it has been loaded.
      menu.style.display = "none";
      console.warn("[API Selector] - Manifest file not found, hiding OpenAPI selector...");

   } else {

      let error = createMessage("Something Went Wrong", "Could not retrieve API specification manifest file.");
      menu.innerHTML = "";
      menu.appendChild(error);
   }

}

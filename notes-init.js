window.addEventListener("DOMContentLoaded", () => {
   // CONTAINER NODES
   const leftPanelNode = document.getElementById("left-panel"),
         notesListNode = document.getElementById("notes-list"),
         formContainerNode = document.getElementById("form-container"),
         currentNoteTitleNode = document.getElementById("current-note-title"),
         noteContentNode = document.getElementById("note-content");

   // BUTTONS
   const newNoteBtn = document.getElementById("new-note-button"),
         menuBtn = document.getElementById("toggle-button"),
         closeBtn = document.getElementById("close-right-panel");
   let currentNoteIndex;

   function sanitize(value = "", trim = false) {
      if (trim) value = value.trim();
      value = DOMPurify.sanitize(value);
      return value;
   }

   // OPEN AND CLOSE LEFT-PANEL
   menuBtn.addEventListener("click", () => leftPanelNode.classList.add("left-panel--open"), false);
   closeBtn.addEventListener("click", () => leftPanelNode.classList.remove("left-panel--open"), false);

   // OPENS FORM TO CREATE A NEW NOTE
   newNoteBtn.addEventListener("click", () => {
      currentNoteTitleNode.innerHTML = "";
      createForm("create", "New Note");
   }, false);

   // FORM FUNCTIONALITY
   formContainerNode.addEventListener("click", e => {
      e.preventDefault();
      let id = e.target.id;

      switch(id) {
         case "create":
            createNote();
            break;
         case "save-changes":
            notes.modify( currentNoteIndex, sanitize(document.getElementById("note-title").value, true), sanitize(document.getElementById("note-body").value) );
            notes.save();
            createNoteList();
            printNote(currentNoteIndex);
            selectNote(currentNoteIndex);
            formContainerNode.innerHTML = "";
            break;
         case "cancel":
            formContainerNode.innerHTML = "";
            if (!isNaN(currentNoteIndex)) {
               printNote(currentNoteIndex);
            }
            break;
         default:
            return;
      }
   }, false);

   // SELECT, EDIT, OR DELETE NOTE
   notesListNode.addEventListener("click", e => {
      e.preventDefault();
      let customAttr = e.target.dataset;

      if (customAttr.index) { // select and print note
         let index = +customAttr.index;
         selectNote(index);
         printNote(index);
         currentNoteIndex = index;
         if (leftPanelNode.classList.contains("left-panel--open")) leftPanelNode.classList.remove("left-panel--open"); // close left panel
         if (formContainerNode.innerHTML !== "") formContainerNode.innerHTML = ""; // remove form if it has content

      } else if (customAttr.button) { // check if target is a button
         let [btnType, index] = customAttr.button.split(" ");
         index = +index;
         let note = notes.notes[index];

         if (note) {
            if (btnType === "edit") {
               currentNoteIndex = index;
               createForm("save-changes", ("Editing " + note.title));
               document.getElementById("note-title").value = note.title;
               document.getElementById("note-body").value = note.body;
               
            } else if (btnType === "delete" && confirm("¿Do you want to delete " + note.title + "?")) {
               notes.remove(index);
               notes.save();
               currentNoteIndex = undefined;
               noteContentNode.innerHTML = "";
               currentNoteTitleNode.innerHTML = "";
               createNoteList();
            }
         }
      }
   }, false);

   // create form to define note's title and body
   function createForm(id, formTitle = "") {
      let content = "";
      noteContentNode.innerHTML = "";
      formTitle = formTitle.substr(0, 50);
      content += `<form id="form"> <h2 class="form__title">${formTitle}</h2>`;
      content += `<label for="note-title">Title</label> <input type="text" id="note-title" class="form__input" value="note ${(notesListNode.children.length + 1)}">`;
      content += `<label for="note-body">Body</label> <textarea id="note-body" class="form__input" cols="30" rows="10"></textarea>`;
      content += `<input type="button" class="button" id="cancel" value="Cancel"> <input type="submit" class="button" id="${id}" value="save">`;
      document.getElementById("form-container").innerHTML = content;
      document.getElementById("note-title").focus();

      if (leftPanelNode.classList.contains("left-panel--open")) leftPanelNode.classList.remove("left-panel--open"); // close left panel
   }

   // creates a note inside notes object and prints it into the DOM
   function createNote() {
      let title = document.getElementById("note-title").value,
          body = document.getElementById("note-body").value;
      title = sanitize(title, true);
      body = sanitize(body);

      if (title === "" || body === "") return; // if title or body are empty, do nothing

      currentNoteIndex = notes.index;
      notes.add(title, body);
      notes.save();
      formContainerNode.innerHTML = "";
      createNoteList();
      printNote(currentNoteIndex);
      selectNote(currentNoteIndex);
   }

   function printNote(index) {
      let note = notes.notes[index];

      if (note) {
         let {title, body} = note;
         title = sanitize(title, true);
         body = sanitize(body);
         currentNoteTitleNode.textContent = title;
         noteContentNode.innerHTML = marked(body);
      }
   }

   function createNoteList() {
      let note = notes.notes;
      notesListNode.innerHTML = "";
      for (let index in note) {
         let li = document.createElement("li");

         li.className = "notes-list__note";
         li.dataset.index = index;
         li.innerHTML = `
            <div class="notes-list__title-container">
               <p class="notes-list__title" data-index="${index}"> ${(note[index].title.length > 50) ? note[index].title.substr(0, 50) + "..." : note[index].title} </p>
            </div>
            <div class="notes-list__buttons">
               <button type="button" class="notes-list__button" data-button="edit ${index}" title="Edit note">
                  <img src="images/pencilIcon.svg" data-button="edit ${index}">
               </button>
               <button type="button" class="notes-list__button" data-button="delete ${index}" title="Delete note">
                  <img src="images/trashcanIcon.svg" data-button="delete ${index}">
               </button>
            </div>
         `;
         notesListNode.append(li);
      }
   }

   function selectNote(index) {
      let children = notesListNode.children;
      
      for (let i = 0; i < children.length; i++) {
         children[i].classList.remove("user-notes__note--selected");
         if (+children[i].getAttribute("data-index") === index) children[i].classList.add("user-notes__note--selected");
      }
   }

   // GET NOTES STORED IN USER MACHINE
   (function() {
      let dataResult = notes.getData();

      if (dataResult === true) {
         createNoteList();
      } else if (dataResult === false) {
         // data is not valid
      }
   }());
}, false);
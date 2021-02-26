// CONTAINER NODES
const leftPanelNode = document.getElementById("left-panel"),
      notesListNode = document.getElementById("notes-list"),
      formContainerNode = document.getElementById("form-container"),
      currentNoteTitleNode = document.getElementById("current-note-title"),
      noteContentNode = document.getElementById("note-content");

// BUTTONS
const newNoteBtn = document.getElementById("new-note-button"),
      editBtn = document.getElementById("edit-button"),
      deleteBtn = document.getElementById("delete-button"),
      menuBtn = document.getElementById("toggle-button"),
      closeBtn = document.getElementById("close-right-panel");
let currentNoteIndex, currentNoteNode;

function sanitize(value = "", trim = false) {
   if (trim) value = value.trim();
   value = DOMPurify.sanitize(value);
   return value;
}

// OPEN AND CLOSE LEFT-PANEL
menuBtn.addEventListener("click", () => leftPanelNode.classList.add("left-panel--open"), false);
closeBtn.addEventListener("click", () => leftPanelNode.classList.remove("left-panel--open"), false);
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
// SELECTS AND PRINTS A NOTES
notesListNode.addEventListener("click", e => {
   e.preventDefault();

   if (e.target.hasAttribute("data-index")) {
      let index = +e.target.getAttribute("data-index");
      selectNote(index);
      printNote(index);
      for (let i = 0; i < notesListNode.children.length; i++) {
         if (+notesListNode.children[i].getAttribute("data-index") === index) currentNoteNode = notesListNode.children[i];
      }
      currentNoteIndex = index;
      if (leftPanelNode.classList.contains("left-panel--open")) leftPanelNode.classList.remove("left-panel--open"); // close left panel
      if (!formContainerNode.innerHTML !== "") formContainerNode.innerHTML = ""; // remove form if it has content
   }
}, false);
// OPENS FORM TO CREATE A NEW NOTE
newNoteBtn.addEventListener("click", () => {
   createForm("create", "New Note");
}, false);
// DELETE CURRENT NOTE
deleteBtn.addEventListener("click", e => {
   e.preventDefault();

   if (!currentNoteNode) return; // if there's no current note, do nothing

   if (confirm("¿Do you want to delete " + currentNoteNode.textContent + "?")) {
      currentNoteNode = undefined;
      notes.remove(currentNoteIndex);
      currentNoteIndex = undefined;
      noteContentNode.innerHTML = "";
      currentNoteTitleNode.innerHTML = "";
      createNoteList();
   }
}, false);
// OPENS THE EDIT FORM
editBtn.addEventListener("click", e => {
   e.preventDefault();

   if (currentNoteNode) {
      let currentNote = notes.getNotes()[currentNoteIndex];
      createForm("save-changes", ("Editing " + currentNoteNode.textContent));
      document.getElementById("note-title").value = currentNote.title;
      document.getElementById("note-body").value = currentNote.body;
   }
}, false);

// create form to define note's title and body
function createForm(id, formTitle = "") {
   let content = "";

   noteContentNode.innerHTML = "";
   content += `<form id="form"> <h2 class="form__title">${formTitle}</h2>`;
   content += `<label for="note-title">Title</label> <input type="text" id="note-title" class="form__input" value="note ${(notes.getIndex() + 1)}">`;
   content += `<label for="note-body">Body</label> <textarea id="note-body" class="form__input" cols="30" rows="10">lorem ${(notes.getIndex() + 1)}</textarea>`;
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

   let index = notes.getIndex();
   currentNoteIndex = index;
   notes.add(title, body);
   // reset DOM content 
   formContainerNode.innerHTML = "";
   // define what note in notesListNode is the current note
   createNoteList();
   for (let key in notes.getNotes()) {
      for (let i = 0; i < notesListNode.children.length; i++) {
         if (key == notesListNode.children[i].dataset.index) currentNoteNode = notesListNode.children[i];
      }
   }

   printNote(index);
   selectNote(currentNoteIndex);
}

function printNote(index) {
   let note = notes.getNotes()[index];

   if (note) {
      let title = note.title,
          body = note.body;

      title = sanitize(title, true);
      body = sanitize(body);
      currentNoteTitleNode.textContent = title;
      noteContentNode.innerHTML = marked(body);
   }
}

function createNoteList() {
   let notesObj = notes.getNotes();
   notesListNode.innerHTML = "";
   for (let index in notesObj) {
      let li = document.createElement("li");
      li.className = "user-notes__note";
      li.dataset.index = index;
      li.textContent = notesObj[index].title.substr(0, 50);
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
var tasks = {}; //* list pf tasks array

var createTask = function (taskText, taskDate, taskList) {
   //* create elements that make up a task item
   var taskLi = $("<li>").addClass("list-group-item");
   var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(taskDate);
   var taskP = $("<p>").addClass("m-1").text(taskText);

   taskLi.append(taskSpan, taskP); //* append span and p element to parent li
   $("#list-" + taskList).append(taskLi); //* append to ul list on the page
};

var loadTasks = function () {
   tasks = JSON.parse(localStorage.getItem("tasks"));

   //* if nothing in localStorage, create a new object to track all task status arrays
   if (!tasks) {
      tasks = {
         toDo: [],
         inProgress: [],
         inReview: [],
         done: [],
      };
   }

   //* loop over tasks object list and array properties
   $.each(tasks, function (list, arr) {
      //* then loop over sub-array
      arr.forEach(function (task) {
         createTask(task.text, task.date, list); //* creates html for task
      });
   });
};

var saveTasks = function () {
   localStorage.setItem("tasks", JSON.stringify(tasks));
};

//* DELEGATED <p> CLICK on parent .list-group
//* .on( events [, selector ] [, data ], handler )
$(".list-group").on("click", "p", function () {
   var text = $(this).text().trim(); //* this - the DOM <p> element

   //* $("textarea") finds all existing <textarea> elements - it uses the element name as a selector.
   //* $("<textarea>") creates* new <textarea> element - HTML syntax for opening tag of element to be created.
   //* this new htnl element exist in memory only - at this moment
   var textInput = $("<textarea>").addClass("form-control").val(text);

   $(this).replaceWith(textInput); //* replaces this - current <p> - with edited content

   textInput.trigger("focus"); //* highlight textInput element
});

//* This blur event will trigger as soon as the user interacts with anything other than the <textarea> element.
$(".list-group").on("blur", "textarea", function () {
   var text = $(this).val().trim(); //* get current value/text from the textarea

   var status = $(this).closest(".list-group").attr("id").replace("list-", ""); //* get the parent ul's id attribute and gets the category name; e.g. "toDo"

   var index = $(this).closest(".list-group-item").index(); //* get the task's position within the list of li elements

   tasks[status][index].text = text; //* update task in array
   saveTasks(); //* save to Local Storage

   //* converts <textarea> back into <p>
   var taskP = $("<p>").addClass("m-1").text(text); //* recreate p element

   $(this).replaceWith(taskP); //* replace textarea with p element
});

//* due date was clicked
$(".list-group").on("click", "span", function () {
   var date = $(this).text().trim(); //* get current text

   var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date); //* create new input element

   $(this).replaceWith(dateInput); //* swap out elements

   dateInput.trigger("focus"); //* automatically (trigger) focus on dataInput
});

//* value of date was changed
$(".list-group").on("blur", "input[type='text']", function () {
   var date = $(this).val().trim(); //* get current text (date)

   var status = $(this).closest(".list-group").attr("id").replace("list-", ""); //* get the parent ul's id attribute

   var index = $(this).closest(".list-group-item").index(); //*get the task's position in the li list

   tasks[status][index].date = date; //* update task in array
   saveTasks();

   var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date); //* recreate span element with bootstrap classes

   $(this).replaceWith(taskSpan); //* replace input with span element
});

//*modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
   //*clear values
   $("#modalTaskDescription, #modalDueDate").val("");
});

//*modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
   //*highlight textarea
   $("#modalTaskDescription").trigger("focus");
});

//*save button in modal was clicked
$("#task-form-modal .btn-primary").click(function () {
   //*get form values
   var taskText = $("#modalTaskDescription").val();
   var taskDate = $("#modalDueDate").val();

   if (taskText && taskDate) {
      createTask(taskText, taskDate, "toDo");

      //*close modal
      $("#task-form-modal").modal("hide");

      //*save in tasks array
      tasks.toDo.push({
         text: taskText,
         date: taskDate,
      });

      saveTasks();
   }
});

//*remove all tasks
$("#remove-tasks").on("click", function () {
   for (var key in tasks) {
      tasks[key].length = 0;
      $("#list-" + key).empty();
   }
   saveTasks();
});

//* add sortable feature to elements of each list
//* The jQuery UI method, sortable(), turns every element with the class list-group
//* into a sortable list. The connectWith property then linked these sortable lists
//* with any other lists that have the same class.

// $(".card .list-group").sortable({ connectWith: $(".card .list-group") });
// $(".list-group").sortable({ connectWith: $(".list-group") });
//! OPTIONS

//* connectWith - A selector of other sortable elements that the items from this list should be connected to.
//* This is a one- way relationship, if you want the items to be connected in both directions, the
//* connectWith option must be set on both sortable elements.

//* If scroll is set to true, the page scrolls when coming to an edge.
//* tolerance - Specifies which mode to use for testing whether the item being moved is hovering over
//* another item.Possible values:
//* "intersect": The item overlaps the other item by at least 50%.
//* "pointer": The mouse pointer overlaps the other item.
//* Allows for a helper element to be used for dragging display.
//* Multiple types supported:
//* String: If set to "clone", then the element will be cloned and the clone will be dragged instead of the original. This is necessary to prevent click events from accidentally triggering on the original element.
//* Function: A function that will return a DOMElement to use while dragging. The function receives the event and the element being sorted.
//! EVENTS
// todo: The activate and deactivate events trigger once for all connected lists as soon as dragging starts and stops.
//* activate - This event is triggered when using connected lists, every connected list on drag start receives it.
//* deactivate - This event is triggered when sorting was stopped, is propagated to all possible connected lists.
// todo: The over and out events trigger when a dragged item enters or leaves a connected list.
//* over - This event is triggered when a sortable item is moved into a sortable list.
//* out - This event is triggered when a sortable item is moved away from a sortable list.
// todo: The update event triggers when the contents of a list have changed (e.g., the items were re-ordered, an item was removed, or an item was added).
//* update - This event is triggered when the user stopped sorting and the DOM position has changed.

//* var tempArr = []; //* array to store the task data in
//* update function loop over current set of children in sortable list
//* var text = $(this).find("p").text().trim();  "this" refers to the task <li>
$(".list-group").sortable({
   connectWith: $(".list-group"),
   scroll: false,
   tolerance: "pointer",
   helper: "clone",
   activate: function (event) {
      console.log("activate", this);
   },
   deactivate: function (event) {
      console.log("deactivate", this);
   },
   over: function (event) {
      console.log("over", event.target);
   },
   out: function (event) {
      console.log("out", event.target);
   },
   update: function (event) {
      var tempArr = [];
      $(this)
         .children()
         .each(function () {
            var text = $(this).find("p").text().trim();
            var date = $(this).find("span").text().trim();

            tempArr.push({
               text: text,
               date: date,
            });
         });
      //* trim down list's ID to match object property
      var arrName = $(this).attr("id").replace("list-", "");

      //* update array on tasks object and save
      tasks[arrName] = tempArr;
      saveTasks();
   },

   //! Events like activate and over would be great for styling. We could change the color of elements at each step to let the user know dragging is working correctly.
   //! For now, we're only concerned with the update event, because an updated list signifies the need to re- save tasks in localStorage.
   //! Remember that an update can happen to two lists at once if a task is dragged from one column to another.
});

//*  ui. This variable is an object that contains a property called draggable
//* According to the documentation, draggable is "a jQuery object representing the draggable element."
//* Then we should be able to call DOM methods on it!
//* accept: ".card .list-group-item"
//* we do not need to call saveTasks() because removing a task from any of the
//* lists triggers a sortable update(), meaning the sortable calls saveTasks() 
$("#trash").droppable({
   accept: ".list-group-item",
   tolerance: "touch",
   drop: function (event, ui) {
      console.log("drop");
      ui.draggable.remove();
   },
   over: function (event, ui) {
      console.log("over");
   },
   out: function (event, ui) {
      console.log("out");
   },
});

//*load tasks for the first time
loadTasks();

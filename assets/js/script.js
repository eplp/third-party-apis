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

//*load tasks for the first time
loadTasks();

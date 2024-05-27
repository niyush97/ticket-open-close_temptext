//dom content load and auto add the cursor to the input text
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-input-field").focus();
});

//デフォルトモード設定 using matchMedia and match querys
const isDarkmode = window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches;

if (isDarkmode) {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}
//auto-select user name based on local url.
//ローカルURLを基に自動でuser名選択↓
const url = window.location.href;
const nameuser = [
  { keyword: "ts-niyus.bajracharya", value: "Niyush Bajracharya" },
  { keyword: "ts-ron.weasley", value: "Ron Weasley" },
  { keyword: "ts-spongebob.squarepants", value: "Spongebob SquarePants" },
];

let selectedUsername = null;

for (i = 0; i < nameuser.length; i++) {
  if (url.includes(nameuser[i].keyword)) {
    const selector = document.querySelector(`#select-name option[value="${nameuser[i].value}"]`);
    selector.selected = true;
    break;
  }
}

if (!selectedUsername) {
  const selectName = document.getElementById('select-name');
  selectName.style.display = 'none'; // Hide the select element

  const inputName = document.createElement('input');
  inputName.id = 'username-input';
  inputName.placeholder = 'Enter your Name (Harry Potter)';
  inputName.style.width = '250px';
  inputName.style.height ='20px';
  inputName.style.borderRadius= '9px';
  inputName.style.padding='10px 20px';
  inputName.style.marginLeft ='4px';
  inputName.style.fontSize='16px';
   // Replace the select element with the input element
   selectName.parentNode.replaceChild(inputName, selectName);

  inputName.addEventListener('input', function() {
      selectedUsername = this.value.trim();
      displayUserInput();
  });
}

// -----------------Displaying the user input along with the predetermined template and date concatenation---------------
function displayUserInput() {
  // Get user input
  var userInput = document.getElementById("user-input-field").value;
  var finaluserName = document.getElementById('username-input').value.trim() || selectedUsername;
  const currentDate = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });

  // Store each template text in an array
  var templateTexts = ["各位\n" + "本日のチケット Open処理実施致しました。\n " + currentDate + " ", "Hello Team,\n " + "The following ticket of  activity has been opened.\n " + currentDate + " ", "各位\n" + "本日のチケット, Close処理実施致しました。" + "\n " + currentDate + " ", "Hello team,\n" + " activity is completed, Team has left,\n " + "ticket is closed and informed to affilated teams \n " + currentDate +" "];

// for closing mail name and cr concatenation
document.getElementById("selected-username-placeholder").textContent = selectedUsername;
document.getElementById('CRid').textContent=userInput;


  // Loop through each input result element and update its contents with the corresponding template text and user input
  var inputResults = document.getElementsByClassName("input-result");
  for (var i = 0; i < inputResults.length; i++) {
    var templateIndex = inputResults[i].getAttribute("data-template-index");
    var resultText = templateTexts[templateIndex] + userInput;
    inputResults[i].innerHTML = resultText;
  }
  // Add event listeners to each copy button
var copyButtons = document.getElementsByClassName("copy-button");
for (var i = 0; i < copyButtons.length; i++) {
  copyButtons[i].addEventListener("click", function (event) {
    // Find the input result element next to the clicked copy button
    var inputResult = event.target.previousElementSibling;

    // Remove HTML tags from the innerHTML and replace <br> with \n
    var plainText = inputResult.innerHTML.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
// Trim the whitespace from the user input name
plainText = plainText.replace(/^\s+|\s+$/g, '');
    // Create a temporary textarea element to copy the input result contents
    var tempTextarea = document.createElement("textarea");
    tempTextarea.value = plainText;

    // Append the temporary textarea to the page and select its contents
    document.body.appendChild(tempTextarea);
    tempTextarea.select();

    // Copy the selected contents to the clipboard and remove the temporary textarea
    document.execCommand("copy");
    document.body.removeChild(tempTextarea);
  });
}
}
//👆 END OF ARRAY FUNCTION HERE.

//------------------MAIL SUBMIT BUTTON HANDLING AND EMAIL CREATION AND USER INPUT STORAGE IN NODE JS---------------------
function handleSubmit(event) {
  event.preventDefault();
  const userInput = $("#user-input-field").val();
  const currentDate = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  const userResult = `${currentDate} ${userInput}`;
  $("#user-input-with-date").text(userResult);
  $("#user-input").show();
  $("#user-input-result").show();
  saveResult(userResult);
}
//-------------SAVING THE USER INPUTTED DATA IN BACKEND NODE-----------------------------------------
function saveResult(userResult) {
  $.ajax({
    type: "POST",
    url: "/save-user-result",
    data: JSON.stringify({ userResult }),
    contentType: "application/json",
    success: function (response) {
      console.log("Saved user result successfully");
    },
    error: function (error) {
      console.error("Error saving user result:", error);
    },
  });
}
//------------------EMAIL SEND BUTTON AND PRE DETERMINDED TEMPLATE ACCESSING USER INPUT---------------------
function sendEmail() {
  event.preventDefault();
  const userInput = $("#user-input-field").val();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const formattedDate = currentDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  const formattedDate2 = formattedDate.replace(/\//g, "-");
  const userResult = `${formattedDate} ${userInput}`;
  $("#user-input-with-date").text(userResult);

  // Get the selected priority from the user
  var selectedPriorityValue = null;
  var priority2 = document.getElementById("priority2");
  var priority = document.getElementById("priority");
  if (priority2.checked) {
    selectedPriorityValue = priority2.value;
  } else if (priority.checked) {
    selectedPriorityValue = priority.value;
  } else {
    alert("select the priority of the ticket first。");
  }

  // Continue with the rest of the code if P２ is selected
  if (selectedPriorityValue) {
    var to = " <24x7@abc.com>";
    var cc = " <national@mail..com>";
    var subject = "Intimation regarding the Ticket No.: " + userInput;
    var selectedName = $("#select-name").val();
var newuser = document.getElementById('username-input');
    // Concatenate the user input value with the selected name
    if (newuser && newuser.value.trim() !== '') {
      selectedName += ` (${newuser.value})`;
    }

    var body =
      "Hi  Team,\n This is intimation regarding the .: " +
      userInput +
      "\nBasically, this activity has no impact ." +
      "\n" +
      "\n" +
      "【" +
      formattedDate +
      "】" +
      "\n\n(1) ticket No.: " +
      userInput +
      "\n" +
      "(2) Task Name: [Routine] work\n(3) Priority: " +
      selectedPriorityValue +
      " \n(4) Purpose of ticket: Measuring the  power  and  ---- was broken we might change the ----\n(5) Impact of Change: There will not be any downtime, signal cutoff. .\n(6) Start Time:   " +
      currentYear +
      "-" +
      formattedDate2 +
      "    08:00AM\n(7) End Time:   " +
      currentYear +
      "-" +
      formattedDate2 +
      "   08:00PM\n(8) Executor name: System\n(9) Supervisor name: Harry Potter\n (10) Tel: 0120-3456-7892 / Email: Harrypotter@mail.com\n\n\nBest Regards," +
      "\n" +selectedUsername;

    var mailtoUrl = "mailto:" + to + "?cc=" + cc + "&subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    window.location.href = mailtoUrl;
  } else {
    console.log("プライオリティを選択してください。");
  }
}

//---------------------------Anchor tag concatenation------------------------------
//end monitoring link + inputted CR concatenation part
var inputUrl = document.getElementById("user-input-field");
var outputUrl = document.getElementById("output-url");
var concatenatedUrl = document.getElementById("concatenated-url");

//listen for the changes in the input element
inputUrl.addEventListener("input", function () {
  var userInput = inputUrl.value;
  //to concatenate the user input with the URL
  var concatenatedUrl = "https://www.google.com/" + userInput;
  //setting the url to anchor tag
  outputUrl.href = concatenatedUrl;
  //updating the content of URL【output】をURLに置き換える為
  outputUrl.textContent = concatenatedUrl;
});
//----------------------------------------------------------------------------------------------------------------------
//CR openlink for shortucut😎😋😋😋😋
var openUrl = document.getElementById("user-input-field");
var displayLink = document.getElementById("openCRlink");
var joinUrl = document.getElementById("join-url");
var CRLinkCopyButton = document.getElementById("taskbut");

openUrl.addEventListener("input", function () {
  var openInput = openUrl.value;
  var urlToconcat = "https://www.google.com/" + openInput.trim();
  displayLink.href = urlToconcat;
  displayLink.textContent = urlToconcat;
});

//CREATING AND MAKING THE BUTTON FUNCTION FOR COPYING THE CONCATENATED CR ID AND LINK🔘
CRLinkCopyButton.addEventListener("click", function () {
  var openInput = openUrl.value;
  var urlToconcat = "https://www.google.com/=" + openInput.trim();
  var textToCopy = urlToconcat;
  //copy to clipboard
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.error("Error copying text: ", error);
    });
  notifyCopy(); //how the fuck is this function working without even declaring the div in DOM
});

// //------------------【各CRタスクの文言用のコピーボタン】
// COPY BUTTON FOR TASK EXECUTION BASED ON TEMPLATE NUMBER AND TEXT-------------------------------
function copyToClipboard(id) {
  const template = document.getElementById(id);
  const text = template.innerText;
  //copy to clipboard
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.error("Error copying text: ", error);
    });
  notifyCopy();
}

//popup 💭Notification when the copy button is clicked
function notifyCopy() {
  const notification = document.getElementById("notification");
  notification.style.display = "block";
  notification.innerHTML = "Text Copied";
  notification.style.opacity = "0";
  setTimeout(() => {
    notification.style.opacity = "1";
  }, 100);
  setTimeout(() => {
    notification.style.opacity = "0";
  }, 1900);
  setTimeout(() => {
    notification.style.opacity = "none";
  }, 2000);
}
//--------------------COPY BUTTON AND USER INPUT + SELECT OPTION CONCATENATION FOR CR CLOSING MAIL -------------------------
function concatenateAndCopy() {
  //defining variable to acces user input and selected option
  var selectValue = document.getElementById("select-name").value;

  var newuser = document.getElementById('username-input');
    // Concatenate the user input value with the selected name
    if (newuser && newuser.value.trim() !== '') {
      selectValue += ` (${newuser.value})`;
    }
  var inputValue = document.getElementById("user-input-field").value;
  const templateMail = "Hi Team\n" + "Activity completed, Team has left, and ticket is closed\n" + "\n{CR}\n" + "\n" + "Best Regards," + "\n" + "{name}";
  //concatenating and replacing the template text with user input values
  const resultMail = templateMail.replace("{CR}", inputValue).replace("{name}", selectValue);
  //copy to clipboard

  navigator.clipboard
    .writeText(resultMail)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.log("Error copying text: ", error);
    });
  notifyCopy();
}

// [R]GCサポートOPEN/CLose連絡用
// GCサポートOpenの場合のコード CR-GEN-xxxxxx ニユス　 open
function GCOpen() {
  const currentDate = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  const GCopenValue = document.getElementById("select-name");
  const GCopenInput = document.getElementById("user-input-field").value;
  const opentemplate = "各位\n" + "本日、以下のticketをOpenしました。\n" + "\n" + "【" + currentDate + "】" + "\n" + "{CR}" + " " + "{names}" + " " + "Open";
  const displayName = document.querySelector("#select-name option:checked").getAttribute("name");
  const openResult = opentemplate.replace("{CR}", GCopenInput).replace("{names}", displayName);
  navigator.clipboard
    .writeText(openResult)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.log("Error copying text: ", error);
    });
  notifyCopy();
}
// クローズの場合のコード CR-GEN-xxxxxx ニユス　 close
function GCClose() {
  const currentDate = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
  const GCCloseValue = document.getElementById("select-name");
  const GCCloseInput = document.getElementById("user-input-field").value;
  const Closetemplate = "各位\n" + "本日、以下のticketをCloseしました。\n" + "\n" + "【" + currentDate + "】" + "\n" + "{CR}" + " " + "{names}" + " " + "Close";
  const displayName = document.querySelector("#select-name option:checked").getAttribute("name");
  const CloseResult = Closetemplate.replace("{CR}", GCCloseInput).replace("{names}", displayName);
  navigator.clipboard
    .writeText(CloseResult)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.log("Error copying text: ", error);
    });
  notifyCopy();
}

//========DARK MODE TOGGLE BUTTON================
const modeToggle = document.querySelector("#mode-toggle");
const body = document.body;

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    modeToggle.textContent = "☼";
  } else {
    modeToggle.textContent = "🌙";
  }
});

//sticky heading js
window.onscroll = () => {
  stickyClose();
};
var headingClose = document.querySelector(".CRcloseHeading");

function stickyClose() {
  if (window.pageYOffset > headingClose.offSetTop) {
    headingClose.classList.add("sticky");
  } else {
    headingClose.classList.remove("sticky");
  }
}

//rollback display
//INCLUDED IN THE HTML PART AS INLINE-JAVASCRIPT WITH WINDOW.ONLOAD()FUNCTION
//INCLUDED HERE ALSO JUST INCASE THE FUNCTION IS NOT LOADED AND BACKUP OPERATIONS CAN BE CONDUCTED.
const alarmSelect = document.getElementById("alarm-select");
const rollbackDiv = document.querySelector(".Rollback");

alarmSelect.addEventListener("change", function () {
  if (this.value === "yes") {
    rollbackDiv.style.display = "block";
  } else {
    rollbackDiv.style.display = "none";
  }
});

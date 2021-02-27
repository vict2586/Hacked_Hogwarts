"use strict";

document.addEventListener("DOMContentLoaded", start);

let AllStudents = [];

let ExpelledStudents = [];

// Global
let settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
};

let bloodObject; 

let systemIsHacked = false;

const search = document.querySelector(".search");

let numberOfStudents = document.querySelector(".studentnumber")











function start() {
  console.log("Ready");

  readBtns();

  ListAllStudents();
};










function readBtns() {
  //console.log("filter, sort or search ")
  
  // Filterbuttons
  document.querySelectorAll("[data-action='filter']")
    .forEach(button => button.addEventListener("click", selectFilter));


  // Sorting
  document.querySelectorAll("[data-action='sort']")
    .forEach(button => button.addEventListener("click", selectSort)); 


  // Search 
  search.addEventListener("input", startSearch);
};










// Search 
function startSearch(event) {

  let searchList = AllStudents.filter((students) => {

    let name = "";

    if (students.lastname === null) {
      name = students.firstname;
    } else {
      name = students.firstname + " " + students.lastname;
    }
    return name.toLowerCase().includes(event.target.value);
  });

  //Show number of students
  numberOfStudents.textContent = `All students: ${searchList.length}`;

  displayList(searchList);
}










// Tells what button was clicked
function selectFilter( event ) {

  //reads witch button is clicked
  const filterBy = event.target.dataset.filter;

  console.log(`Clicked ${filterBy}`);

  setFilter(filterBy);
};





function setFilter(filterBy ) {
  settings.filterBy = filterBy;
  buildList();
};





// Filter what should be filtered
function filterList(filterredList) {
  //adds the selected students to filteredList
  
  if (settings.filterBy === "gryffindor") {
    filterredList = AllStudents.filter(isGryffindor);

  } else if (settings.filterBy === "hufflepuff") {
    filterredList = AllStudents.filter(isHufflepuff);

  } else if (settings.filterBy === "ravenclaw") {
    filterredList = AllStudents.filter(isRavenclaw);
    
  } else if (settings.filterBy === "slytherin") {
    filterredList = AllStudents.filter(isSlytherin);

  } else if (settings.filterBy === "expelled"){
    filterredList = ExpelledStudents;
    
  } else if (settings.filterBy === "prefect") {
    filterredList = AllStudents.filter(isPrefect);

  } else if (settings.filterBy === "inquisitorial-squad") {
    filterredList = AllStudents.filter(isSquad);

  }

  //Show number of students
  numberOfStudents.textContent = `All students: ${filterredList.length}`;

  //console.log(filterredList);
  return filterredList;
};










// See only gryffindor students
function isGryffindor(house) {
  console.log("gryffindor");
  
  return house.house === "Gryffindor";
};



// See only hufflepuff students
function isHufflepuff(house) {
  console.log("hufflepuff");
  
  return house.house === "Hufflepuff";
};



// See only ravenclaw students
function isRavenclaw(house) {
  console.log("ravenclaw");
  
  return house.house === "Ravenclaw";
};



// See only slytherin students
function isSlytherin(house) {
  console.log("slytherin");
  
  return house.house === "Slytherin";
};





// See only prefect students
function isPrefect(students) {
  if (students.prefect === true) {
    return true;

  } else {
    return false;
  }
}





// See only squad students
function isSquad(students) {
  if (students.inquisitorialsquad === true) {
    return true;

  } else {
    return false;
  }
}










// Finds what should be sortet and telles next function
function selectSort( event ) {
  console.log("Toggel sort")

  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // Toggel direction
  if (settings.sortDir === "asc") {
      event.target.dataset.sortDirection = "desc";
  } else {
      event.target.dataset.sortDirection = "asc";
  };

  setSort( sortBy, sortDir );
};





function setSort( sortBy, sortDir ) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
};





// Sort what should be sortet
function sortList( AllStudents ) {
  //console.log("sort is in the house")

  let direction = 1;

  if (settings.sortDir === "desc") {
      direction = -1;
  }else {
      direction = 1;
  };

  AllStudents.sort( sortByProperty );

  function sortByProperty ( a, b ) {
      if( a[settings.sortBy] < b[settings.sortBy]) {
          return -1 * direction;
      }else {
          return 1 * direction;
      }
  };

  return AllStudents;
};










// Builds list form filter and sort
function buildList() {
  //console.log("Bilding");

  const fList = filterList( AllStudents );
  const sList = sortList( fList );

  displayList( sList );
};










// Fetch info from json
async function ListAllStudents() {
  //console.log("Done");

  const url1 = "https://petlatkea.dk/2021/hogwarts/students.json";
  const url2 = "https://petlatkea.dk/2021/hogwarts/families.json"

  const jsonData = await fetch(url1);
  const jsonObject = await jsonData.json();

  const bloodData = await fetch(url2);
  bloodObject = await bloodData.json();

  ShowStudents(jsonObject, bloodObject);
};










// The same as prepare objects function
function ShowStudents(student) {
//console.log("There is so manny");

  student.forEach((student) => {

    // make template
    const studenttemp = {
      firstname: "",
      middlename: undefined,
      lastname: "",
      nickname: undefined,
      gender: "",
      photo: undefined,
      house: "",
      blood: "",
      prefect: false,
      expelled: false,
      inquisitorialsquad: false
  };

  // create template
  const students = Object.create(studenttemp);


  // Split "fullname" into smaller parts.
  const fullName = student.fullname.toLowerCase().trim();
  const splitFullName = fullName.split(" ");
  const house = student.house.toLowerCase().trim();
  const gender = student.gender.toLowerCase().trim();
  
  let lastName = "";
  let indexhyphen = 0;
  let firstLetterAfterHyphen = "";
  let smallLettersAfterHyphen = "";
  

  // Firstname
  let firstName = splitFullName[0].substring(0, 1).toUpperCase() + splitFullName[0].substring(1);
  
  students.firstname = firstName;
  

  if (splitFullName.length > 1) {
    
    // Lastname
    lastName = splitFullName[splitFullName.length - 1].substring(0, 1).toUpperCase() +
      splitFullName[splitFullName.length - 1].substring(1);
  

    // Check for a hyphen in the lastnames
    indexhyphen = lastName.indexOf("-");

    if (indexhyphen != -1) {
      const nameBeforeHyphen = lastName.substring(0, indexhyphen + 1);

      firstLetterAfterHyphen = lastName.substring(indexhyphen + 1, indexhyphen + 2).toUpperCase();

      smallLettersAfterHyphen = lastName.substring(indexhyphen + 2);
      
      lastName = nameBeforeHyphen + firstLetterAfterHyphen + smallLettersAfterHyphen;
    }
  
    students.lastname = lastName;
  

    // Middlename or Nickname
    let middlename = "";
    let nickname = "";

    if (splitFullName.length > 2) {

      if (splitFullName[1].indexOf('"') >= 0) {

        nickname = splitFullName[1].replaceAll('"', "");
  
        nickname = nickname.substring(0, 1).toUpperCase() + nickname.substring(1);

        middlename = "";

      } else {
        middlename = splitFullName[1].substring(0, 1).toUpperCase() + splitFullName[1].substring(1);

        nickname = "";
      }

    } else {
      middlename = "";
    }
  
    students.middlename = middlename;
    students.nickname = nickname;
  

    //console.log(middlename);
    //console.log(nickname);

  } else {
    students.lastname = "";
    students.middlename = "";
    students.nickname = "";
  }
  
  // Photo
  if (students.lastname != null) {

    if (indexhyphen == -1) {

      if (students.firstname == "Padma" || students.firstname == "Parvati") {

        students.photo = lastName.toLowerCase() + "_" + firstName.substring(0).toLowerCase() + ".png";

      } else {
        students.photo = lastName.toLowerCase() + "_" + firstName.substring(0, 1).toLowerCase() + ".png";
      }

    } else {
      students.photo = firstLetterAfterHyphen.toLocaleLowerCase() + smallLettersAfterHyphen + "_" +
        firstName.substring(0, 1).toLowerCase() + ".png";
    }

  } else {
    students.photo = "";
  }

  /*
  if (students.firstname === "Leanne") {

    students.photo = firstName.substring(0).toLowerCase() + ".png";

  } else {
    students.photo = firstName.substring(0, 1).toLowerCase() + ".png";
  }
  */
  
  // House is already a seperate string so just adds the age to the object
  students.house = house.substring(0, 1).toUpperCase() + house.substring(1);

  students.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1);

  students.blood = bloodStatus(students);

  // Prefect
  students.prefect = false;

  // Show number of students
  numberOfStudents.textContent = `All students: ${students.length}`;
    
  AllStudents.push(students);

  });

  displayList(AllStudents);

};










// Blood status
function bloodStatus(students) {

  if (bloodObject.half.indexOf(students.lastname) !=-1) {
    return "Half blood"

  } else if (bloodObject.pure.indexOf(students.lastname) !=-1) {
    return "Pure blood"

  } else {
    return "Muggle"
  }
  
}










// Clear list and makes new
function displayList(students) {
  //console.log("Clear and make mew");

  // Clear list
  document.querySelector("#list tbody").innerHTML = "";

  // Make new list
  students.forEach(displayStudents);
};










// Clone and show in html
function displayStudents(students) {
  //console.log("Hello all clones");

  // Create clone 
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // Tells what info should be in the clone
  clone.querySelector("[data-field=firstname]").textContent = students.firstname;
  clone.querySelector("[data-field=lastname]").textContent = students.lastname;
  clone.querySelector("[data-field=house]").textContent = students.house;

  // When clicked on student show popup
  clone.querySelector(".temp").addEventListener("click", () => showDetails(students));

  // Append clone to list
  document.querySelector("#list tbody").appendChild(clone);

};










// Popup
function showDetails(students) {
  console.log("popup");

  popup.style.display = "block";

  // Names
  popup.querySelector(".fullname").textContent = `${students.firstname} ${students.lastname}`;
  popup.querySelector(".middlename").textContent = `Middlename: ${students.middlename}`;
  popup.querySelector(".nickname").textContent = `Nickname: ${students.nickname}`;

  // Gender
  popup.querySelector("#gender").textContent = `Gender: ${students.gender}`;

  // House
  popup.querySelector("#house").textContent = `House: ${students.house}`;

  // blod-status
  popup.querySelector("#blood").textContent = `Blood status: ${students.blood}`;
  
  // Prefects
  if (students.prefect === true) {
    popup.querySelector(".prefect").textContent = `Prefect: Yes`;

  } else {
    popup.querySelector(".prefect").textContent = `Prefect: No`;
  }

  document.querySelector("#prefectbutton").addEventListener("click", prefectClosure);
  
  function prefectClosure() {
    document.querySelector("#prefectbutton").removeEventListener("click", prefectClosure);

    makePrefect(students);
  }
  
  // inquisitor 
  document.querySelector("#squadbutton").addEventListener("click", addStudentInquisitorialSquad);

  if (students.inquisitorialsquad) {
    document.querySelector("#squadbutton").textContent = "Remove from inquisitorial Squad";
  } else {
    document.querySelector("#squadbutton").textContent = "Add to inquisitorial Squad";
  }

  function addStudentInquisitorialSquad(){
    console.log("addStudentInquisitorialSquad");

    toggleInquisitorialSquad(students);
};

  // Expelled
  document.querySelector("#expellbutton").addEventListener("click", expellStudentClosure);

  if (students.expelled === true) {
    popup.querySelector(".expell").textContent = `Expelled: Yes`
    popup.querySelector("#squadbutton").classList.add("hide");
    popup.querySelector("#prefectbutton").classList.add("hide");
    popup.querySelector("#expellbutton").classList.add("hide");

  } else if (students.expelled === false){
    popup.querySelector(".expell").textContent = `Expelled: No`
    popup.querySelector("#squadbutton").classList.remove("hide");
    popup.querySelector("#prefectbutton").classList.remove("hide");
    popup.querySelector("#expellbutton").classList.remove("hide");
   
  }
  
  function expellStudentClosure() {
    document.querySelector("#expellbutton").removeEventListener("click", expellStudentClosure);

    expellStudent(students);
  }

  // Student photo, house shield and house colors
  if (students.photo != null) {
    popup.querySelector("#photo").src = "images/" + students.photo;
  }

  popup.querySelector("#shield").src = "images/" + students.house.toLowerCase() + ".png";

  popup.querySelector("#color").src = "images/" + students.house.toLowerCase() + "_color.png";

  // Close popup
  document.querySelector(".close").addEventListener("click", () => (popup.style.display = "none"));
}










// Expell student
function expellStudent(students){
  console.log("Expell button clicked")

  students.expelled = !students.expelled

  // Removes student from AllStudents array
  AllStudents.splice(AllStudents.indexOf(students), 1);

  ExpelledStudents.push(students);

  buildList();
}










// Add student to prefect
function makePrefect(students) {

  const sameHouse = AllStudents.filter(checkHouse);

  if (students.prefect === true) {
    students.prefect = !students.prefect;

    console.log(students);

  } else if (sameHouse.length >= 1) {
    prefectConflict(sameHouse, students);

    console.log(sameHouse);

  } else if (students.prefect === false) {
    students.prefect = !students.prefect;

    console.log(students);
  }

  function checkHouse(compareStudent) {
    if (students.house === compareStudent.house && compareStudent.prefect == true) {
      return true;

    } else {
      return false;
    }
  }
  showDetails(students);

  buildList(students);
}





// Starts if there is a conflict - prefect
function prefectConflict(sameHouse, students) {

  document.querySelector("#prefectConflict").classList.add("show");
  
  document.querySelector(".closePrefect").addEventListener("click", removeDialog);
  
  document.querySelector("#prefectConflict .student1").textContent = `${sameHouse[0].firstname} ${sameHouse[0].lastname}`;
  
  document.querySelector("#prefectConflict [data-action=remove]").addEventListener("click", function () {togglePrefect(students);});

  function togglePrefect(students) {
    document.querySelector("#prefectConflict [data-action=remove]").removeEventListener("click", function () {togglePrefect(students);});

    document.querySelector("#prefectConflict").classList.remove("show");

    console.log(students);

    students.prefect = !students.prefect;
  }

  function removeDialog() {
    document.querySelector(".closePrefect").removeEventListener("click", removeDialog);

    document.querySelector("#prefectConflict").classList.remove("show");

    showDetails(students);
  }

  buildList();
}










// Add student to Inquisitorial Squad
function toggleInquisitorialSquad(students) {
  console.log("toggleInquisitorialSquad")

  if (students.inquisitorialsquad) {

    console.log("This student is not a member anymore");

    students.inquisitorialsquad === false;

  } else if (students.blood === "Pure blood" || students.house === "Slytherin") {
    students.inquisitorialsquad = true;

    if (systemIsHacked) {
      setTimeout(function () {toggleInquisitorialSquad(student);}, 2000);
    }

  } else {
    showWarning();
  }

  buildList();
}





function showWarning() {
  console.log("This student cannot be member!");

  document.querySelector("#warning").classList.remove("inquisitorHide");
  
  document.querySelector(".understood_button").addEventListener("click", closeWarning);

  function closeWarning() {
    document.querySelector("#warning").classList.add("inquisitorHide");
    
    document.querySelector(".understood_button").removeEventListener("click", closeWarning);
  }

}










// Hack system
function hackTheSystem() {
  if (systemIsHacked === false) {

    //add me to studentlist
    console.log("You have hacked");

    const IsMe = Object.create(studenttemp);

    IsMe.firstname = "Victoria";
    IsMe.lastname = "Bührmann";
    IsMe.middlename = "";
    IsMe.nickname = "vigi";
    IsMe.photo = "me.png";
    IsMe.house = "Hufflepuff";
    IsMe.gender = "girl";
    IsMe.prefect = true;
    IsMe.expelled = false;
    IsMe.blood = "Half blood";
    IsMe.squad = false;

    AllStudents.unshift(IsMe);

    systemIsHacked = true;

    //fuck up blood-status
    messWithBlood();

    buildList();

  } else {
    alert("System's allready been hacked!");
  }

  setTimeout(function () {alert("You have been hacked!");}, 1000);
}










// Change blood types
function messWithBlood() {

  AllStudents.forEach((students) => {

    if (students.blood === "Muggle") {
      students.blood = "Pure blood";

    } else if (students.blood === "Half blood") {
      students.blood = "Pure blood";

    } else {
      let bloodNumber = Math.floor(Math.random() * 3);

      if (bloodNumber === 0) {
        students.blood = "Muggle";

      } else if (bloodNumber === 1) {
        students.blood = "Half blood";

      } else {
        students.blood = "Pure blood";
      }
    }

  });

}

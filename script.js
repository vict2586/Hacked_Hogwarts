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
    console.log(ExpelledStudents);

    AllStudents = ExpelledStudents;
    
    return ExpelledStudents; 
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

  const url = "https://petlatkea.dk/2021/hogwarts/students.json";

  const jsonData = await fetch(url);

  const jsonObject = await jsonData.json();

  ShowStudents(jsonObject);
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
      prefect: "No",
      expelled: false
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
  let firstName =
    splitFullName[0].substring(0, 1).toUpperCase() +
    splitFullName[0].substring(1);
  

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
    students.lastname = null;
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
    students.photo = null;
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

  // Show number of students
  numberOfStudents.textContent = `All students: ${students.length}`;
    
  AllStudents.push(students);

  });

  displayList(AllStudents);

};










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

  // blod-status goes here
  
  // Prefects
  popup.querySelector(".prefect").textContent = `Prefect: ${students.prefect}`;

  // inquisitor goes here 

  // Expelled
  document.querySelector("#expellbutton").addEventListener("click", expellStudentClosure);

  if (students.expelled === true) {
    popup.querySelector("#squadbutton").classList.add("hide");
    popup.querySelector("#prefectbutton").classList.add("hide");
    popup.querySelector("#expellbutton").classList.add("hide");

  } else if (students.expelled === false){
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










function expellStudent(students){
  console.log("Expell button clicked")

  students.expelled = !students.expelled

  // Removes student from AllStudents array
  AllStudents.splice(AllStudents.indexOf(students), 1);

  ExpelledStudents.push(students);

  buildList();
}
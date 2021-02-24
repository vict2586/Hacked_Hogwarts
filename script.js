"use strict";

document.addEventListener("DOMContentLoaded", ListAllStudents);

let AllStudents = [];

// Global
let settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc"
};











function start() {
  console.log("Ready");


  //Filter
  document.querySelectorAll("[data-action=filter]")
    .forEach((button) => button.addEventListener("click", selectFilter)); 


  //Sorting
  document.querySelectorAll("[data-action=sort]")
    .forEach(button => button.addEventListener("click", selectSort)); 


  ListAllStudents();
}










// Finds what should be sortet and telles next function
function selectSort( event ) {
  console.log("I am working just fine - sort")

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
  bildList();
}










// Sort what should be sortet
function sortList( AllStudents ) {
  console.log("I too am working")

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










// Tells what button was clicked
function selectFilter( event ) {

  //reads witch button is clicked
  const filterBy = event.target.dataset.filter;

  console.log(`You clicked this ${filterBy}`);

  setFilter(filterBy);
};










function setFilter( filterBy ) {
  settings.filterBy = filterBy;
  bildList();
};










// Filter what should be Filtered
function filterList( filteredList ){

  if (settings.filterBy === "gryffindor") {
      filteredList = AllStudents.filter(isGry);

  } else if (settings.filterBy === "hufflepuff") {
      filteredList = AllStudents.filter(isHuf);

  }else if (settings.filterBy === "rawenclaw") {
    filteredList = AllStudents.filter(isRaw);

  }else if (settings.filterBy === "slytherin") {
  filteredList = AllStudents.filter(isSly);

  }else if (settings.filterBy === "prefect") {
  filteredList = AllStudents.filter(isPre);

  }else if (settings.filterBy === "inquisitorialSquad") {
  filteredList = AllStudents.filter(isInq);

  }else if (settings.filterBy === "expelled") {
  filteredList = AllStudents.filter(isExp);

  }

  return filteredList;

};










// Filter to only see gryffindors
function isGry( students ) {
  return students.house === "gryffindor";
}





// Filter to only see hufflepuffs
function isHuf( students ) {
  return students.house === "hufflepuff";
}





// Filter to only see rawenclaws
function isRaw( students ) {
  return students.house === "rawenclaw";
}





// Filter to only see slytherins
function isSly( students ) {
  return students.house === "slytherin";
}





// Filter to only see prefects
function isPre( students ) {
  return students.type === "prefect";
}





// Filter to only see inquisitorialSquads
function isInq( students ) {
  return students.type === "inquisitorialSquad";
}





// Filter to only see expelleds
function isExp( students ) {
  return students.type === "expelled";
}










// Bilds a new list, first filter then sort
function bildList() {
  console.log("Bilding");

  const fList = filterList( AllStudents );
  const sList = sortList( fList );

  displayList( sList );
}










// fetch info from json
async function ListAllStudents() {
  //console.log("Done");

  const url = "https://petlatkea.dk/2021/hogwarts/students.json";

  const jsonData = await fetch(url);

  const jsonObject = await jsonData.json();

  ShowStudents(jsonObject);
};










function ShowStudents(jsonObject) {
  //console.log("There is so manny");


    jsonObject.forEach((student) => {

      // make template
      const studenttemp = {
        firstname: "",
        middlename: undefined,
        lastname: "",
        nickname: undefined,
        gender: "",
        img: undefined,
        house: ""
    };

      // create template
      const students = Object.create(studenttemp);


      // tells what first and last space is
      const firstSpace = student.fullname.trim().indexOf(" ");
      const lastSpace = student.fullname.trim().lastIndexOf(" ");


      // tells to get house, gender, first, last, middel and nicknames
      students.firstname = student.fullname.trim().substring(0, firstSpace);
      students.middlename = student.fullname.trim().substring(firstSpace, lastSpace);
      students.nickname = student.fullname.trim().substring(firstSpace, lastSpace);

      if (students.middlename.substring(0,1) == `"`) {
        students.nickname = students.middlename;
        students.middlename = "";
      } else {
        students.nickname = "";
      }

      students.lastname = student.fullname.trim().substring(lastSpace);
      students.gender = student.gender;
      students.house = student.house.trim().substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();
      students.img = student["none"];

      //console.log(students);

      
      AllStudents.push(students);

    });

  displayList();

};










function displayList() {
  console.log("I am here");

  // Clear list
  document.querySelector("#list tbody").innerHTML = "";

  // Make new list
  AllStudents.forEach(displayStudents);
}










function displayStudents(students) {
  console.log("Hello all clones");

  // Create clone 
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // Tells what info should be in the clone
  clone.querySelector("[data-field=firstname]").textContent = students.firstname;
  clone.querySelector("[data-field=middlename]").textContent = students.middlename;
  clone.querySelector("[data-field=lastname]").textContent = students.lastname;
  clone.querySelector("[data-field=house]").textContent = students.house;

  // When clicked on student show popup
  //clone.querySelector("#student").addEventListener("click", () => showDetails(student));

  // Append clone to list
  document.querySelector("#list tbody").appendChild(clone);

}










function showDetails(student) {

}
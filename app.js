//**SETUP
// buttons
const newBtn = document.querySelector('.newButton');
const backBtn = document.querySelector('.backBtn');
const saveBtn = document.querySelector('.saveBtn');
const deleteBtn = document.querySelector('.deleteBtn');
const searchBtn = document.querySelector('.searchBtn');
const dotBtn = document.querySelector('.dotBtn');

// text areas and inputs and displayed texts
const searchBar = document.querySelector('.searchBar');
const searchPage = document.querySelector('.searchPage');
const notesTitle = document.querySelector('.notesTitle');
const creationDate = document.querySelector('.creationDate');

const titleRight = document.querySelector('#title-right');
const contentRight = document.querySelector('#content-right');
const dateRight = document.querySelector('.date-right');

//divs spans and misc
const leftPart= document.querySelector('.leftPart');
const leftWrapper = document.querySelector('.leftWrapper');
const rightPart = document.querySelector('.rightPart');
const smallDevice = window.matchMedia("(max-width: 600px)");
checkScreenSize();
//variables
const colorList = [
   '#6b6969',
   '#fe9a37',
   '#cbdb57',
   '#9585ba',
   '#5c4f45',
   '#f96a4b',
   '#dea44d',
   '#9e5c32'];
let inputStored = [];
let idDisplay = [];
let tempTitle = '';
let tempContent = '';
let tempDate = '';
let clickedOnId = '';
let editFlag = false;
// DOM LOADED
window.addEventListener('DOMContentLoaded', () =>{
  dateRight.textContent = getCurrentDate();
    if(getLocalStorageData != []){
      inputStored = getLocalStorageData();
      updateHomeScreen();
    }
})



//SETUP END**

// <!----------------------------------------!>

//**EVENT LISTENERS
newBtn.addEventListener('click', () =>{
  openTextPage();
  clearTextArea();
  setBackToDefault();

});
backBtn.addEventListener('click',()=>{
backBtnMobile();
clearTextArea();
})
saveBtn.addEventListener('click',()=>{
  saveInput();
  clearTextArea();
  updateHomeScreen();
  backBtnMobile();
  setBackToDefault();
}); 
deleteBtn.addEventListener('click',()=>{
  clearTextArea();
  removeInput();
  updateHomeScreen();
  removeChild(clickedOnId);
  backBtnMobile();
  setBackToDefault();
});
//EVENT LISTENERS END**

// <!----------------------------------------!>

//**FUNCTION
//checkScreenSize
function checkScreenSize(){
    if (smallDevice.matches) {
        rightPart.classList.add('hiddenRightPart');
    }
}
//Mobile Page Change
function openTextPage(){
  if(smallDevice.matches){
    leftPart.classList.add('hiddenLeftPart');
    rightPart.classList.remove('hiddenRightPart');
  }
}
function backBtnMobile(){
  if(smallDevice.matches){
    rightPart.classList.add('hiddenRightPart');
    leftPart.classList.remove('hiddenLeftPart');
  }
}
//date
function getCurrentDate(){
  const currentDate = new Date().getDate();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const madeOn = month[currentMonth] + ' ' + currentDate + ',' + currentYear;
  return madeOn;
}
//Save input
function saveInput(){
  if(editFlag){
    const editElement = document.querySelector(`[data-id='${clickedOnId}']`);
    for(e in inputStored){
      if(clickedOnId === inputStored[e].id){
        inputStored[e].title = titleRight.value;
        inputStored[e].content = contentRight.value;
        inputStored[e].date = getCurrentDate();
        editElementFunc(editElement);
        editLocalStorage(clickedOnId,inputStored[e].title,inputStored[e].content,inputStored[e].date );
      }
    }
  }else{
    tempTitle = titleRight.value;
    tempContent = contentRight.value;
    const id = new Date().getTime().toString();
    tempDate = getCurrentDate();
    inputStored.push({
      id : id,
      title : tempTitle,
      date : tempDate,
      content : tempContent
    });
    addToLocalStorage();
  }
}
//remove input
function removeInput(){
  inputStored = inputStored.filter(function removeFromArray(item){
    if(item.id !== clickedOnId){
      return item;
    }
  })
  idDisplay = idDisplay.filter((item)=>{
    if(item !== clickedOnId){
      return item
    }
  })
  removeFromLocalStorage(clickedOnId);
}
//default
function setBackToDefault(){
  tempContent = '';
  tempTitle = '';
  tempDate = '';
  clickedOnId = '';
  editFlag = false;
  titleRight.textContent = '';
  contentRight.textContent = '';
}
function clearTextArea(){
  titleRight.value = '';
  contentRight.value = '';
  dateRight.textContent = getCurrentDate();
}
//home screen view
function updateHomeScreen(){
for(let i = 0;i<inputStored.length;i++){
  if(idDisplay[i] === inputStored[i].id){//skip doubles
    console.log('skip');
}else{
  const element = document.createElement('div');
  leftWrapper.appendChild(element);
  element.classList.add('notesBox');
  const attr = document.createAttribute('data-id');
  attr.value = inputStored[i].id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="notesTitle">${inputStored[i].title}</p>
  <p class="creationDate">${inputStored[i].date}</p>`;
  idDisplay.push(inputStored[i].id);
}
//grab after they are visible
const notesBox = document.querySelectorAll('.notesBox');
//set bg color
notesBox.forEach(element => {
  let color = getRandomColor();
  element.style.backgroundColor = color;
});
//make home screen texts clickable
const notesTitle = document.querySelectorAll('.notesTitle');
let flag = false;
notesBox.forEach(element => {
  element.addEventListener('click',()=>{
    editFlag = true;
    if(!flag){
      openTextPage();
      clickedOnId = element.dataset.id;
      for(e in inputStored){
        if(clickedOnId === inputStored[e].id){
          titleRight.value = inputStored[e].title;
          contentRight.value = inputStored[e].content;
        }
      }
      flag = true;
      setTimeout(function(){ flag = false; }, 500);
    }
  });
});
}
}
//remove from screen 
function removeChild(dataID) {
  const child = document.querySelector(`[data-id='${dataID}']`);
  if(child) child.remove();
};
// update home screen text 
function editElementFunc(elem){
  elem.innerHTML = `<p class="notesTitle">${inputStored[e].title}</p>
  <p class="creationDate">${inputStored[e].date}</p>`;
}
// get color
const getRandomColor = () =>{
  let index = Math.floor(Math.random() * (7 - 0 + 1)) + 0;

  return colorList[index];
}


//FUNCTIONS ENDS**

// <!----------------------------------------!>

//**LOCAL STORAGE
function addToLocalStorage(){
  let items = getLocalStorageData();
  items = inputStored;
  localStorage.setItem('storedData',JSON.stringify(items));
}
function getLocalStorageData(){
  return localStorage.getItem("storedData")
  ?JSON.parse(localStorage.getItem("storedData"))
  :[];
}
function removeFromLocalStorage(id){
  let items = getLocalStorageData();
    items = items.filter(function(item){
      if(item.id !== id){
        return item
      }
    });
    if (items.length === 0){
      localStorage.clear();
    }else{
      localStorage.setItem("storedData",JSON.stringify(items));
    }
}
function editLocalStorage(id,ttl,cnt,dt) {
  let items = getLocalStorageData();
  items = items.map(function (item) {
    if (item.id === id) {
      item.title = ttl;
      item.content = cnt;
      item.date = dt;
    }
    return item;
  });
  localStorage.setItem("storedData", JSON.stringify(items));
}


//LOCAL STORAGE ENDS**

// <!----------------------------------------!>
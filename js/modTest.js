const $input = document.querySelector("input");
const $result = document.querySelector(".result");
const $button = document.querySelector("button");
const $autocomplete = document.querySelector(".autocomplete");
let listNum = 1;
let hlIndex = 0;
let stationName = "";
let stationCode = "";
let stationLine = "";
let transLine = "";
let bool = false;

const $stationList = stationList.data.sort((a, b) => {
  return a.station_nm < b.station_nm ? -1 : a.station_nm > b.station_nm ? 0 : 1;
});

$button.setAttribute("type", "button");

$input.addEventListener("input", (e) => Enter(e));
$input.addEventListener("keydown", (e) => {e.keyCode === 13 ? Serch() : e.keyCode === 40 ? Highlight() : ""});

const Enter = (e) => {
  Reset($autocomplete);
  let value = e.target.value;
  $stationList.forEach(e => {
    if(e.station_nm.includes(value) && value != "" && listNum < 10){
      const createList = document.createElement("li");
      createList.innerHTML = `<span>${e.station_nm.replace(value, `<span style="color: blue">${value}</span>`)}</span>역, <span>${e.line_num}호선</span>`
      createList.setAttribute("data-stationname", `${e.station_nm}`);
      createList.setAttribute("data-stationcode", `${e.station_cd}`);
      createList.setAttribute("data-linenum", `${e.line_num}`);
      $autocomplete.appendChild(createList);
      listNum++;
    } 
  });
  listNum = 1;
}

const Reset = (par) => {
  while(par.firstChild){
    par.firstChild.remove();
  }
}

const Highlight = () => {
  let $lis = document.querySelectorAll("li");
  let lastIndex = $lis.length;
  if(lastIndex === 0) return;
  $lis.forEach(e => {
    e.classList.remove("hl-key");
  });
  $lis[hlIndex].classList.add("hl-key");
  $lis.forEach(e => {
    if(e.classList.contains("hl-key")) $input.value = e.firstChild.textContent;
  });
  hlIndex === lastIndex-1 ? hlIndex = 0 : hlIndex++;
}

const Serch = () => {
  Reset($result);
  let $lis = document.querySelectorAll("li");
  $lis.forEach(e => {
    if(e.classList.contains("hl-key")){
      stationName = e.dataset.stationname;
      stationCode = e.dataset.stationcode;
      stationLine = String(e.dataset.linenum);
      bool = true;
    }
  });
  if(bool){
    $stationList.forEach(e => {
      if(e.station_nm == stationName) stationCode = e.station_cd;
    });
    timeList.data.forEach(e => {
      if(e.station_cd == stationCode && e.week_tag == "1" && e.inout_tag == "1"){
        const createP = document.createElement("p");
        createP.textContent = `${transform(stationLine)}호선, ${stationName}역의 첫차 시간은 ${e.first_time}이고, 막차시간은 ${e.last_time}입니다.`;
        $result.appendChild(createP);
      }
    })
  }else{
    $lis.forEach(list => {
      timeList.data.forEach(item => {
        if(item.station_cd == list.dataset.stationcode && item.week_tag == "1" && item.inout_tag == "1"){
          const createP = document.createElement("p");
          createP.textContent = `${transform(list.dataset.linenum)}호선, ${list.dataset.stationname}역의 첫차 시간은 ${item.first_time}이고, 막차시간은 ${item.last_time}입니다.`;
          $result.appendChild(createP);
        }
      })
    })
  }
  bool = false;
}

$button.addEventListener("click", () => Serch());

const transform = (e) => {
  console.log(e);
  switch(e){
    case "k": case "a":
      transLine = "공항철도";
      break;
    case "b":
      transLine = "분당선";
      break;
    case "g":
      transLine = "경춘선";
      break;
    case "s":
      transLine = "신분당선";
      break;
    case "su":
      transLine = "수인선";
      break;
    case "i":
      transLine = "인천 1호선";
      break;
    case "e":
      transLine = "용인경전철";
      break;
    case "u":
      transLine = "의정부경전철";
      break;
    default: transLine = e;
  }
  return transLine;
}
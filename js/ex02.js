const $input = document.querySelector("input");
const $btn = document.querySelector("button");
const $autocomplete = document.querySelector(".autocomplete>ul");
const $result = document.querySelector(".result");
let acIndex = 0;
let hlIndex = 0;
let bool = false;
let station_code = "";

const $stationList = stationList.data.sort((a, b) => {
    return a.station_nm < b.station_nm ? -1 : a.station_nm > b.station_nm ? 0 : 1;
});

$input.addEventListener("input", (e) => Enter(e));
$input.addEventListener("keydown", (e) => {e.keyCode === 40 ? Highlight() : e.keyCode === 13 ? Serch() : ""});
$btn.addEventListener("click", () => Serch());

const Enter = (e) => {
    Reset();
    let value = e.target.value;
    $stationList.forEach(e => {
        if(e.station_nm.includes(value) && value != "" && value != null && acIndex<9){
            const createList = document.createElement("li");
            createList.innerHTML = `<span>${e.station_nm.replace(value, `<span style="color: blue">${value}</span>`)}</span>역, <span>${e.line_num}</span>호선`;
            createList.setAttribute("data-code", `${e.station_cd}`);
            createList.setAttribute("data-name", `${e.station_nm}`);
            $autocomplete.appendChild(createList);
            acIndex++;
        }
    });
}

const Reset = () => {
    while($autocomplete.firstChild){
        $autocomplete.firstChild.remove();
    }
    acIndex = 0;
}

const Reset2 = () => {
    while($result.firstChild) $result.firstChild.remove();
}

const Highlight = () => {
    let $list = document.querySelectorAll("li");
    let length = $list.length;
    $list.forEach(e => {
        e.classList.remove("hl-key");
    });
    if(length>0){
        if(hlIndex == length) hlIndex = 0;
        $list[hlIndex].classList.add("hl-key");
        $input.value = $list[hlIndex].firstChild.textContent;
        hlIndex++;
    }
}

const Serch = () => {
    Reset2();
    let $list = document.querySelectorAll("li");
    $list.forEach(e => {
        if(e.classList.contains("hl-key")){
            bool = true;
            station_code = e.dataset.code;
        }
    });
    
    if(bool){
        timeList.data.forEach(e => {
            if(e.station_cd == station_code && e.week_tag == "1" && e.inout_tag == "1"){
                const createResult = document.createElement("p");
                createResult.textContent = `${e.line_num}호선, ${$input.value}역의 첫차는 ${e.first_time}이고 막차는 ${e.last_time}입니다.`
                Reset2();
                $result.appendChild(createResult);
            }
        });
    }else if($autocomplete.firstChild){
        $list.forEach(list => {
            timeList.data.forEach(e => {
                if(e.station_cd == list.dataset.code && e.week_tag == "1" && e.inout_tag == "1"){
                    const createResult = document.createElement("p");
                    createResult.textContent = `${e.line_num}호선, ${list.dataset.name}역의 첫차는 ${e.first_time}이고 막차는 ${e.last_time}입니다.`
                    $result.appendChild(createResult);
                }
            });
        });
    }
    bool = false;
    station_code = "";
}
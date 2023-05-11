const $input = document.querySelector("input");
const $serch = document.querySelector("button");
const $autocomplete = document.querySelector(".autocomplete>ul");
const $result = document.querySelector(".result");
const $form = document.querySelector("form");
let $li_index = 0;
let $highlight = -1;
let stationName = "";
let stationLine = "";

const stationArr = stationList.data.sort((a, b) => {
    return a.station_nm < b.station_nm ? -1 : a.station_nm > b.station_nm ? 1 : 0;
    // if(a < b){
    //     return -1;
    // }else{
    //     if(a > b){
    //         return 1;
    //     }else{
    //         return 0;
    //     }
    // }
});

$input.addEventListener('input', (e) => Enter(e));
$form.addEventListener("submit", () => {
    let value = $input.value;
    if(value == null || value == "") alert("값을 입력해주세요.");
    Fetch(value);
});
$input.addEventListener('keydown', (e) => {
    let $lis = document.querySelectorAll("li");
    if(e.keyCode == 40 && $autocomplete.firstChild && $highlight<$lis.length){
        let $lis = document.querySelectorAll("li");
        $lis.forEach(e => {
            e.classList.remove("hl-key");
        });
        $highlight++;
        if($highlight == $lis.length) $highlight = 0;
        $lis[$highlight].classList.add("hl-key");
        $input.value = $lis[$highlight].innerText;
    }
});
const Enter = (e) => {
    Delete();
    $highlight = -1;
    let value = $input.value;
    if(value == null || value == "") return;
    stationArr.forEach(e => {
        if(e.station_nm.includes(`${value}`) && $li_index<=8){
            const create = document.createElement('li');
            create.innerHTML = `<span>${e.station_nm.replace(`${value}`, `<span style="color: blue">${value}</span>`)}</span>역, <span>${e.line_num}</span>호선`;
            $autocomplete.appendChild(create);
            $li_index++;
        }
    });
    $li_index = 0;
}
const Delete = () => {
    while($autocomplete.firstChild){
        $autocomplete.removeChild($autocomplete.firstChild);
    }
}
const Fetch = (value) => {
    let $lis = document.querySelectorAll("li");
    let bool = false;
    let $start_time = "";
    let $last_time = "";
    $lis.forEach(e => {
        console.log(e.firstChild.textContent)
        if(e.classList.contains("hl-key")){
            stationName = e.firstChild.textContent;
            stationLine = e.childNodes[2].innerText;
            bool = true;
        }else if($autocomplete.firstChild){
            stationArr.forEach(item => {
                if(e.firstChild.innerText == item.station_nm && e.childNodes[2].innerText == item.line_num){
                    timeList.data.forEach(t => {
                        if(t.station_cd == item.station_cd){
                            $start_time = t.first_time;  
                            $last_time = t.last_time;
                        } 
                    });
                    $result.innerHTML += `${item.line_num}호선, ${item.station_nm}역입니다. 첫차는 ${$start_time}에 출발하고 막차는 ${$last_time}에 출발합니다.<br/>`;
                }
            });
        }
    });
    stationArr.forEach(e => {
        if(stationName != "" && stationLine != "" && bool){
            if(stationName === e.station_nm){
                if(stationLine == e.line_num){
                    timeList.data.forEach(t => {
                        if(t.station_cd == e.station_cd){
                            $start_time = t.first_time;
                            $last_time = t.last_time;
                        }
                    });
                    $result.innerHTML = `${e.line_num}호선, ${e .station_nm}역입니다. 첫차는 ${$start_time}에 출발하고 막차는 ${$last_time}에 출발합니다<br/>.`;
                }
            }
        }
    })
    $input.value = null;
    stationName = "";
    stationLine = "";
    Delete();
}
const Time = (code) => {
    timeList.data.forEach(e => {
        if(e.station_cd == code && e.week_tag == "1"){
            console.log(e.first_time);
            console.log(e.last_time);
        }
    });
}
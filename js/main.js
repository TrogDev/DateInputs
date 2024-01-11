Date.prototype.getNormilizedDay = function () {
    let day = this.getDay();
    if (day == 0) day = 7;
    return day;
}

let savedFromDate = [null, null, null];
let savedToDate = [new Date().getFullYear(), new Date().getMonth(), new Date().getDate()]

let fromDate = [...savedFromDate];
let toDate = [...savedToDate];

function redrawByNewDate() {
    drawInputs();
    drawYear(document.getElementById("year-select-label-from"), fromDate);
    drawYear(document.getElementById("year-select-label-to"), toDate);
    drawMonth(document.querySelector("#from .month-select-text"), fromDate);
    drawMonth(document.querySelector("#to .month-select-text"), toDate);
    drawButtons();
    if (fromDate[0] != null && fromDate[1] != null) {
        drawCalendar(document.getElementById("fromDate-calendar"), fromDate);
    }
    else {
        document.getElementById("fromDate-calendar").innerHTML = "";
    }
    if (toDate[0] != null && toDate[1] != null) {
        drawCalendar(document.getElementById("toDate-calendar"), toDate);
    }
    else {
        document.getElementById("toDate-calendar").innerHTML = "";
    }
}

function drawInputs() {
    drawInput(document.getElementById("date-from"), fromDate);
    drawInput(document.getElementById("date-to"), toDate);
}

function drawInput(parentElem, date) {
    day = date[2];
    month = date[1];
    if (month != null) {
        month++;
    }

    parentElem.querySelector(".day").value = day >= 10 ? day : "0" + day;
    parentElem.querySelector(".month").value = month >= 10 ? month : "0" + month;
    parentElem.querySelector(".year").value = date[0];

    if (!!day) {
        parentElem.querySelector(".date-by-text").innerText = new Date(...date).toLocaleString("ru-RU", { year: "numeric", month: "long", day: "numeric" }).replace("г.", "");
    }
    if (!day && !month && !date[0]) {
        parentElem.querySelector(".close").style.display = "none";
    }
    else {
        parentElem.querySelector(".close").style.display = "flex";
    }
}

function drawYear(parentElem, date) {
    if (!!date[0]) {
        parentElem.innerText = date[0];
    }
    else {
        parentElem.innerText = "Выберите год";
    }
}

function drawMonth(parentElem, date) {
    if (!!date[1] || date[1] == "0") {
        parentElem.innerText = new Date(null, date[1]).toLocaleString("ru-RU", {month: "long"});
    }
    else {
        parentElem.innerText = "Выберите месяц";
    }
}

function drawSelectYears() {
    for (let el of document.getElementsByClassName("year-select-active")) {
        el.querySelector(".year-cards").innerHTML = "";

        for (let year = new Date().getFullYear(); year >= 1996; year--) {
            if (!`${year}`.startsWith(el.querySelector(".year-select-input").value)) {
                continue;
            }

            let card = document.createElement("div");
            card.innerText = year;
            card.className = "year-card";
            card.onclick = (e) => {
                disactiveYearSelect(e.target.closest(".year-select"));
                if (e.target.closest("#from") != null) {
                    fromDate[0] = e.target.innerText;
                }
                else {
                    toDate[0] = e.target.innerText;
                }
                redrawByNewDate();
            }
            el.querySelector(".year-cards").appendChild(card);
        }
    }
}

function drawButtons() {
    if (isChanged()) {
        document.querySelector(".accept-button").classList.add("active");
    }
    else {
        document.querySelector(".accept-button").classList.remove("active");
    }
}

function active(event) {
    if (!!event) {
        event.target.closest("section").classList.add("current");
    }

    if (document.querySelector("section").classList.contains("active")) {
        return;
    }
    for (let el of document.getElementsByTagName("section")) {
        el.classList.remove("filled");
        el.classList.remove("not-filled");
        el.classList.add("active");
        toDate = [...savedToDate];
        fromDate = [...savedFromDate]
    }
    document.querySelector(".footer").classList.add("active");
    document.querySelector(".footer-desktop").classList.add("active");
    document.querySelector(".error-wrapper").classList.remove("active");
    document.querySelector("main").classList.remove("full-filled");
}

function disactive(isSave) {
    if (isSave) {
        savedFromDate = [...fromDate];
        savedToDate = [...toDate];
    }
    else {
        fromDate = [...savedFromDate];
        toDate = [...savedToDate];
    }
    if (!savedFromDate.some(e => e === null) && !savedToDate.some(e => e === null)) {
        document.querySelector("main").classList.add("full-filled")
    }

    for (let el of document.getElementsByTagName("section")) {
        el.classList.remove("active");
        el.classList.remove("current");

        if (el.id == "from") {
            if (!savedFromDate.some(e => e === null)) {
                el.classList.add("filled");
            }
            else {
                el.classList.add("not-filled");
            }
        }
        if (el.id == "to") {
            if (!savedToDate.some(e => e === null)) {
                el.classList.add("filled");
            }
            else {
                el.classList.add("not-filled");
            }
        }
    }

    document.querySelector(".footer").classList.remove("active");
    document.querySelector(".footer-desktop").classList.remove("active");
    redrawByNewDate();
    validateDates();
}

function drawCalendar(parentElem, date) {
    parentElem.innerHTML = "";
    let table = document.createElement("table");

    let head = document.createElement("tr");
    ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].forEach(e => {
        let headElement = document.createElement("th");
        headElement.innerText = e;
        head.appendChild(headElement);
    })
    table.appendChild(head);

    let tempDate = new Date(date[0], date[1]);
    let tempMonth = tempDate.getMonth();
    let row = document.createElement("tr");

    for (let i = 1; i < tempDate.getNormilizedDay(); i++) {
        let voidDay = document.createElement("td");
        voidDay.className = "void-day";
        row.appendChild(voidDay);
    }

    while (tempDate.getMonth() == tempMonth) {
        let day = document.createElement("td");
        day.innerText = tempDate.getDate();
        day.dataset.date = tempDate;

        day.onclick = (event) => {
            let dayDate = new Date(event.target.dataset.date);
            date[2] = dayDate.getDate();
            date[1] = dayDate.getMonth();
            date[0] = dayDate.getFullYear();
            redrawByNewDate();
        }

        if (!fromDate.some(e => e == null) && !toDate.some(e => e == null)) {
            if (tempDate > new Date(...fromDate) && tempDate < new Date(...toDate)) {
                day.className = "between-day"
            }
        }

        if (tempDate.getTime() == new Date(...toDate).getTime() || tempDate.getTime() == new Date(...fromDate).getTime()) {
            day.className = "active-day";
        }

        row.appendChild(day);

        if (tempDate.getNormilizedDay() == 7) {
            table.appendChild(row);
            row = document.createElement("tr");
        }
        tempDate.setDate(tempDate.getDate() + 1);
    }

    if (tempDate.getNormilizedDay() != 1) {
        table.appendChild(row);
        for (let i = tempDate.getNormilizedDay(); i <= 7; i++) {
            let voidDay = document.createElement("td");
            voidDay.className = "void-day";
            row.appendChild(voidDay);
        }
    }

    parentElem.appendChild(table);
}

function clearDate(name) {
    active();
    switch (name) {
        case "from":
            fromDate = [null, null, null];
            break;
        case "to":
            toDate = [null, null, null];
            break;
    }
    redrawByNewDate();
}

function activeYearSelect(event) {
    event.target.parentElement.parentElement.classList.add("active");
    event.target.closest("section").classList.add("year-select-activated");
    drawSelectYears();
}

function disactiveYearSelect(el) {
    el.classList.remove("active");
    el.closest("section").classList.remove("year-select-activated");
}

function changeYear(name, value) {
    switch (name) {
        case "from":
            if (fromDate[0] == null) {
                fromDate[0] = 1996;
                break;
            }
            fromDate[0] = Number(fromDate[0]) + Number(value);
            if (fromDate[0] > new Date().getFullYear()) {
                fromDate[0]--;
            }
            break;
        case "to":
            if (toDate[0] == null) {
                toDate[0] = 1996;
                break;
            }
            toDate[0] = Number(toDate[0]) + Number(value);
            if (toDate[0] > new Date().getFullYear()) {
                toDate[0]--;
            }
            break;
    }
    redrawByNewDate();
}

function toggleMonthSelect(event) {
    event.target.closest(".month-select").classList.toggle("active");
}

function disactiveMonthSelect(el) {
    el.classList.remove("active");
}

function setMonth(name, value) {
    switch (name) {
        case "from":
            fromDate[1] = Number(value);
            fromDate[2] = null;
            if (fromDate[1] > 11) {
                fromDate[1] = 11;
            }
            if (fromDate[1] < 0) {
                fromDate[1] = 0;
            }
            disactiveMonthSelect(document.querySelector("#from .month-select"));
            break;
        case "to":
            toDate[1] = Number(value);
            toDate[2] = null;
            if (toDate[1] > 11) {
                toDate[1] = 11;
            }
            if (toDate[1] < 0) {
                toDate[1] = 0;
            }
            disactiveMonthSelect(document.querySelector("#to .month-select"));
            break;
    }
    redrawByNewDate();
}

function onInputYear(event) {
    if (event.target.value == "") {
        event.target.value = null;
    }
    else if (event.target.value > new Date().getFullYear()) {
        event.target.value = new Date().getFullYear();
    }
    else if (event.target.value <= 0) {
        event.target.value = 1;
    }

    if (event.target.closest("#to") != null) {
        toDate[0] = event.target.value;
    }
    else {
        fromDate[0] = event.target.value;
    }

    redrawByNewDate();
}

function onInputMonth(event) {
    if (event.target.value == "0" || event.target.value == "00" || event.target.value == "") {
        event.target.value = null;
    }
    else if (event.target.value > 12) {
        event.target.value = 12;
    }
    else if (event.target.value < 1) {
        event.target.value = 1;
    }

    if (event.target.closest("#to") != null) {
        toDate[1] = event.target.value <= 0 ? null : event.target.value - 1;
    }
    else {
        fromDate[1] = event.target.value <= 0 ? null : event.target.value - 1;
    }

    validateDaysCount();
    redrawByNewDate();
}

function onInputDay(event) {
    if (event.target.value == "0" || event.target.value == "00" || event.target.value == "") {
        event.target.value = null;
    }
    else if (event.target.value > 31) {
        event.target.value = 31;
    }
    else if (event.target.value < 1) {
        event.target.value = 1;
    }

    if (event.target.closest("#to") != null) {
        toDate[2] = event.target.value <= 0 ? null : Number(event.target.value);
    }
    else {
        fromDate[2] = event.target.value <= 0 ? null : Number(event.target.value);
    }

    validateDaysCount();
    redrawByNewDate();
}

function validateDaysCount() {
    let maxFromDateDays = new Date(fromDate[0], fromDate[1] + 1, 0).getDate();
    if (fromDate[2] > maxFromDateDays) {
        fromDate[2] = maxFromDateDays;
    }
    let maxToDateDays = new Date(toDate[0], toDate[1] + 1, 0).getDate();
    if (toDate[2] > maxToDateDays) {
        toDate[2] = maxToDateDays;
    }
}

function isChanged() {
    return savedFromDate[0] != fromDate[0] | savedFromDate[1] != fromDate[1] | savedFromDate[2] != fromDate[2] | savedToDate[0] != toDate[0] | savedToDate[1] != toDate[1] | savedToDate[2] != toDate[2];
}

function validateDates() {
    if (new Date(...savedToDate) > new Date()) {
        document.querySelector(".error-wrapper").classList.add("active");
        document.querySelector(".error-text").innerText = "Выберите дату не позднее сегодняшнего дня";
    }
    else if (new Date(...savedFromDate) > new Date(...savedToDate)) {
        document.querySelector(".error-wrapper").classList.add("active");
        document.querySelector(".error-text").innerText = "Дата начала периода превышает дату окончания";
    }
    else {
        document.querySelector(".error-wrapper").classList.remove("active");
    }
}

disactive(false);

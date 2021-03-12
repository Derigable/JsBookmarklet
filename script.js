javascript:void((function () {
    let change = [];

    /* Получаем текущую дату в формате dd/mm/yyyy */
    let date = new Date();
    let currentDate = date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    let promise = new Promise(function(resolve) {
        let xmlhttp = new XMLHttpRequest();
        /* В документации https://www.cbr.ru/development/SXML/ есть только пример получения динамики кодировок драгоценных металлов, пришлось вычислять текущую дату и подставлять ее в ссылку */
        xmlhttp.open("GET", `https://www.cbr.ru/scripts/xml_metall.asp?date_req1=${currentDate}&date_req2=${currentDate}`, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let xmlDoc = this.responseXML;
                /* Получаем курс золота */
                change.AuChange = parseFloat(xmlDoc.querySelector('Record[Code="1"]').querySelector('Buy').innerHTML.replace(/,/, '.'));
                resolve();
            }
        };
    });

    /* Получаем курс доллара */
    change.UsdChange = parseFloat(document.querySelector('._dollar').nextElementSibling.nextElementSibling.innerHTML.replace(/,/, '.'));

    promise.then(
        result => {
            /* Высчитываем курс золота к доллару */
            let UsdForAu = +(change.AuChange / change.UsdChange).toFixed(2);
            alert(`Стоимость килограмма золота равна ${UsdForAu} USD`)
        }
    );      
})());
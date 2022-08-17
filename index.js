let dropdown1 = document.querySelector('.dropdown1');
const opt1 = document.getElementById("opt1");
let dropdown2 = document.querySelector('.dropdown2');
const opt2 = document.getElementById("opt2");
const marka = document.getElementById("marka");
const model = document.getElementById("model");
const min = document.getElementById("price-min");
const max = document.getElementById("price-max");
const btn = document.getElementById("btn");
const models = document.querySelectorAll(".models")
const array1 = Array.from(models);
const ajax = new XMLHttpRequest();
let arr = [];
let modelarr = [];
let kod = "";
let num = document.querySelector(".num");
let slct = document.getElementById('slct');
let reset = document.getElementById("reset");
model.setAttribute("disabled", "disabled");

ajax.open("GET", "content/index1.json");
ajax.send();
ajax.onload = () => {

    let json = JSON.parse(ajax.responseText);
    // input1 üçün 
    dropdown1.onclick = function() {
        dropdown1.classList.toggle('active');
    }
    for (let i = 0; i < json.brands.length; i++) {
        opt1.innerHTML += `<div class="brands" id="${i}">${json.brands[i]}</div>`;
        modelarr = []
    };

    // input2 üçün
    dropdown2.onclick = function() {
        if (model.disabled == false) {
            dropdown2.classList.toggle('active');
            // console.log(json.brands.indexOf(marka.value));
        }
    }
    for (let i = 0; i < json.brands.length; i++) {
        document.querySelectorAll('.brands')[i].onclick = function() {
            let x = document.querySelectorAll('.brands')[i].innerHTML;
            marka.value = x
            model.disabled = false
            document.styleSheets[1].cssRules[54].style.display = 'inherit'
            opt2.innerHTML = ""

            for (let j = 0; j < json.car[i].model.length; j++) {
                if (x === json.brands[i] && modelarr.includes(json.car[i].model[j].name) == false) {
                    let d = j
                    opt2.innerHTML += `<div class="models"  id="c${d = d>= 2 ? d-1 : 0}">${json.car[i].model[j].name}</div>`;
                    modelarr.push(json.car[i].model[j].name);
                    model.addEventListener("click", () => {
                        for (let r = 0; r < opt2.childElementCount; r++) {
                            console.log(model.value);
                            document.querySelectorAll(".models")[r].addEventListener("click", () => {
                                let p = document.querySelectorAll(".models")[r].innerHTML
                                model.value = p
                            })
                        }
                    })
                }
            }
        }
    };
    // for (let k = 0; k < json.brands.length; k++)

    //show funksiyası
    function exchange() {
        for (let i = 0; i < json.brands.length; i++) {
            for (let j = 0; j < json.car[i].model.length; j++) {
                if (json.car[i].model[j].currency == '$') {
                    json.car[i].model[j].price *= 1.7
                    json.car[i].model[j].currency = 'AZN'
                } else if (json.car[i].model[j].currency == '€') {
                    json.car[i].model[j].price *= 1.78
                    json.car[i].model[j].currency = 'AZN'
                }
            }
        }
    }

    function show() {
        for (let i = 0; i < json.brands.length; i++) {
            for (let j = 0; j < json.car[i].model.length; j++) {
                arr.push(json.car[i].model[j].price);
                arr.sort(function(a, b) {
                    return a - b;
                });
            }
        }
        num.innerHTML = json.say;
        for (let i = 0; i < json.car.length; i++) {
            for (let j = 0; j < json.car[i].model.length; j++) {
                let order = 0
                order = order = arr.indexOf(json.car[i].model[j].price)
                kod += `<div class="card" style='order:${order}' >`;
                kod += `<img src="${json.car[i].model[j].image}"  class="card-img-top" alt="...">`;
                kod += `<div class="card-body">`;
                kod += `<p class="card-text val">${json.car[i].model[j].price +' '+ json.car[i].model[j].currency}</p>`;
                kod += `<p class="card-text">${json.car[i].model[j].brand + " " + json.car[i].model[j].name}</p>`;
                kod += `<p class="card-text">${json.car[i].model[j].year + ", " + json.car[i].model[j].distance + " " + json.car[i].model[j].metr}</p>`;
                kod += ` </div>`;
                kod += ` </div>`;
            }
        }
        document.querySelector(".d-flex").innerHTML = kod;
    }
    show();
    btn.onclick = function() {
        exchange()
        kod = "";
        for (let i = 0; i < json.brands.length; i++) {
            for (let j = 0; j < json.car[json.brands.indexOf(marka.value)].model.length - 1; j++) {
                console.log(model.value);
                console.log(marka.value);
                // console.log(json.car[json.brands.indexOf(marka.value)].model.length );
                // if(t == json.car[json.brands.indexOf(marka.value)].model.length-1) {t= t-1} 
                // else {t = t}
                // console.log(t);
                // console.log(json.car[1].model);
                // arr.push(json.car[json.brands.indexOf(marka.value)].model[j].price);
                arr.sort(function(a, b) {
                        return a - b;
                    })
                    // for (let a = 0; a < opt2.childElementCount; a++) {
                if (
                    (
                        //marka dolu, model dolu
                        (marka.value === json.brands[i] && model.value === json.car[i].model[j].name) ||

                        //marka dolu,model dolu, 2qiymet dolu
                        ((marka.value === json.brands[i] && model.value === json.car[i].model[j].name) &&
                            (json.car[i].model[j].price >= min.value && json.car[i].model[j].price <= max.value) && (slct.value === json.car[i].model[j].currency))
                    ) ||

                    (
                        //marka dolu,model bos,2qiymet dolu
                        (marka.value === json.brands[i] && model.value == "") &&
                        (json.car[i].model[j].price >= min.value && json.car[i].model[j].price <= max.value) && (slct.value === json.car[i].model[j].currency)
                    ) ||

                    //marka bos,model bos: 2qiymet dolu ve ya 1qiymet dolu, 1qiymet bos
                    (
                        (marka.value === "" && model.value == "") &&
                        ((json.car[i].model[j].price >= min.value && json.car[i].model[j].price <= max.value) && (slct.value === json.car[i].model[j].currency) ||
                            (min.value == '' && json.car[i].model[j].price <= max.value && (slct.value === json.car[i].model[j].currency)) ||
                            (json.car[i].model[j].price >= min.value && max.value == ''))
                    ) ||

                    //marka dolu,model bos: 2qiymet bos ve ya max bos,min dolu
                    ((marka.value === json.brands[i] && model.value == "" && (slct.value === json.car[i].model[j].currency) &&
                        ((min.value == "" && max.value == "") ||
                            ((json.car[i].model[j].price >= min.value) && (max.value == "")) || ((min.value == "") && (json.car[i].model[j].price <= max.value)))
                    )) ||

                    //marka dolu,model dolu, 1qiymet bos, 1qiymet dolu
                    (
                        (marka.value === json.brands[i] && model.value === json.car[i].model[j].name) &&
                        (json.car[i].model[j].price >= min.value && json.car[i].model[j].price != max.value) && (slct.value === json.car[i].model[j].currency)
                    )
                ) {
                    // console.log(json.car[i].model[j].name);
                    exchange()
                    let order = 0
                    order = arr.indexOf(json.car[i].model[j].price)
                    kod += `<div class="card" style="order:${order}">`;
                    kod += `<img src="${json.car[json.brands.indexOf(marka.value)].model[j].image}"  class="card-img-top" alt="...">`;
                    kod += `<div class="card-body">`;
                    kod += `<p class="card-text val">${json.car[json.brands.indexOf(marka.value)].model[j].price + ' ' + json.car[json.brands.indexOf(marka.value)].model[j].currency}</p>`;
                    kod += `<p class="card-text">${json.car[i].model[j].brand + " " + json.car[i].model[j].name}</p>`;
                    kod += `<p class="card-text">${json.car[json.brands.indexOf(marka.value)].model[j].year +", " + json.car[json.brands.indexOf(marka.value)].model[j].distance + " " + json.car[json.brands.indexOf(marka.value)].model[j].metr}</p>`;
                    kod += ` </div>`;
                    kod += ` </div>`;
                }
                // }
            }
            document.querySelector(".d-flex").innerHTML = kod;
        }
    };
};
reset.onclick = function() {
    marka.value = "";
    model.value = "";
    model.disabled = true;
    document.styleSheets[1].cssRules[54].style.display = 'none'
    min.value = ""
    max.value = ""
};
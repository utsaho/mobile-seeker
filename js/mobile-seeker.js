const displaySetting = (elementId, displayStyle) => {
    document.getElementById(elementId).style.display = displayStyle;
}

const emptyElement = elementId => {
    document.getElementById(elementId).textContent = '';
}
let searchText;
document.getElementById('search-button').addEventListener('click', function () {
    displaySetting('phone-details', 'none');
    displaySetting('results', 'none');
    emptyElement('results'); emptyElement('phone-details');
    const inputText = document.getElementById('searchText').value.toLocaleLowerCase();
    searchText = inputText;
    document.getElementById('searchText').value = '';
    loadData(searchText);
});
const loadData = (searchText, again = false) => {
    try {
        const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`
        fetch(url).then(res => res.json()).then(data => again ? fetchedData(data.data, true) : fetchedData(data.data));
    }
    catch (e) {
        console.log('data not found')
    }
}
const fetchedData = (phones, isMoreThen20 = false) => {
    let restPhones;
    if (phones.length > 0) {
        let moreThen20 = false;
        if (phones.length > 20 && !isMoreThen20) {
            moreThen20 = true;
            // console.log('before slice main: ', phones.length);
            restPhones = Array.prototype.slice.call(phones, phones.length - 20);
            // console.log('sub slice: ', restPhones.length);
            // console.log('old slice: ', phones.length);
        }
        else {
            restPhones = phones;
        }
        // console.log(phones.length);
        // phone.length = 15;
        const parentElement = document.getElementById('results');
        restPhones.forEach(phone => {
            // console.log(phone);
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
        <div class="card rounded-4 shadow">
        <div class="d-flex justify-content-center">
                <img src="${phone.image}" class="card-img-top w-50 mt-4" alt="'${searchText}'">
            </div>
            <div class="card-body d-flex justify-content-center">
                <div>
                    <h5 class="card-title">${phone.phone_name}</h5>
                    <p class="card-text">Brand: ${phone.brand}</p>
                </div>
                <div class="ms-3">
                    <a class="btn btn-primary" href="#phone-details" role="button" onclick="loadPhoneDetail('${phone.slug}')">Learn more</a>
                </div>
            </div>
        </div>`;
            parentElement.appendChild(div);
        });
        emptyElement('showMoreButton');
        if (moreThen20) {
            const div = document.createElement('div');
            div.classList.add('row', 'justify-content-center', 'd-flex');
            div.innerHTML = `
                <button class="btn btn-primary" onclick="fetchedDataAgain()">show more</button>
            `;
            document.getElementById('showMoreButton').appendChild(div);
        }
    }
    else {
        const parentElement = document.getElementById('results');
        const div = document.createElement('div');
        div.classList.add('d-flex', 'w-100', 'justify-content-center');
        div.innerHTML = `
            <div class="align-items-center" style="margin-top:10%">
            <i class="far fa-sad-tear"></i>
                <h1 class="fw-bold text-center text-align-center text-muted">data not found </h2>
                </div>
            `;
        parentElement.appendChild(div);
    }
}

const fetchedDataAgain = () => {
    loadData(searchText, true);
    // emptyElement('phone-details');
    // emptyElement('results');
    // fetchedData(restPhones, true);
    // if (string == 'yes') {
    //     console.log('hwlllo');
    // }
}

const loadPhoneDetail = detail => {
    const url = `https://openapi.programming-hero.com/api/phone/${detail}`;
    // console.log(url);
    fetch(url).then(res => res.json()).then(data => showDetails(data));
}

const showDetails = details => {
    // console.log(details);
    // console.log(details.data.name);
    const parentElement = document.getElementById('phone-details');
    const div = document.createElement('div');
    div.classList.add('row');
    div.classList.add('mt-5');
    div.innerHTML = `
            <div class="col-md-4">
                <img src="${details.data.image}" class="img-fluid rounded-start w-75" alt="${details.data.name}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${details.data.name}</h5>
                    <p class="card-text"><small class="text-muted">${details.data.releaseDate ? details.data.releaseDate : 'No relasedate found'}</small></p>
                    <p class="card-text">
                    <h6 class="fw-bold">Main Features</h6>
                    <ul> 
                        ${getMenuf(details.data)}
                    </ul>
                    <div class="d-flex">
                        <div>
                            <h6 class="fw-bold">Sensors:</h6>
                            <ul> 
                                ${getSensors(details.data.mainFeatures)}
                            </ul>
                        </div>
                        <div class="ms-3">
                            <h6 class="fw-bold">Others:</h6>
                            <ul> 
                                ${details.data.others ? getOthers(details.data) : 'not found'}
                            </ul>
                        </div>
                    </div>
                    </p>
                </div>
            </div>
    `;

    emptyElement('phone-details');
    parentElement.appendChild(div);
    displaySetting('phone-details', 'block');
}

const getOthers = details => {
    // console.log(details.others);
    let string = ``;
    string += `<ul class="list-group">`;
    for (const elementPart in details.others) {
        string += `<li class="list-group-item border-0 m-0 p-0 ms-3"> <span class = "fw-bold"> ${elementPart} :</span> ${details.others[elementPart]} </li>`;
    }
    string += `</ul>`
    return string;
}

const getSensors = subMenu => {
    let string = ``;
    string += `<ul class="list-group">`;
    for (const elementPart of subMenu.sensors) {
        string += `<li class="list-group-item border-0 m-0 p-0 ms-3"> <i class="fas fa-check bg-primary text-primary bg-opacity-25 rounded-circle fs-6 p-1"></i> ${elementPart} </li>`;
    }
    string += `</ul>`
    return string;
}

const getMenuf = (menu) => {
    let string = ``;
    const subMenu = menu.mainFeatures;
    // console.log(subMenu);
    // console.log(details.data.others);
    for (const element in subMenu) {
        //! for sensor array
        //  console.log(element.sensors? sensors : 'not Hello');
        if (element != 'sensors') {
            string += `<li> <span class = "fw-bold"> ${element} :</span> ${subMenu[element]} </li>`;
        }
    }
    // console.log(menu.sensors);
    return string;
}

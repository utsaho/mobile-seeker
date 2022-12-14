const displaySetting = (elementId, displayStyle) => {
    // change the visibility of the 'elementId' content
    document.getElementById(elementId).style.display = displayStyle;
}

const emptyElement = elementId => {
    // Empty the 'elementId' content
    document.getElementById(elementId).textContent = '';
}
let searchText;
document.getElementById('search-button').addEventListener('click', function () {
    // This function will work when search button clicked
    displaySetting('phone-details', 'none');
    displaySetting('results', 'none');
    displaySetting('spinner', 'block');
    emptyElement('results'); emptyElement('phone-details');
    const inputText = document.getElementById('searchText').value.toLocaleLowerCase();
    searchText = inputText;
    document.getElementById('searchText').value = '';   // After getting searchText, makeing the searchbox empty
    loadData(searchText);
});
const loadData = async (searchText, again = false) => {
    // This is the async funciton. Fetching the phones json
    try {
        const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
        const res = await fetch(url);
        const data = await res.json();
        again ? fetchedData(data.data, true) : fetchedData(data.data)
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
            restPhones = Array.prototype.slice.call(phones, phones.length - 20);
        }
        else {
            restPhones = phones;
        }
        const parentElement = document.getElementById('results');
        restPhones.forEach(phone => {
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
                    <p class="card-text"><span class="fw-bold">Brand: </span>${phone.brand}</p>
                </div>
                <div class="ms-3">
                    <a class="btn" href="#" id="learnMoreButton" role="button" onclick="loadPhoneDetail('${phone.slug}')">Learn more</a>
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
    displaySetting('spinner', 'none');
}

const fetchedDataAgain = () => {
    displaySetting('spinner', 'block');
    loadData(searchText, true);
}

const loadPhoneDetail = async detail => {
    const url = `https://openapi.programming-hero.com/api/phone/${detail}`;
    const res = await fetch(url);
    const data = await res.json();
    showDetails(data);
}

const showDetails = details => {
    displaySetting('spinner', 'block');
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
    displaySetting('spinner', 'none');
    parentElement.appendChild(div);
    displaySetting('phone-details', 'block');
}

const getOthers = details => {
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
    for (const element in subMenu) {
        //! for sensor array
        if (element != 'sensors') {
            string += `<li> <span class = "fw-bold"> ${element} :</span> ${subMenu[element]} </li>`;
        }
    }
    return string;
}

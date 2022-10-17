const filterBtn = document.querySelector('.btn-filter');
const nameFilter = document.querySelector('#name-search');
const sbjFilter = document.querySelector('#sbj-search');
const educationStartFilter = document.querySelector('#education-start-search');
const educationEndFilter = document.querySelector('#education-end-search');


const btn = document.querySelector('.btn-add');
const tableContainer = document.querySelector('.table')
const studentName = document.querySelector('#name');
const sbj = document.querySelector('#sbj');
const birthday = document.querySelector('#birthday');
const educationDate = document.querySelector('#education-date');

const errorName = document.querySelector('.validation-name');
const errorSbj = document.querySelector('.validation-sbj');
const errorBirth = document.querySelector('.validation-birthday');
const errorEducation = document.querySelector('.validation-education');


let students = [];

const filterStudents = () => {
    filterBtn.addEventListener('click', () => {

        parseNameData(nameFilter.value);
        parseFacultyData(sbjFilter.value);
        parseEducationData(educationStartFilter.value);
        parseEducationData(educationEndFilter.value);

        let filtered = students;

        if (nameFilter.value != undefined && nameFilter.value != '') {
            filtered = filtered.filter(row => row.cells[0].textContent.includes(nameFilter.value));
        }

        if (sbjFilter.value != undefined && sbjFilter.value != '') {
            filtered = filtered.filter(row => row.cells[1].textContent.includes(sbjFilter.value));
        }

        if (educationStartFilter.value != undefined && educationStartFilter.value != '') {
            filtered = filtered.filter(row => row.cells[3].textContent.split('-')[0] === educationStartFilter.value);
        }

        if (educationEndFilter.value != undefined && educationEndFilter.value != '') {
            filtered = filtered.filter(row => row.cells[3].textContent.split('-')[1].split(' ')[0] === educationEndFilter.value);
        }

        tableContainer.tBodies[0].remove();
        tableContainer.append(document.createElement('tbody'));
        tableContainer.tBodies[0].append(...filtered);

    })
};

function sortByName() {
    const nameSort = document.querySelector('.name-sort');

    nameSort.addEventListener('click', () => {
        students
            .sort((rowA, rowB) => rowA.cells[0].textContent > rowB.cells[0].textContent ? 1 : -1);

        tableContainer.tBodies[0].append(...students);
    })
};

function sortBySbj() {
    const sbjSort = document.querySelector('.sbj-sort');

    sbjSort.addEventListener('click', () => {
        students
            .sort((rowA, rowB) => rowA.cells[1].textContent > rowB.cells[1].textContent ? 1 : -1);

        tableContainer.tBodies[0].append(...students);
    })
};

function sortByBirth() {
    const birthSort = document.querySelector('.birth-sort');

    birthSort.addEventListener('click', () => {
        students
            .sort((rowA, rowB) => {
                let [dateA, ] = rowA.cells[2].textContent.split(' ');
                let [dateB, ] = rowB.cells[2].textContent.split(' ');

                dateA = dateA.split('.');
                dateB = dateB.split('.');

                return new Date(dateA[2], Number(dateA[1]) - 1, dateA[0]) > new Date(dateB[2], Number(dateB[1]) - 1, dateB[0]) ? 1 : -1;
            });

        tableContainer.tBodies[0].append(...students);
    })
};

function sortByEducation() {
    const educationSort = document.querySelector('.education-sort');

    educationSort.addEventListener('click', () => {
        students
            .sort((rowA, rowB) => {
                let [dateA, ] = rowA.cells[3].textContent.split('-');
                let [dateB, ] = rowB.cells[3].textContent.split('-');

                return Number(dateA) > Number(dateB) ? 1 : -1;
            });

        tableContainer.tBodies[0].append(...students);
    })
};


const addStudent = () => {
    btn.addEventListener('click', () => {

        parseNameData(studentName.value);
        parseFacultyData(sbj.value);
        parseEducationData(educationDate.value);

        if (validation()) {
            const newRow = document.createElement('tr');
            const columnOne = document.createElement('td');
            const columnTwo = document.createElement('td');
            const columnThree = document.createElement('td');
            const columnFour = document.createElement('td');

            columnOne.textContent = studentName.value;
            columnTwo.textContent = sbj.value;
            columnThree.textContent = formatDate(new Date(birthday.value));
            columnFour.textContent = setPeriodOfStudy();

            newRow.append(columnOne, columnTwo, columnThree, columnFour);
            tableContainer.tBodies[0].append(...students);
            tableContainer.tBodies[0].append(newRow);

            students = Array.from(tableContainer.rows).slice(1);

            studentName.value = "";
            sbj.value = "";
            birthday.value = "";
            educationDate.value = "";

            nameFilter.value = "";
            sbjFilter.value = "";
            educationStartFilter.value = "";
            educationEndFilter.value = "";

            errorName.textContent = '';
            errorSbj.textContent = '';
            errorBirth.textContent = '';
            errorEducation.textContent = '';
        }
    })
};

const validation = () => {

    let validated = true;
    if (studentName.value === "") {
        errorName.textContent = 'Поле "ФИО" обязательно для заполнения';
        validated = false;
    } else {
        errorName.textContent = '';
    };

    if (sbj.value === "") {
        errorSbj.textContent = 'Поле "факультет" обязательно для заполнения';
        validated = false;
    } else {
        errorSbj.textContent = '';
    };

    let minDate = new Date(1900, 0, 1);
    let maxDate = new Date();
    let currDate = new Date(birthday.value);
    if (birthday.value === "" || !(currDate >= minDate && currDate <= maxDate)) {
        errorBirth.textContent = 'Поле "дата рождения" обязательно для заполнения и должно быть в диапозоне от 01.01.1900 до текущей даты';
        validated = false;
    } else {
        errorBirth.textContent = '';
    };

    let startDate = new Date(2000, 0, 1);
    if (educationDate.value === "" || !(Number(educationDate.value) >= startDate.getFullYear() && Number(educationDate.value) <= maxDate.getFullYear())) {
        errorEducation.textContent = 'Поле "год начала обучения" обязательно для заполнения и должно быть в диапозоне от 2000 года до текущего';
        validated = false;
    } else {
        errorEducation.textContent = '';
    };

    return validated;
};


function parseNameData(NameString) {
    return NameString
        //разбираем текст по строкам 
        .split('\n')
        //убираем пустые строки и строки с пробелами 
        .filter(line => line.trim().lenght > 0)
        //преобразуем каждую строку в объект 
        .map(fullName => {
            //через запятую выписаны ФИО и должность 
            //далее нам нужно разбить ФИО на составляюшие 
            const [Name, surname, middleName] = fullName
            //ФИО в тексте написано через пробел поэтому разбиваем по пробелу 
                .split(' ')
                //и тоже убираем лишнее
                .filter(text => text.lenght > 0);
            //возвращаем объект со структурированными данными 
            return {
                Name,
                middleName,
                surname
            };
        })

};



function parseFacultyData(facultyString) {
    return facultyString
        //разбираем текст по строкам 
        .split('\n')
        //убираем пустые строки и строки с пробелами 
        .filter(line => line.trim().lenght > 0)
        //преобразуем каждую строку в объект 
        .map(faculty => {
            return {
                faculty
            };
        })

};

function parseEducationData(educationString) {
    return educationString
        //разбираем текст по строкам 
        .split('\n')
        //убираем пустые строки и строки с пробелами 
        .filter(line => line.trim().lenght > 0)
        //преобразуем каждую строку в объект 
        .map(education => {

            return {
                education
            };
        });
};

function setPeriodOfStudy() {
    let currDate = new Date();
    let courseYear = currDate.getFullYear() - Number(educationDate.value);
    if (courseYear > 4 || (courseYear == 4 && currDate.getMonth() >= 5)) courseYear = 'закончил';
    else {
        if (currDate.getMonth() >= 8) {
            courseYear++;
        }
        courseYear = courseYear.toString() + ' курс'
    }
    return `${educationDate.value}-${Number(educationDate.value) + 4} (${courseYear})`;
};

function formatDate(date) {

    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yyyy = date.getFullYear();

    let currDate = new Date();
    let age = currDate.getFullYear() - yyyy;
    if (age != 0 && date.getMonth() > currDate.getMonth()) age--;
    else if (age != 0 && date.getMonth() == currDate.getMonth() && date.getDate() > currDate.getDate()) age--;

    return dd + '.' + mm + '.' + yyyy + ` (${age} лет)`;
};

addStudent();
filterStudents();
sortByName();
sortBySbj();
sortByBirth();
sortByEducation();
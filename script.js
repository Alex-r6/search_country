const inp = document.querySelector('.inp')
const btn = document.querySelector('.btn')
const box = document.querySelector('.box')
const predlojk = document.querySelector('.predlojk')
const predlojk2 = document.querySelector('.predlojk2')
const autocompitC = document.querySelector('.autocompit-c')

let data = []

function debounce(func, timeout = 800) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func(...args); }, timeout);
  };
}

const make_autoComplit = (data) => {
  autocompitC.textContent = ''
  let info = data.splice(0, 10)
  info.forEach(elem => {
    const p = document.createElement('p');
    p.classList.add('auto-text')
    p.textContent = elem.name.common;
    autocompitC.appendChild(p)

    p.onclick = () => openAllInfo(elem)
  })
}

const show_error = (error) => {
  autocompitC.textContent = '';
  predlojk2.style.display = 'flex'
  predlojk2.textContent = '';
  const div_error = document.createElement('div')
  const p = document.createElement('p')
  p.textContent = 'Error: ' + error.status + ' ' + error.statusText;
  console.log(error)
  predlojk2.appendChild(div_error)
  div_error.appendChild(p)
  setTimeout(() => {
    div_error.remove()
  }, 3000)

}

const check_response = (response) => {
  if (response.ok) return response.json()
  else {
    return Promise.reject(response)
  }
}

const send_url = (country) => {
  const url = 'https://restcountries.com/v3.1/name/' + country;
  fetch(url)
    .then(check_response)
    .then(make_autoComplit)
    .catch(show_error)
}

const getAutocomplit = () => {
  predlojk2.style.display = 'none'
  const InpValue = inp.value.trim()
  if (InpValue === '') {
    autocompitC.textContent = '';
    predlojk.textContent = '';
    return
  }
  send_url(inp.value)
}

const openAllInfo = (elem) => {
  inp.value = elem.name.official;
  create_ulr(inp.value)
  autocompitC.textContent = ''
  predlojk.textContent = ''
  const capital = document.createElement('p')
  const population = document.createElement('p')
  const languages = document.createElement('p')
  const FlagImg = document.createElement('img');

  capital.textContent = `Capital : ${elem.capital}`
  population.textContent = `Population : ${elem.population}`
  FlagImg.src = `${elem.flags.png}`
  const languagesObj = elem.languages;
  if (languagesObj) {
    const languageNames = Object.values(languagesObj).join(', ');
    languages.textContent = `Languages: ${languageNames}`;
  } else {
    languages.textContent = 'Languages: N/A';
  }
  predlojk.append(capital, population, languages, FlagImg)
}

const create_ulr = (text) => {
  const currentURL = `http://127.0.0.1:5500/project/index.html?input=${text}`
  window.history.replaceState({}, "", currentURL);
}

const make_new_inp = () => {
  const new_url = new URL(window.location.href)
  let searchParams = new_url.searchParams;
  let param1 = searchParams.get("input");
  inp.value = param1
  if (param1 === '' || param1 === null) return;
  const url = 'https://restcountries.com/v3.1/name/' + param1;
  fetch(url)
    .then(check_response)
    .then((data) => {
      console.log(data);
      if (data.length > 1) {
        make_autoComplit(data)
      } else {
        openAllInfo(data[0])
      }
    })
    .catch((error) => {
      showText(error)
    })
}


const showText = debounce(getAutocomplit, 200);
inp.oninput = () => {
  showText()
  create_ulr(inp.value)
  // getAutocomplit();

}


const start = () => {
  make_new_inp()
}
start()

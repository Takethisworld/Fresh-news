const API_KEY = '02197a002c2f42f7b759963f90b66293';

const newsList = document.querySelector('.news-list');
const element = document.querySelector('.js-choice');
const formSearch = document.querySelector('.form-search')

const getDateCorrectFormat = isoDate => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
    const fullTime = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });

    return `<span class="news-date">${fullDate}</span>${fullTime}`;
}

const choices = new Choices(element, {
    searchEnabled: false,
    itemSelectText: ''
});

const getData = async (url) => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY
        }
    })
    const data = response.json();

    return data
}

const renderCard =  (data) => {
    console.log(data)
    newsList.textContent = '';

    data.forEach(async({ urlToImage, title, description, author, publishedAt }) => {
        const card = document.createElement('li');
        card.className = 'news-item';
        const image = await loadImage(urlToImage);
        card.append(image)

        card.insertAdjacentHTML("beforeend", `  
        <h3 class="news-title">
          <a class="news-link" href="#" target="_blank"
            >${title || ''}
          </a>
        </h3>             
        <p class="news-discription">
        ${description || ''}
        </p>
        <div class="news-footer">
          <time class="news-datetime" datetime='${publishedAt}'>
            ${getDateCorrectFormat(publishedAt)}
          </time>
          <div class="news-author">${author || ''}</div>
        `);

        newsList.append(card)

    });
}

const loadNews = async () => {
    newsList.innerHTML = '<li class=preload></li>'
    const country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);

    const data = await getData(`https://newsapi.org/v2/top-headlines?country=${country}&pageSize=20`);
    renderCard(data.articles);

}

const loadSearch = async value => {
    const data = await getData(`https://newsapi.org/v2/everything?q=${value}`)
    title.textContent = `По вашему запросу “${value}” найдено ${data.articles.length}`
};

const loadImage = (url) => new Promise((resolve, reject) => {
    const image = new Image(270, 200);

    image.addEventListener('load', () => {
        resolve(image);
    })

    image.addEventListener('error', () => {
        image.src = 'img/no-photo.jpg'
        reject(image);
    })
    image.src = url || 'img/no-photo.jpg';

    image.className = 'news-image'

    return image
});

formSearch.addEventListener('submit', (e) => {
    e.preventDefault()
    loadSearch(formSearch.search.value);
    formSearch.reset()
});

element.addEventListener('change', (event) => {
    const value = event.detail.value;
    localStorage.setItem('country', value)
    loadNews()
});


loadNews()
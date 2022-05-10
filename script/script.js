const API_KEY = '02197a002c2f42f7b759963f90b66293';

const newsList = document.querySelector('.news-list');
const element = document.querySelector('.js-choice');
console.log('Element:' ,element)

const choices = new Choices(element,{
    searchEnabled: false,
    itemSelectText:''
});

const getData = async(url)=>{
    const response = await fetch(url,{
        headers:{
            'X-Api-Key':API_KEY
        }
    })
    const data = response.json();
    
    return data
}

const renderCard=(data)=>{
    console.log(data)
    newsList.textContent = '';
    
    data.forEach(news => {
        const card = document.createElement('li');
        card.className='news-item';

        card.innerHTML=`
              <img
                src="${news.urlToImage}"
                alt="${news.title}"
                class="news-image"
                width="270px"
                height="200px"
              />  
              <h3 class="news-title">
                <a class="news-link" href="#" target="_blank"
                  >${news.title}
                </a>
              </h3>             
              <p class="news-discription">
              ${news.description}
              </p>
              <div class="news-footer">
                <time class="news-datetime" datetime="2022-03-16t16:11:062">
                  <span class="news-date">16/03/2022</span> 11:06
                </time>
                <div class="news-author">${news.author}</div>
              `;

              newsList.append(card)
        
    });
}

const loadNews = async()=>{
    const data = await getData('https://newsapi.org/v2/top-headlines?country=us');
    renderCard(data.articles);
}
loadNews()
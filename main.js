class Storage {
    constructor(key) {
        this.key = key;
    }
    getStorage() {
        const data = window.localStorage.getItem(this.key);
        if (data) {
            return JSON.parse(data);
        }
        return data;
    }
    save(data) {
        window.localStorage.setItem(this.key, JSON.stringify(data))
    }
}
  
const GETNewDeck = (url, cb) => {

    let url = 'https://deckofcardsapi.com/api/deck/new/';

    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener('load', (response) => {
        const data = JSON.parse(response.currentTarget.response);
        // cb(data);
        console.log(data);
    })
    request.send();
}

const drawCard = (url, cb) => {
    const deck_id = data.deck_id;
    let url = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`;

    let request = new XMLHttpRequest();
    request.open("GET", url);
    request.addEventListener('load', (response) => {
        const data = JSON.parse(response.currentTarget.response);
        cb(data);
        console.log(data);
    })
    request.send();
}


let state = {
    isNew: 'active',
    deck_id: 'c0kfjhypmner',
    count: '51',
    cards: [{
        img: ['https://deckofcardsapi.com/static/img/KH.png'],
        value: ['KING'],
        suit: ['HEARTS'],
    }]
}

const cardArr = [];
for (let card of cards) {
    let currentCard = data.cards[i];
    cardArr.push(currentCard)

}



const storage = new Storage('app-state');
const container = document.querySelector('.container');
const newDeck = document.querySelector('.js-newDeck');

const cardToHTML = (isNew, deck_id, count, img, value, suit) => {
    if (isNew) {
        return `<div class='row'>
        <h1>My Deck of Cards</h1>
        <button class='js-newDeck'>New Deck</button>

    </div>`;
    }
    else return `<div class="container active">
    <div class='row'>
        <h1>My Deck of Cards</h1>
        <button class='js-playDeck'>Draw Card</button>
        <button class='js-newDeck'>New Deck</button>
        <h4>Deck ID: ${deck_id}</h4>
        <h3>Cards Left In Deck: ${count}</h3>
    </div>
    <div class='deck-container'>
        <ul>
            <img src='${img}'>
            <a>${value} of ${suit}</a>
        </ul>`;
}

container.addEventListener('click', e => {
    if (e.target.matches('.js-newDeck')) {
        state.isNew = true;
        GETNewDeck(url, cb => {
            storage.save(state);
            renderNew(state);
        })
    }
    if (e.target.matches('.js-playDeck')) {
        state.isNew = false;
        drawCard(url, cb => {
            storage.save(state);
            renderGamePlay(state);
        })
    }
    else return;
})


const renderNew = (state) => {
    container.classList.add('active');
    container.classList.remove('hidden');
  
    container.innerHTML = cardToHTML(state);
}
renderNew(state);

const renderGamePlay = (state) => {
    container.classList.remove('active');
    constainer.classList.add('hidden');

    container.innerHTML = cardToHTML(state);
}
renderGamePlay(state)
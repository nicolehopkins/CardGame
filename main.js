//LOCAL STORAGE
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


//GLOBAL VARIABLES
const deck_info = document.querySelector('.deck-info-js')
const deck_container = document.querySelector('.deck-container-js')
const createDeckButton = document.querySelector('.create-deck-js')
const drawCardButton = document.querySelector('.draw-card-js');


const storage = new Storage('app-state');
//STATE
let state = {
    cards_remaining: 0,
    deck_id: '',
    deck: []
}
console.log(state)


//OBJECTS TO HTML
const deckInfoToHTML = (state) => {
    return `<p class='h6'>Deck ID: ${state.deck_id}</p>
    <p class='h5'>Cards Left in Deck: ${state.cards_remaining}</p>`
}

const imgToHTML = (url, suit, value) => {
    return `<div class='col' style='width: 25%'><img src='${url}'>
    <p>${value} of ${suit} </p></div>`
}


//RENDER 
const render = (state) => {
    deck_info.innerHTML = deckInfoToHTML(state);

    let cards = '';
    state.deck.forEach(e => {
        const {suit, value, image} = e.cards[0];
        cards += imgToHTML(image, suit, value);
    })
    deck_container.innerHTML = cards;

}

//API CALLS
const getDeck = (cb) => {
    const request = new XMLHttpRequest()
        request.open('GET', 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        request.addEventListener('load', (response) => {
        let data = JSON.parse(response.target.response)
        state.deck = [];
        state.deck_id = data.deck_id
        state.cards_remaining = data.remaining
        storage.save(state)
        cb(data)
    })
    request.send()
}

const drawCard = (ID, cb) => {
    const request = new XMLHttpRequest()
    request.open('GET', `https://deckofcardsapi.com/api/deck/${ID}/draw/?count=1`)
    request.addEventListener('load', (response) => {
    let data = JSON.parse(response.target.response)
    console.log(data)
    state.deck.unshift(data)
    state.cards_remaining = data.remaining;

    storage.save(state)
    cb(data)
    })
    request.send()
}


//EVENT LISTENERS
createDeckButton.addEventListener('click',(e)=>{
    getDeck((d)=>{
        render(state)
    })
})

drawCardButton.addEventListener('click', (e) => {
    drawCard(state.deck_id, (d) => {
        render(state);
        console.log(state.deck)
    })
})



const stored_state = storage.getStorage();
if (stored_state) {
    // If there is then apply that to my state in Memory
    state = stored_state;
}

render(state);

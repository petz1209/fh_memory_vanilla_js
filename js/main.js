

// PRESENTER CONSTANTS
const SIGNUPFORM = document.querySelector("#signUp");
const LAYOVER = document.querySelector("#layover")
const SIGNUPINPUT = document.querySelector("#userNameInput")
const SIGNUPBTN = document.querySelector("#signUpBtn");
const NAMEBOX = document.querySelector("#userNameDisplay");
const TRYCOUNT = document.querySelector("#tryCount");
const TIME = document.querySelector("#time");
const BOARD = document.querySelector("#spielbereich");
const NEWGAME = document.querySelector("#newGame");
const WINMODAL = document.querySelector("#Win");
const WINMESSAGE = WINMODAL.querySelector("p");

// CONSTANT RESSOURCES
const IMG_BACKSIDE = "pics/memoryBg.png";
const IMG_OUT = "pics/memoryBgI.png";


// LOGIC CONTANTS
let timeInterval;
let time = 0;
let tries = 0; 


const GameMM = {
    "ready": false,
}

const RoundMM = {
    "visible": 0,
}


function GAME(){
    timer()
    tries = -1;
    setUpBoard()
    LAYOVER.classList.replace("layover", "hide");
    
}


SIGNUPBTN.addEventListener("click", async () => {
    NAMEBOX.innerText = ` ${SIGNUPINPUT.value}`;
    SIGNUPFORM.classList.replace("modal", "hide");
    
    GAME();
})

NEWGAME.addEventListener("click", async () => {
    gameTearDown();
    TRYCOUNT.innerText = `Versuche: ${tries}`;
    WINMODAL.classList.replace("modal", "hide");
    GAME();
})




const timer = async () => {
    // counts up the time by 1 each second
    timeInterval = setInterval(() => {
        time++;
        TIME.innerText = `Zeit: ${time}`;
    }, 1000)


}

const tryHandler = async (elements) => {
    tries++;
    elements.forEach((e) => {
        e.src = IMG_BACKSIDE;
        e.classList.remove("active");
    })
    TRYCOUNT.innerText = `Versuche: ${tries}`;
    RoundMM.visible = 0;
}


//functions:
const setUpBoard = async () => {
    const basecards = Array.from({length: 8}, (_, i) => i + 1).map((i) => {
        return `card${i}.png`;
    })
    console.log(basecards);
    const cards = basecards.concat(basecards);
    //console.log(cards)
    const shuffledCards = shuffle(cards)
    
    shuffledCards.forEach((item) => {
        console.log(item);
        const card = document.createElement("IMG");
        card.src = IMG_BACKSIDE;
        card.dataset.src= `pics/${item}`;
        card.classList.add("card");
        
        card.addEventListener("click", async (e) => {
            if ( RoundMM.visible < 2 && card.classList.contains("card") && !card.classList.contains("active")){
                card.classList.add("active");
                card.src = e.target.dataset.src;
                RoundMM.visible += 1;
                gameLoop()
            }
            
        })

        BOARD.appendChild(card);
        GameMM.ready = true;
        
        
    }) 

}

const shuffle = (array) => {
    // using Fisher-Yates
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        const shuffled = [...array];
        return shuffled
      
}

const gameLoop = () => {
    // update Try
    
    if (RoundMM.visible == 2){
        const activeCards = BOARD.querySelectorAll(".active");
        if (activeCards[0].dataset.src === activeCards[1].dataset.src){
            activeCards.forEach((e) => {
                e.classList.remove("card");
                e.classList.remove("active");
                e.classList.add("empty");
                e.src = IMG_OUT;
                RoundMM.visible = 0;

            })
            
            // check if there is still anything left
            if (!BOARD.querySelectorAll(".card").length){
                clearInterval(timeInterval);
                displayWin();
            }

        }
        else{
            setTimeout((activeCards)=> {
                tryHandler(activeCards)
            }, 800, activeCards)
        }
    }
    
}

const displayWin = () => {
    WINMESSAGE.innerText = `It took you ${tries} tries in ${time} seconds.`;
    WINMODAL.classList.replace("hide", "modal");
    LAYOVER.classList.replace("hide", "layover");

}

const gameTearDown = () => {
    GameMM.ready = false
    RoundMM.visible = 0;
    tries = 0;
    time = 0;
    BOARD.innerHTML = null;
}

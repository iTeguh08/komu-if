const btnhero = document.getElementById("btn-hero");
const popUpHERO = document.getElementById("banner-pop-up");
const closeBTNHERO = document.getElementById("close-pop-up-btn");

btnhero.addEventListener("click",()=>{
    popUpHERO.style.display = "block";
});

closeBTNHERO.addEventListener("click",()=>{
    popUpHERO.style.display = "none";
});

const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');
const btn5 = document.getElementById('btn5');
const skull = document.getElementById("skull");
const musuh1 = document.getElementById("musuh1");
const musuh2 = document.getElementById("musuh2");
const Border = document.getElementById("wrapper");
const tembakan = document.getElementById('tembakan');
const count1 = document.getElementById('count1');
const count2 = document.getElementById('count2');

let left = 0;
let hpmusuh1 = 60;
let hpmusuh2 = 60;

btn1.addEventListener('click',()=>{
    left -=5
    skull.style.left = left + "px";
    skull.style.backgroundImage = "url(./images/game/skull4.png)";
    restartKiri()
});

btn2.addEventListener('click',()=>{
    skull.style.animation = 'Jump 1 2s ';
    skull.style.backgroundImage = "url(./images/game/skull5.png)";
    skull.style.backgroundSize = 75 + "px"
    restartJump()
});

btn3.addEventListener('click',()=>{
    left +=5
    skull.style.left = left + "px";
    skull.style.backgroundImage = "url(./images/game/skull2.png)";
    restartKanan()
});

btn4.addEventListener('click',()=>{
     skull.style.backgroundImage = 'url(./images/game/skull2.png)';
     tembakan.style.animation = 'tembak1 1 0.3s linear';
     tembakan.style.display = 'block';
     tembakan.style.rotate = '90deg';
     restartTembak();
     hpmusuh1 -=1;
     count1.textContent = hpmusuh1;
     if(hpmusuh1 === 0){
        musuh1.style.backgroundImage = 'url(./images/game/blowup.png)';
        musuh1.style.top = 38 + '%';
        count1.style.display = 'none';
        notshow1();
        show2();
     }
})

btn5.addEventListener('click',()=>{
    skull.style.backgroundImage = 'url(./images/game/skull4.png)';
    tembakan.style.animation = 'tembak2 1 0.3s linear';
    tembakan.style.display = 'block';
    tembakan.style.rotate = '-90deg';
    restartTembak2();
    if(count1.style.display === 'none'){
        hpmusuh2 -=1;
        count2.textContent = hpmusuh2;
    }
    if(hpmusuh2 === 0){
        musuh2.style.backgroundImage = 'url(./images/game/blowup.png)';
        musuh2.style.top = 38 + '%';
        count2.style.display = 'none';
        notshow2();
     }
})

function restartJump(){
    setTimeout(()=>{
        skull.style.animation = 'none'
        skull.style.backgroundImage = "url(./images/game/skull1.png)";
        skull.style.backgroundSize = 70 + "px"
    },1280)
};

function restartKanan(){
    setTimeout(()=>{
        skull.style.backgroundImage = "url(./images/game/skull1.png)";
    },100)
};

function restartKiri(){
    setTimeout(()=>{
        skull.style.backgroundImage = "url(./images/game/skull3.png)";
    },100)
};

function restartTembak(){
    setTimeout(()=>{
        skull.style.animation = 'none'
        skull.style.backgroundImage = "url(./images/game/skull1.png)";
        tembakan.style.display = 'none';
    },200)
}

function restartTembak2(){
    setTimeout(()=>{
        skull.style.animation = 'none'
        skull.style.backgroundImage = "url(./images/game/skull3.png)";
        tembakan.style.display = 'none';
    },200)
}

function notshow1(){
      setTimeout(()=>{
        musuh1.style.display = 'none';
      },2000)
}

function notshow2(){
    setTimeout(()=>{
      musuh2.style.display = 'none';
    },2000)
}

function show2(){
    setTimeout(()=>{
        musuh2.style.animation = 'show2 1 2s ease';
        musuh2.style.left = 0 + '%';
        count2.style.display = 'block'
    },1000);
   
}

window.addEventListener('keydown',(event)=>{
    if(event.key === 'd'){
        left +=5
        skull.style.left = left + "px";
        skull.style.backgroundImage = "url(./images/game/skull2.png)";
        restartKanan()
    }else if(event.key === 'a'){
        left -=5
        skull.style.left = left + "px";
        skull.style.backgroundImage = "url(./images/game/skull4.png)";
        restartKiri()
    }
    else if(event.key === 'w'){
        skull.style.animation = 'Jump 1 2s ';
        skull.style.backgroundImage = "url(./images/game/skull5.png)";
        skull.style.backgroundSize = 75 + "px"
        restartJump()
    }
    else if(event.key === 'g'){
        skull.style.backgroundImage = 'url(./images/game/skull2.png)';
        tembakan.style.animation = 'tembak1 1 0.3s linear';
        tembakan.style.display = 'block';
        restartTembak();
        tembakan.style.rotate = '90deg';
        hpmusuh1 -=1;
        count1.textContent = hpmusuh1;
        if(hpmusuh1 === 0){
            musuh1.style.backgroundImage = 'url(./images/game/blowup.png)'
            musuh1.style.top = 38 + '%';
            count1.style.display = 'none';
            notshow1();
            show2();
         }
    }

    else if(event.key === 'f'){
        skull.style.backgroundImage = 'url(./images/game/skull4.png)';
        tembakan.style.animation = 'tembak2 1 0.3s linear';
        tembakan.style.display = 'block';
        restartTembak2();
        tembakan.style.rotate = '-90deg';
        if(count1.style.display === 'none'){
            hpmusuh2 -=1;
            count2.textContent = hpmusuh2;
        }
        if(hpmusuh2 === 0){
            musuh2.style.backgroundImage = 'url(./images/game/blowup.png)';
            musuh2.style.top = 38 + '%';
            count2.style.display = 'none';
            notshow2();
         }
    }
})
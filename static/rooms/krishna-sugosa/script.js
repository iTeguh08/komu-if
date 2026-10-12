const bg = document.getElementById('container');
const Car = document.getElementById('car');
const oppCar = document.getElementById('opp-car');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');

let left = 130;
let leftOpp = 130;

const minLeft = 100;
const maxLeft = 200; 

btn1.addEventListener('click',()=>{
    if(left > minLeft){
        left -= 100;
        Car.style.left = left + 'px';
    }
})

btn2.addEventListener('click',()=>{
    if(left < maxLeft){
        left += 100;
        Car.style.left = left + 'px';
    }

})

window.addEventListener('keydown',(x)=>{
    if(x.key === 'a'){
        if(left > minLeft){
            left -= 100;
            Car.style.left = left + 'px';
        }
    }else if(x.key === 'd'){
        if(left < maxLeft){
            left += 100;
            Car.style.left = left + 'px';
        }
    }
})

oppCar.addEventListener('animationiteration',()=>{
    let random = Math.floor(Math.random() * 3);
    leftOpp = random * 100;
    oppCar.style.left = leftOpp + 'px';
})

function ApakahTabrakan(car, oppCar) {
    const carRect = car.getBoundingClientRect();
    const oppCarRect = oppCar.getBoundingClientRect();

    return !(
        carRect.top > oppCarRect.bottom ||
        carRect.bottom < oppCarRect.top ||
        carRect.right < oppCarRect.left ||
        carRect.left > oppCarRect.right
    );
}


function gameLoop() {
    if (ApakahTabrakan(Car, oppCar)) {
        alert('You lose');
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
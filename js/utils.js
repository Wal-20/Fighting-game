

function collision(player,enemy){

    return (
        player.attackBox.width + player.attackBox.position.x >= enemy.position.x && 
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.height + player.attackBox.position.y >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height
    );
}
// detecting collision

function determineWinner({player,enemy, timeId}){

    clearTimeout(timeId)
    document.querySelector('#displayText').style.display = 'flex';

    if(player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 1 wins';
    }

    else if(player.health < enemy.health){
        document.querySelector('#displayText').innerHTML = 'Player 2 wins';
    }
    
    else{
        document.querySelector('#displayText').innerHTML = 'Tie';
    }

}


let timer = 60;
let timeId;

function decreaseTimer(){

    if(timer > 0){
        
        timeId = setTimeout(decreaseTimer,setInterval = 1000);
        timer --;
        document.getElementById('timer').innerText = timer;
    }
}
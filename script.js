const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 560;
canvas.floorLevel = 480;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({

  position : {x : 0, y : 0,},
  imageSrc : 'Chris Courses - Fighting Game/background.png'

})



const shop = new Sprite({

  position : {x : 600, y : 128,},
  imageSrc : 'Chris Courses - Fighting Game/shop.png',
  scale : 2.75,
  framesMax : 6
})

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset:{
    x : 215,
    y : 157
  },
  imageSrc : 'Chris Courses - Fighting Game/samuraiMack/Idle.png',
  framesMax : 8,
  scale : 2.5,
  sprites:{
    idle : {
      imageSrc : 'Chris Courses - Fighting Game/samuraiMack/Idle.png',
      framesMax : 8
    },
    run : {
      imageSrc : 'Chris Courses - Fighting Game/samuraiMack/Run.png',
      framesMax : 8,
    },
    jump : {
      imageSrc : 'Chris Courses - Fighting Game/samuraiMack/Jump.png',
      framesMax : 2,
    },
    fall : {
      imageSrc : 'Chris Courses - Fighting Game/samuraiMack/Fall.png',
      framesMax : 2,
    },
    attack1: {
      imageSrc : 'Chris Courses - Fighting Game/samuraiMack/Attack1.png',
      framesMax : 6,
    },
    attack2: {
      imageSrc : 'Chris Courses - Fighting Game/samuraiMack/Attack2.png',
      framesMax : 6,
    },
    
    takeHit:{
      imageSrc : 'Chris Courses - Fighting Game/SamuraiMack/Take Hit - white silhouette.png',
      framesMax : 4,
    },

    death:{
      imageSrc : 'Chris Courses - Fighting Game/SamuraiMack/Death.png',
      framesMax : 6,
    }
    
  },
  attackBox : {
    offset : { x : 100 , y : 50},
    width : 145,
    height : 50
  }
  
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset:{
    x : 215,
    y : 167
  },
  imageSrc : 'Chris Courses - Fighting Game/kenji/Idle.png',
  framesMax : 4,
  scale : 2.5,
  sprites:{
    idle : {
      imageSrc : 'Chris Courses - Fighting Game/kenji/Idle.png',
      framesMax : 4
    },
    run : {
      imageSrc : 'Chris Courses - Fighting Game/kenji/Run.png',
      framesMax : 8,
    },
    jump : {
      imageSrc : 'Chris Courses - Fighting Game/kenji/Jump.png',
      framesMax : 2,
    },
    fall : {
      imageSrc : 'Chris Courses - Fighting Game/kenji/Fall.png',
      framesMax : 2,
    },
    attack1: {
      imageSrc : 'Chris Courses - Fighting Game/kenji/Attack1.png',
      framesMax : 4,
    },

    attack2: {
      imageSrc : 'Chris Courses - Fighting Game/kenji/Attack2.png',
      framesMax : 4,
    },

    takeHit:{
      imageSrc : 'Chris Courses - Fighting Game/kenji/Take Hit.png',
      framesMax : 3,
    },
    death:{
      imageSrc : 'Chris Courses - Fighting Game/kenji/Death.png',
      framesMax : 7,
    }

  },
  attackBox : {
    offset : { x : -170 , y : 50},
    width : 170,
    height : 50
  }
  
});


const game_over = () => player.dead || enemy.dead || timer === 0;



const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },

  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};



function animate(){

  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255,255,255,0.15)'
  c.fillRect(0,0,canvas.width,canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite('run')
  }

  else{
    player.switchSprite('idle');
  }
  
  if(player.velocity.y < 0){
    player.switchSprite('jump');
  }
  else if(player.velocity.y > 0){
    player.switchSprite('fall');
  }
  // Player movement


  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite('run')
  }
  else{
    enemy.switchSprite('idle')
  }

  if(enemy.velocity.y < 0){
    enemy.switchSprite('jump')
  }
  else if(enemy.velocity.y > 0){
    enemy.switchSprite('fall')
  }

  // Enemy movement

  if(player.isAttacking && player.currFrame === 4){
    player.isAttacking = false;
    
    if(collision(player,enemy)){
      enemy.takeHit(20)
    
      gsap.to('#enemyHealth', {
        width : enemy.health + '%'
      })

    } // if player hits

  }


  if(enemy.isAttacking && enemy.currFrame === 2){
    enemy.isAttacking = false;
    
    if(collision(enemy,player)){
      player.takeHit(10)
    
      gsap.to('#playerHealth', {
        width : player.health + '%'
      })
      
    } // if enemy hits
  
  }


  if(game_over()){
    determineWinner({player, enemy, timeId})
  }
  //end the game based on health or time 
}


window.addEventListener("keydown", (event) => {
  
  if(!game_over()){

    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
  
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
  
      case "w":
        if (player.velocity.y === 0) {
          player.velocity.y = -20;
        }
        break;
  
      case ' ':
          player.Attack()
          break
  
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
  
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
  
      case "ArrowUp":
        if (enemy.velocity.y == 0) {
          enemy.velocity.y = -20;
        }
        break;
  
      case 'ArrowDown':
          enemy.Attack()
          break
      
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;

    case "a":
      keys.a.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});



animate();
decreaseTimer();
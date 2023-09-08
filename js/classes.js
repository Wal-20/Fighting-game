class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    currFrame = 0,
    framesElapsed = 0,
    framesHold = 10,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    (this.currFrame = currFrame),
      (this.framesElapsed = framesElapsed),
      (this.framesHold = framesHold);
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.currFrame * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
    this.animateFrames();
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currFrame < this.framesMax - 1) {
        this.currFrame++;
      } else {
        this.currFrame = 0;
      }
    }
    
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    // object destructuring
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.isAttacking;
    this.health = 100;
    this.dead = false;
    this.isAttack1 = true;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    (this.currFrame = 0), (this.framesElapsed = 0), (this.framesHold = 5);
    this.sprites = sprites;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }  
  }

  switchSprite(sprite) {
    
    if (this.image === this.sprites.death.image)
    {
      this.isAttacking = false;

      if(this.currFrame === this.sprites.death.framesMax - 1)
        this.dead = true;
        // death animation finishes, only sets this.dead to true when that happens
      
      return;  
    }
    
    // overriding all other animations with the death animation

    if (
      this.image === this.sprites.attack1.image &&
      this.currFrame < this.sprites.attack1.framesMax - 1
    )
      return;

      if (
        this.image === this.sprites.attack2.image &&
        this.currFrame < this.sprites.attack2.framesMax - 1
      )
        return;
    // overriding all other animations with the attack animations

    if (
      this.image === this.sprites.takeHit.image &&
      this.currFrame < this.sprites.takeHit.framesMax - 1
    )
      return;
    // overriding all other animations with the take hit animation

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.currFrame = 0;
        }
        break;

      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.currFrame = 0;
        }
        break;

      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.currFrame = 0;
        }
        break;

      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.currFrame = 0;
        }
        break;
      
        case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.currFrame = 0;
        }
        break;
      
        case "attack2":
        if (this.image !== this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.currFrame = 0;
        }
        break;

      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.currFrame = 0;
        }
        break;

      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.currFrame = 0;
        }
        break;
    }
  }

  update() {
    this.draw();

    if(!this.dead){
      this.animateFrames();
    }

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Draw the attack box

    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );
    
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.floorLevel) {
      this.velocity.y = 0;      // used to stop falling when fighter reaches the ground
    } else {
      this.velocity.y += gravity;
    }
    // gravity physics
  }

  Attack() {
    
    this.isAttack1 ? this.switchSprite('attack1') : this.switchSprite('attack2');

    this.isAttacking = true;
    this.isAttack1 = !this.isAttack1;     // Alternating between attack animations

  }

  takeHit(dmg) {
    
    this.health -= dmg;

    if(this.health <= 0){
      this.switchSprite('death');
    }
    
    else{
      this.switchSprite('takeHit');
    }
    
  }
}

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite
{
    constructor({ position, velocity, color, offset })
    {
        this.position = position;
        this.velocity = velocity
        this.height = 150;
        this.lastKey = '';
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 100,
            height: 50,
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, 50, 150);

        // attack box
        if (this.isAttacking)
        {
            ctx.fillStyle = 'green';
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height)
        }
    }

    update()
    {
        this.draw();
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + 50;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height || this.position.y + this.velocity.y <= 0)
        {
            this.velocity.y = 0;
        } else this.velocity.y += gravity;
    }

    attack()
    {
        this.isAttacking = true;
        setTimeout(() =>
        {
            this.isAttacking = false
        }, 100)
    }

}

const player = new Sprite({
    position: {
        x: 150, y: 100
    },
    velocity: {
        x: 0, y: 0
    },
    offset: {
        x: -50, y: 0
    },
    color: 'red'
});

const enemy = new Sprite({
    position: {
        x: 800, y: 100
    },
    velocity: {
        x: 0, y: 0
    },
    offset: {
        x: 100, y: 0
    },
    color: 'blue'
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    }
};


function animate()
{
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a')
    {
        player.velocity.x = -5;
    }
    else if (keys.d.pressed && player.lastKey === 'd')
    {
        player.velocity.x = 5;
    }
    else if (keys.w.pressed && player.lastKey === 'w')
    {
        player.velocity.y = -20;
    }

    // enemy movement
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
    {
        enemy.velocity.x = 5;
    }
    else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
    {
        enemy.velocity.x = -5;
    }
    else if (keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp')
    {
        enemy.velocity.y = -20;
    }

    // detect for collision
    if (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + 50 &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + 150 &&
        player.isAttacking
    )
    {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
        console.log('player hitted');
    }

    if (
        enemy.attackBox.position.x + enemy.attackBox.width >= player.position.x &&
        enemy.attackBox.position.x <= player.position.x + 50 &&
        enemy.attackBox.position.y + enemy.attackBox.height >= player.position.y &&
        enemy.attackBox.position.y <= player.position.y + 150 &&
        enemy.isAttacking
    )
    {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
        console.log('enemy hitted');
    }
}

animate();

window.addEventListener('keydown', (event) =>
{
    switch (event.key)
    {
        case 'd':
        case 'ㅇ':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
        case 'ㅁ':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
        case 'ㅈ':
            keys.w.pressed = true;
            player.lastKey = 'w';
            break;
        case ' ': // spacebar
            player.attack();
            break;
    }
    // console.log(event.key);
})

window.addEventListener('keyup', (event) =>
{
    switch (event.key)
    {
        case 'd':
        case 'ㅇ':
            keys.d.pressed = false;
            player.lastKey = 'd';
            break;
        case 'a':
        case 'ㅁ':
            keys.a.pressed = false;
            player.lastKey = 'a';
            break;
        case 'w':
        case 'ㅈ':
            keys.w.pressed = false;
            player.lastKey = 'w';
            break;
    }
    // console.log(event.key);
})

window.addEventListener('keydown', (event) =>
{
    switch (event.key)
    {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            enemy.lastKey = 'ArrowUp';
            break;
        case 'Shift':
            enemy.attack();
            break;
    }
    // console.log(event.key);
})

window.addEventListener('keyup', (event) =>
{
    switch (event.key)
    {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            enemy.lastKey = 'ArrowUp';
            break;
    }
    // console.log(event.key);
})
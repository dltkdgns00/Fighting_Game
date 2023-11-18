import { Fighter, Sprite } from './classes.js';
import { rectangularCollision, decreaseTimer, determineWinner } from './utils.js';

export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

ctx.fillRect(0, 0, canvas.width, canvas.height);

export const gravity = 0.7;
export let isAttacking = false;
export let isJumping = false;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '../assets/background.png'
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: '../assets/shop.png',
    scale: 2.75,
    framesMax: 6
});

export const player = new Fighter({
    position: {
        x: 150, y: 100
    },
    velocity: {
        x: 0, y: 0
    },
    offset: {
        x: -50, y: 0
    },
    imageSrc: '../assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215, y: 157
    },
    sprites: {
        idle: {
            imageSrc: '../assets/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: '../assets/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: '../assets/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: '../assets/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: '../assets/samuraiMack/Attack1.png',
            framesMax: 6,
        }
    }
});


export const enemy = new Fighter({
    position: {
        x: 800, y: 100
    },
    velocity: {
        x: 0, y: 0
    },
    offset: {
        x: 100, y: 0
    },
    imageSrc: '../assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215, y: 170
    },
    sprites: {
        idle: {
            imageSrc: '../assets/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: '../assets/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: '../assets/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: '../assets/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: '../assets/kenji/Attack1.png',
            framesMax: 4,
        }
    }
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

decreaseTimer();

function animate()
{
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === 'a')
    {
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    else if (keys.d.pressed && player.lastKey === 'd')
    {
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    else
    {
        player.switchSprite('idle');
    }

    //jumping
    if (player.velocity.y < 0)
    {
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0)
    {
        player.switchSprite('fall');
    }

    // enemy movement
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
    {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
    {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else
    {
        enemy.switchSprite('idle');
    }

    //jumping
    if (enemy.velocity.y < 0)
    {
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0)
    {
        enemy.switchSprite('fall');
    }

    // detect for collision
    if (
        rectangularCollision({
            object1: player, object2: enemy
        }) &&
        player.isAttacking
    )
    {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';

        // end game based on health
        if (enemy.health <= 0 || player.health <= 0)
        {
            determineWinner({ player, enemy });
        }
    }

    if (
        rectangularCollision({
            object1: enemy, object2: player
        }) &&
        enemy.isAttacking
    )
    {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';

        // end game based on health
        if (enemy.health <= 0 || player.health <= 0)
        {
            determineWinner({ player, enemy });
        }
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
            player.velocity.y = -20;
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
            enemy.velocity.y = -20;
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
    }
    // console.log(event.key);
})
import { Fighter, Sprite } from './scripts/classes.js';
import { rectangularCollision, decreaseTimer, determineWinner } from './scripts/utils.js';

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

export
    const player = new Fighter({
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        offset: {
            x: 0,
            y: 0
        },
        imageSrc: '../assets/samuraiMack/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
            x: 215,
            y: 157
        },
        sprites: {
            idle: {
                imageSrc: '../assets/samuraiMack/Idle.png',
                framesMax: 8
            },
            run: {
                imageSrc: '../assets/samuraiMack/Run.png',
                framesMax: 8
            },
            jump: {
                imageSrc: '../assets/samuraiMack/Jump.png',
                framesMax: 2
            },
            fall: {
                imageSrc: '../assets/samuraiMack/Fall.png',
                framesMax: 2
            },
            attack1: {
                imageSrc: '../assets/samuraiMack/Attack1.png',
                framesMax: 6
            },
            takeHit: {
                imageSrc: '../assets/samuraiMack/Take Hit - white silhouette.png',
                framesMax: 4
            },
            death: {
                imageSrc: '../assets/samuraiMack/Death.png',
                framesMax: 6
            }
        },
        attackBox: {
            offset: {
                x: 100,
                y: 50
            },
            width: 160,
            height: 50
        }
    })


export
    const enemy = new Fighter({
        position: {
            x: 400,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'blue',
        offset: {
            x: -50,
            y: 0
        },
        imageSrc: '../assets/kenji/Idle.png',
        framesMax: 4,
        scale: 2.5,
        offset: {
            x: 215,
            y: 167
        },
        sprites: {
            idle: {
                imageSrc: '../assets/kenji/Idle.png',
                framesMax: 4
            },
            run: {
                imageSrc: '../assets/kenji/Run.png',
                framesMax: 8
            },
            jump: {
                imageSrc: '../assets/kenji/Jump.png',
                framesMax: 2
            },
            fall: {
                imageSrc: '../assets/kenji/Fall.png',
                framesMax: 2
            },
            attack1: {
                imageSrc: '../assets/kenji/Attack1.png',
                framesMax: 4
            },
            takeHit: {
                imageSrc: '../assets/kenji/Take hit.png',
                framesMax: 3
            },
            death: {
                imageSrc: '../assets/kenji/Death.png',
                framesMax: 7
            }
        },
        attackBox: {
            offset: {
                x: -170,
                y: 50
            },
            width: 170,
            height: 50
        }
    })


const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
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

    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

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

    // detect for collision & enemy gets hit
    if (
        rectangularCollision({
            object1: player,
            object2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    )
    {
        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4)
    {
        player.isAttacking = false
    }

    // this is where our player gets hit
    if (
        rectangularCollision({
            object1: enemy,
            object2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    )
    {
        player.takeHit()
        enemy.isAttacking = false

        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2)
    {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0)
    {
        determineWinner({ player, enemy })
    }
}

animate();

window.addEventListener('keydown', (event) =>
{
    if (!player.dead)
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
            case ' ':
                player.attack();
                break;
        }
    }
    if (!enemy.dead)
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
    }
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
})
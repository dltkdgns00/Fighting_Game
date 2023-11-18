import { player, enemy } from './index.js';

function rectangularCollision({ object1, object2 })
{
    if (
        object1.attackBox.position.x + object1.attackBox.width >=
        object2.position.x &&
        object1.attackBox.position.x <=
        object2.position.x + object2.width &&
        object1.attackBox.position.y + object1.attackBox.height >=
        object2.position.y &&
        object1.attackBox.position.y <= object2.position.y + object2.height
    )
    {
        return true;
    }
    else return false;
}

let timer = 60;
let timerId;

function decreaseTimer()
{
    if (timer > 0)
    {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if (timer === 0)
    {
        determineWinner({ player, enemy });
    }

}

function determineWinner({ player, enemy })
{
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';

    if (player.health === enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'Draw';
    }
    else if (player.health > enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    }
    else if (player.health < enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

export { rectangularCollision, determineWinner, decreaseTimer }
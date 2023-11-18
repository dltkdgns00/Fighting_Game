import { ctx, canvas, gravity } from './index.js';

class Fighter
{
    constructor({ position, velocity, color, offset })
    {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey = '';
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking;
        this.isJumping;
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
                this.attackBox.height);
        }
    }

    update()
    {
        this.draw();
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + 50;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96)
        {
            this.velocity.y = 0;
            this.isJumping = false;
        } else 
        {
            this.velocity.y += gravity;
            this.isJumping = true;
        }
    }

    attack()
    {
        this.isAttacking = true;
        setTimeout(() =>
        {
            this.isAttacking = false;
        }, 100);
    }
}

class Sprite
{
    constructor({ position, imageSrc, scale = 1, framesMax = 1 })
    {
        this.position = position;
        this.width;
        this.height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
    }

    draw()
    {
        ctx.drawImage
            (
                this.image,
                this.framesCurrent * (this.image.width / this.framesMax),
                0,
                this.image.width / this.framesMax,
                this.image.height,

                this.position.x,
                this.position.y,
                (this.image.width / this.framesMax) * this.scale,
                this.image.height * this.scale
            );
    }

    update()
    {
        this.draw();
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0)
        {
            if (this.framesCurrent < this.framesMax - 1)
            {
                this.framesCurrent++;
            } else
            {
                this.framesCurrent = 0;
            }
        }
    }
}

export { Fighter, Sprite }
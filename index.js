const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)//bu background için alan tanımlıyo ilk 2 girdi başlayacağı x,y kordinatı son iki girdi ise boyut 
const gravity = 0.5
const background = new sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png',


})
const shop = new sprite({
    position: {
        x: 660,
        y: 226
    },
    scale: 2,
    imageSrc: './img/shop_anim.png',
    framesMax: 6



})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0

    },
    imageSrc: './img/Samuray/Idle.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 110,
        y: 95
    },
    sprites: {
        idle: {
            imageSrc: './img/Samuray/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/Samuray/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Samuray/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Samuray/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/Samuray/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/Samuray/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/Samuray/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 115,
            y: 50
        },
        width: 150,
        height: 50

    }
})

const enemy = new Fighter({
    position: {
        x: 400, y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    imageSrc: './img/Ninja/Idle.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: 110,
        y: 105
    },
    sprites: {
        idle: {
            imageSrc: './img/Ninja/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/Ninja/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/Ninja/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/Ninja/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/Ninja/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/Ninja/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/Ninja/Death.png',
            framesMax: 7
        }
    },
    attackBox:
    {
        offset: {
            x: -78,
            y: 50
        },
        width: 170,
        height: 50

    }
})

// console.log(player)//test amaçlı

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }



}
function animate() {

    window.requestAnimationFrame(animate)//ekranı yeniden boyuyan bir çağrı saniyede 60 normalde ama pil ömrü için düşürülebilir
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player movement

    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -4
        player.switchSprite('run')


    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 4
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //Zıplama ve düşme
    if (player.velocity.y < 0) {
        player.switchSprite('jump')

    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    //Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -4
        enemy.switchSprite('run')

    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 4
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    //Attack algılama && hasar efekti
    if (rectangularCollesion({ rectangel1: player, rectangel2: enemy }) && player.isAttacking && player.frameCurrent === 4) //burdaki son iki and önemli samurayın görseli fazla olduğu için attack animasyonu geç gerçekleşiyor bunu hızlandıran burdaki sistem
    {
        enemy.takeHit()
        player.isAttacking = false//Milisaniye cinsinden olduğu için zaman bu aralıkta rakibe 20 kere vuruyo bunu 1 kere vurmaya çevirmek için 

        document.querySelector('#enemyHealt').style.width = enemy.health + '%'
    }
    // player ıskalarsa
    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    if (rectangularCollesion({ rectangel1: enemy, rectangel2: player }) && enemy.isAttacking && enemy.frameCurrent === 2) {
        player.takeHit()
        enemy.isAttacking = false//Milisaniye cinsinden olduğu için zaman bu aralıkta rakibe 20 kere vuruyo bunu 1 kere vurmaya çevirmek için

        document.querySelector('#playerHealth').style.width = player.health + '%'
        //console.log(' enemy attack');
    }
    // enmy ıskalarsa
    if (enemy.isAttacking && enemy.frameCurrent === 2) {//2.animasyonda vurma efekti var 
        enemy.isAttacking = false
    }
    // OYUN SONU CAN BİTMESİ DURUMU
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerID })

    }
}



animate()
decreasTimer()
window.addEventListener('keydown', (event) => {//basılan tuşu algılamak için 
    switch (event.key) {
        //Player
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':

            keys.a.pressed = true
            player.lastKey = 'a'
            break

        case 'w':
            if (player.position.y >= 190) {

                player.velocity.y = -12

            }

            break
        case 'j':
            player.attack()
            break

        //Enemy
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'

            break
        case 'ArrowRight':

            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'

            break

        case 'ArrowUp':
            if (enemy.position.y >= 190) {
                enemy.velocity.y = -12
            }

            break
        case ' ':
            enemy.attack()
            break

    }

})
window.addEventListener('keyup', (event) => {//basılan tuşu algılamak için 
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

    }

    //enemy key
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break

    }

})
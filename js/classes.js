class sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.framesElapsed = 0

        this.framesHold = 10//Milisaniye cinsinden durmadan çizdiği için absürt bir hızda bacadan duman çıkıyodu bunu engellemek için Elepsed di holda göre modunu aldırdık
        this.offset = offset

    }



    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax), //background 6lı çerçeveye dahil olmasın diye backgroun 1024px/1 den hep aynı çerçevede halcak 
            0,
            this.image.width / this.framesMax,// 6 lı animasyon resmini tek çerçeve yapmak için 
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale, // 6 lı animasyon resmini tek çerçeve yapmak için 
            this.image.height * this.scale)//resmin boyutunuda ayarlamak için 2 argüman daha koyabilirsin 

    }

    animateFrames() {

        this.framesElapsed++
        if (this.framesElapsed % this.framesHold == 0) {//bu kod shopun çizim hızını yavaşlatıyo

            if (this.frameCurrent < this.framesMax - 1) {//-1 olayı backgroundın tekrar çizimini engelliyo sadece shop tekrar çiziliyo bu sayede
                this.frameCurrent++
            } else {
                this.frameCurrent = 0
            }
        }
    }
    update() {
        this.draw()
        this.animateFrames()
    }


}
class Fighter extends sprite { // sprite sınıfınıda bu sınıfa dahil ettik sınıfı genişlettik 
    constructor({ position, velocity, color = 'red', offset = { x: 0, y: 0 }, imageSrc,
        scale = 1, framesMax = 1,
        sprites, attackBox = { offset: {}, width: undefined, height: undefined } }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset



        })

        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y

            },
            offset: attackBox.offset,

            width: attackBox.width,
            height: attackBox.height

        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.frameCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 12
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }


    update() {

        this.draw()
        if(!this.dead)this.animateFrames()
        
        //attackbox
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        //         //attackBoxları görmek için satır
        // c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity // yerçekimi


    }
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true


    }
    takeHit() {
       
        this.health -= 10

        if (this.health <= 0) {
            this.switchSprite('death')
        } else this.switchSprite('takeHit')
    }

    switchSprite(sprite) {



        // ölüm efekti öncelik için 
        if (this.image === this.sprites.death.image){
            if(this.frameCurrent===this.sprites.death.framesMax-1)
            this.dead=true
            return} 


        if (this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.framesMax - 1) return //Durmadan saldırmayı engelliyo && sonrası


        if (this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax - 1) return//Vurma efekti için

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
                break


            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
                break

            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
                break

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.frameCurrent = 0
                }
                break
        }
    }
}
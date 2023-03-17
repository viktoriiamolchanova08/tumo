


function setup() {
    createCanvas(400, 400)
    Game.addCommonBalloon()
}

function draw() {
    background('skyblue')

    for (const balloon of Game.balloons) {
        balloon.display()
        balloon.move(Game.score)

        if (balloon.y <= balloon.size/2 && balloon.color != 'black' && balloon.color != 'yellow') {
            noLoop()
            clearInterval(interval)
            Game.balloons.length = 0   
            let score = Game.score
            Game.score = ''
            background(102, 205, 170)//(136, 220, 166)

            textSize(65)
            fill('white')
            textAlign(CENTER, CENTER)
            text('RESTART', 200, 200)

            textSize(34)
            text('Score:' + score, 200, 300)
        }
    }

    textSize(35)
    fill('black')
    text(Game.score, 20, 40)

    if (frameCount % 60 == 0) {
        Game.addCommonBalloon()
    }
    if (frameCount % 170 == 0) {
        Game.addUniqBalloon()
    }
    if (frameCount % 102 == 0) {
        Game.addBadBalloon()
    }
    if (frameCount % 300 == 0) {
        Game.addGoldBalloon()
    }

    
}

function mousePressed() {
    if (isLooping() == false) {
        loop()
        Game.score = 0
        Game.countOfBlack = 0
        Game.countOfBlue = 0
        Game.countOfGreen = 0
        Game.countOfGold = 0
        Game.countOfClick = 0

        interval = setInterval(() => {
            Game.sendStatistics()
        }, 5000)
    }
    Game.countOfClick += 1
    Game.checkIfBalloonBurst()
}

let interval = setInterval(() => {
    Game.sendStatistics()
}, 5000);

class Game {
    static balloons = []
    static score = 0
    static countOfGreen = 0
    static countOfBlue = 0
    static countOfBlack = 0
    static countOfGold = 0
    static countOfClick = 0

    static sendStatistics() {
        let stats = {
            score: this.score,
            countOfGreen: this.countOfGreen,
            countOfBlue: this.countOfBlue,
            countOfBlack: this.countOfBlack,
            countOfGold: this.countOfGold,
            countOfClick: this.countOfClick,
            
        };

        fetch('/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',        
            },
            body: JSON.stringify(stats),
        });
    }


    static addCommonBalloon() {
        let balloon = new CommonBalloon('blue', 50)
        this.balloons.push(balloon)
    }

    static addUniqBalloon() {
        let balloon = new UniqBalloon('purple', 45)
        this.balloons.push(balloon)
    }

    static addBadBalloon() {
        let balloon = new BadBalloon('black', 50)
        this.balloons.push(balloon)
    }

    static addGoldBalloon() {
        let balloon = new GoldBalloon('yellow', 15)
        this.balloons.push(balloon)
    }

    static checkIfBalloonBurst() {
        this.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if (distance <= balloon.size / 2) {
                balloon.burst(index)
            }
        });
    }
}


 class CommonBalloon {
    constructor(color, size) {
        this.x = random(width);
        this.y = random(height - 10, height + 50);
        this.color = color
        this.size = size
    }

    display() {
        fill(this.color)
        ellipse(this.x, this.y, this.size)
        line(this.x, this.y + this.size/2, this.x, this.y + 2 * this.size)
    }

     move(score) {
        if (score < 100) {
            this.y -= 2
        } else if (score > 100 && score < 200) {
            this.y -= 3
        } else {
            this.y -= 4
        }
     }

     burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += 1
        Game.countOfBlue += 1
     }
}

class UniqBalloon extends CommonBalloon {
    constructor(color, size) {
        super(color, size)
    }
    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += 5
        Game.countOfGreen += 1
     }

}

class BadBalloon extends CommonBalloon {
    constructor(color, size) {
        super(color, size)
    }
    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score -= 10
        Game.countOfBlack += 1
     }

}

class GoldBalloon extends CommonBalloon {
    constructor(color, size) {
        super(color, size)
    }
    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += 20
        Game.countOfGold += 1
    }

}


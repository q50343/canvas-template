// 環境變數
let updateFPS = 30
let time = 0
let bgColor = '#000'
// -----------
// Vec2
class Vec2{
    constructor(x = 0,y = 0) {
        this.x = x
        this.y = y
    }
    set(x,y) {
        this.x = x
        this.y = y
    }
    add(v) {
        return new Vec2(this.x + v.x,this.y + v.y)
    }
    sub(v) {
        return new Vec2(this.x - v.x,this.y - v.y)
    }
    mul(s) {
        return new Vec2(this.x * s,this.y * s)
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    set length(nv) {
        let temp = this.unit.mul(nv)
        this.set(temp.x,temp.y)
    }
    clone() {
        return new Vec2(this.x,this.y)
    }
    toString() {
        return `${this.x},${this.y}`
    }
    equal(v) {
        return this.x === v.x && this.y === v.y
    }
    get angle() {
        return Math.atan2(this.y,this.x)
    }
    get unit() {
        return this.mul(1/this.length)
    }
}

let degToPi = Math.PI / 180
class Circle{
    constructor(args){
        let def = {
            p: new Vec2(),
            r: 100,
            color: '#fff',
            lineTo: (obj,i) => {
                return true
            },
            getWidth: (obj,i) => {
                return 1
            },
            anglePan: (obj,i) => {
                return 0
            },
            vertical: false,
            getVerticalWidth: (obj,i) => {
                return 2
            },
            ramp: 0
        }
        Object.assign(def,args)
        Object.assign(this,def)
    }
    draw(){
        ctx.beginPath()
        for(let i = 1;i <= 360;i++) {
            let angle1 = i + this.anglePan()
            let angle2 = i - 1 + this.anglePan()
            let use_r = this.r + this.ramp * Math.sin(i/10)
            let use_r2 = this.r + this.ramp * Math.sin((i-1)/10)

            let x1 = use_r * Math.cos(angle1 * degToPi)
            let y1 = use_r * Math.sin(angle1 * degToPi)
            let x2 = use_r2 * Math.cos(angle2 * degToPi)
            let y2 = use_r2 * Math.sin(angle2 * degToPi)
            
            if (this.lineTo(this,i)) {
                ctx.beginPath()
                ctx.line(new Vec2(x1,y1),new Vec2(x2,y2))
                ctx.strokeStyle = this.color
                ctx.lineWidth = this.getWidth(this,i)
                ctx.stroke()
            }
            if (this.vertical) {
                let l = this.getVerticalWidth(this,i)
                let x3 = (use_r + l) * Math.cos(angle1 * degToPi)
                let y3 = (use_r + l) * Math.sin(angle1 * degToPi)

                ctx.beginPath()
                ctx.line(new Vec2(x1,y1),new Vec2(x3,y3))
                ctx.strokeStyle = this.color
                ctx.lineWidth = this.getWidth(this,i)
                ctx.stroke()
            }
        }
    }
}

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
ctx.circle = function(v,r,color) {
    this.beginPath()
    this.fillStyle = color
    this.arc(v.x,v.y,r,0,Math.PI*2)
    this.fill()
}
ctx.line = function(v1,v2) {
    this.moveTo(v1.x,v1.y)
    this.lineTo(v2.x,v2.y)
}
let ww
let wh
function initCanvas() {
    ww = canvas.width = window.innerWidth
    wh = canvas.height = window.innerHeight
}
let cirs = []

function init() {
    cirs.push(new Circle({
        r: 150,
        color: 'rgba(255,255,255,0.4)'
    }))
    cirs.push(new Circle({
        r: 220,
        lineTo:(obj,i) => {
            return i % 2 === 0
        },
        color: 'rgba(255,255,255,1)'
    }))
    cirs.push(new Circle({
        r: 80,
        lineTo:(obj,i) => {
            return i % 180 > 30
        }
    }))
    cirs.push(new Circle({
        r: 320,
        ramp: 15,
        color: 'rgba(255,255,255,1)'
    }))
    cirs.push(new Circle({
        r: 190,
        ramp: 0,
        getWidth:(obj,i) => {
            return i % 150 < 30 ? 5 : 1
        }
    }))
    cirs.push(new Circle({
        r: 300,
        ramp: 0,
        vertical: true,
        lineTo:(obj,i) => {
            return false
        },
        getVerticalWidth:(obj,i) => {
            return i % 10 === 0 ? 10 : i % 5 === 0 ? 5 : 2
        },
        anglePan:(obj,i) => {
            return 40 * Math.sin(time/200)
        }
    }))
    cirs.push(new Circle({
        r: 280,
        lineTo:(obj,i) => {
            return i % 50 === 0
        },
        getWidth:(obj,i) => {
            return 10
        },
        anglePan:(obj,i) => {
            return (-time/20) % 5
        }
    }))

}
function update() {
    time++
}
function draw() {
    // 清空背景
    ctx.fillStyle = bgColor
    ctx.fillRect(0,0,ww,wh)
    // --------
    ctx.save()
        ctx.translate(ww/2,wh/2)
        cirs.forEach(c => {
            ctx.save()
                let pan = mousePos.sub(new Vec2(ww/2,wh/2)).mul(3/c.r)
                ctx.translate(pan.x,pan.y)
                c.draw()
            ctx.restore()
        })

        ctx.fillStyle = '#fff'
        ctx.fillRect(0,-20,120,20)
        ctx.fillStyle = '#000'
        ctx.fillText(Date.now(),5,-5)
        // 指針
        let h = new Date().getHours()
        let m = new Date().getMinutes()
        let s = new Date().getSeconds()

        let angleH = degToPi * 30 * h - Math.PI / 2
        let angleM = degToPi * 6 * m - Math.PI / 2
        let angleS = degToPi * 6 * s - Math.PI / 2

        ctx.line(new Vec2(0,0),new Vec2(50*Math.cos(angleH),50*Math.sin(angleH)))
        ctx.lineWidth = 5
        ctx.strokeStyle = 'red'
        ctx.stroke()

        ctx.beginPath()
        ctx.line(new Vec2(0,0),new Vec2(100*Math.cos(angleM),100*Math.sin(angleM)))
        ctx.lineWidth = 2
        ctx.strokeStyle = '#fff'
        ctx.stroke()

        ctx.beginPath()
        ctx.line(new Vec2(0,0),new Vec2(150*Math.cos(angleS),150*Math.sin(angleS)))
        ctx.lineWidth = 1
        ctx.strokeStyle = '#fff'
        ctx.stroke()
    ctx.restore()
    // 十字
    let crosses = [
        new Vec2(50,50),
        new Vec2(ww-50,50),
        new Vec2(50,wh-50),
        new Vec2(ww-50,wh-50)
    ]

    crosses.forEach(c => {
        ctx.beginPath()
        ctx.save()
            ctx.translate(c.x,c.y)
            ctx.line(new Vec2(-10,0),new Vec2(10,0))
            ctx.line(new Vec2(0,-10),new Vec2(0,10))
            ctx.lineWidth = 2
            ctx.strokeStyle = '#fff'
            ctx.stroke()
        ctx.restore()
    })

    // ----------
    ctx.circle(mousePos,3,'red')
    
    ctx.save()
    ctx.translate(mousePos.x,mousePos.y)
        ctx.strokeStyle = 'red'
        let len = 20
        ctx.line(new Vec2(-len,0),new Vec2(len,0))
        ctx.fillText(mousePos,10,-10)
        ctx.rotate(Math.PI/2)
        ctx.line(new Vec2(-len,0),new Vec2(len,0))
        ctx.stroke()
    ctx.restore()

    requestAnimationFrame(draw)
}
function loaded() {
    initCanvas()
    init()
    requestAnimationFrame(draw)
    setInterval(update,1000 / updateFPS)
}

let mousePos = new Vec2(0,0)
let mousePosDown = new Vec2(0,0)
let mousePosUp = new Vec2(0,0)

window.addEventListener('load',loaded)
window.addEventListener('resize',initCanvas)

window.addEventListener('mousedown',mousedown)
window.addEventListener('mouseup',mouseup)
window.addEventListener('mousemove',mousemove)

function mousemove(e) {
    mousePos.set(e.x,e.y)
}
function mouseup(e) {
    mousePos.set(e.x,e.y)
    mousePosUp = mousePos.clone()
}
function mousedown(e) {
    mousePos.set(e.x,e.y)
    mousePosDown = mousePos.clone()
    
}
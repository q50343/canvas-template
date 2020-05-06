// 環境變數
let updateFPS = 30
let showMouse = true
let time = 0
let bgColor = '#000'

// 控制
let controls = {
    value: 0
}
let gui = new dat.GUI()
gui.add(controls,'value',-2,2).step(0.01).onChange(value => {

})

// -----------
// Vec2
class Vec2{
    constructor(x,y) {
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
    sub(s) {
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

function init() {

}
function update() {
    
}
function draw() {
    // 清空背景
    ctx.fillStyle = bgColor
    ctx.fillRect(0,0,ww,wh)
    // --------

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
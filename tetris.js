document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid')  
    let squares = Array.from(document.querySelectorAll('.grid div'))
    let miniSquares = document.querySelectorAll('.miniGrid div')
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#startBtn') 
    const width = 10   
    const miniGridWidth = 4
    const lineCountScore = document.querySelector('#lineScore')
    const levelTagEl = document.querySelector('#levelTag')
    let currentPosition = 4
    let currentRotation = 0
    let miniIndex = 0
    let nextRandom = 0
    let timerId
    let score = 0
    let level = 1
    levelTagEl.innerText = 'Level: 1'
    let lineCount = 0
    const colors = [
        'hsla(9, 100%, 64%, 0.6)',
        'hsla(311, 100%, 50%, 0.6)',
        'hsla(46, 100%, 44%, 0.6)',
        'hsla(150, 100%, 50%, 0.6)',
        'hsla(212, 100%, 50%, 0.6)'
    ]
    
    //Play pieces

    const L_tetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const I_tetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]
    const Z_tetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ]
    const T_tetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ]
    const O_tetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]
    const theTetrominoes = [L_tetromino, Z_tetromino, T_tetromino, O_tetromino, I_tetromino]

    

// randomly select a shape and it's first rotation

let random = Math.floor(Math.random()*theTetrominoes.length)

    let current = theTetrominoes[random][0]

// draw the first rotation in the first shape
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
            squares[currentPosition + index].style.border = '1px solid #333'
        })
    }


    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
            squares[currentPosition + index].style.border = ''
        })
    }


//create automatic downward movement

// timerId = setInterval(moveDown, 500)

//assign functions to keycodes
function control(e){
    if (e.keyCode === 37){
        moveLeft()
    } else if (e.keyCode === 38){
        rotate()
    }else if (e.keyCode === 39){
        moveRight()
    }else if (e.keyCode === 40){
        moveDown()
    }
}

document.addEventListener('keyup', control)
//move down function
function moveDown(){
    undraw()
    currentPosition += width
    draw()
    freeze()
}


//make shapes stop at the bottom
function freeze(){
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new shape falling
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}


//function to Move Left
function moveLeft(){
    undraw()
    // const isAtLeft = current.some(index => (currentPosition + index) % width === 0)

    // if(!isAtLeft) 
    
    currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition += 1
    }
    draw()
}

//function to Move Right
function moveRight(){
    undraw()
    // const isAtRight = current.some(index => (currentPosition + index) % width === width - 1)

    // if(!isAtRight) 
    
    currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -= 1
    }
    draw()
}

//function to Rotate
function rotate(){
    undraw()
    currentRotation ++
    if (currentRotation === current.length){
        currentRotation = 0
    }  
   
    current = theTetrominoes[random][currentRotation]
    draw()
}


//tetrominoes without rotation for miniGrid

const upNextPieces = [
    [1, miniGridWidth+1, miniGridWidth*2+1, 2],
    [0, miniGridWidth, miniGridWidth+1, miniGridWidth*2+1],
    [1, miniGridWidth, miniGridWidth+1, miniGridWidth+2],
    [0, 1, miniGridWidth, miniGridWidth+1],
    [1, miniGridWidth+1, miniGridWidth*2+1, miniGridWidth*3+1]
]


//display shapes in miniGrid
function displayShape(){
    miniSquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
        // squares.style.border = ''
    })
    upNextPieces[nextRandom].forEach( index =>{
        miniSquares[miniIndex + index].classList.add('tetromino')
        miniSquares[miniIndex + index].style.backgroundColor = colors[nextRandom]
        // miniSquares[miniIndex + index].style.border = '1px solid #333'
    })
}

startButton.addEventListener("click", () =>{
if (timerId){
    clearInterval(timerId)
    timerId = null
}else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
}
})


// add score function
function addScore(){
    for (let i = 0; i < 199; i+= width){
const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

if (row.every(index => squares[index].classList.contains('taken'))){
    if (lineCount < 10) {
        score += 10
    } else if (lineCount < 20){
        score += 50
        timerId = setInterval(moveDown, 900)
        levelTagEl.innerText = 'Level: 2'
    }else if (lineCount < 30){
        score += 100
        timerId = setInterval(moveDown, 800)
        levelTagEl.innerText = 'Level: 3'
    }else if (lineCount < 50){
        score += 1000
        timerId = setInterval(moveDown, 700)
        levelTagEl.innerText = 'Level: 4'
    }else if (lineCount < 75){
        score += 2500
        timerId = setInterval(moveDown, 600)
        levelTagEl.innerText = 'Level: 5'
    }else if (lineCount < 100){
        score += 5000
        timerId = setInterval(moveDown, 500)
        levelTagEl.innerText = 'Level: Ninja'
    }

    lineCount++
    scoreDisplay.innerHTML = score
    lineCountScore.innerHTML = lineCount 
    row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor = ''
        squares[index].style.border = ''
    })
    const squaresRemoved = squares.splice(i, width)
    squares = squaresRemoved.concat(squares)
    squares.forEach(cell => grid.appendChild(cell))

        }
    }
}


//game over function
function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = score + ' <br> Game Over'
        clearInterval(timerId)
    }
}


})
let sizeX = 20;
let sizeY = 20;
let breakGenerating = false;
let countOfRunningGenerators = 0;
const mazeElementArray = [];
const mazeArray = [];

let totalHeight = 0;

function generateMap() {
    sizeX = document.getElementById('xSize').value;
    sizeY = document.getElementById('ySize').value;
    totalHeight = 0;
    const mazeGrid = document.getElementById('mazeGrid');
    mazeGrid.innerHTML = '';
    mazeGrid.style.gridTemplateColumns = 'repeat(' + sizeX + ', 1fr)';

    //Declaring maze arrays
    for (let i = 0; i < sizeX; i++) {
        mazeElementArray[i] = [];
        mazeArray[i] = [];
    }

    //Generating map
    for (let y = 0; y < sizeY; y++) {
        totalHeight += (70 - 0.2 * Math.max(sizeX, sizeY)) / Math.max(sizeX, sizeY) + 0.2;
        for (let x = 0; x < sizeX; x++) {
            const mazeCell = document.createElement('div');
            mazeCell.id = 'cell' + '-x' + x + '-y' + y;
            let size = 'min(' + (70 - 0.2 * sizeY) / sizeY + 'vh, ' + (70 - 0.2 * sizeX) / sizeX + 'vw)'
            mazeCell.style.width = size;
            mazeCell.style.height = size;
            mazeCell.classList.add('mazeCell', 'leftBorder', 'rightBorder', 'topBorder', 'bottomBorder');
            mazeGrid.append(mazeCell);
            mazeElementArray[x][y] = mazeCell;
            mazeArray[x][y] = { left: true, right: true, top: true, bottom: true, passed: false };
        }
    }

    //Enabling generate button
    document.getElementById('generateButton').disabled = false;
}

async function generateMaze() {
    breakGenerating = true;

    //Waiting for generating to stop
    while (countOfRunningGenerators > 0) {
        await new Promise(r => setTimeout(r, 100));
    }

    breakGenerating = false;
    countOfRunningGenerators++;

    //Disabling generate button
    document.getElementById('generateButton').disabled = true;

    let startX = Math.floor(Math.random() * sizeX);
    let startY = Math.floor(Math.random() * sizeY);

    let cellStack = [{ x: startX, y: startY }];

    const speed = document.getElementById('speed');

    while (cellStack.length > 0 && !breakGenerating) {
        const currentPosition = cellStack.pop();
        const possibleDirections = [];

        if (currentPosition.x + 1 < sizeX && !mazeElementArray[currentPosition.x + 1][currentPosition.y].passed)
            possibleDirections.push("right");
        if (currentPosition.x - 1 >= 0 && !mazeElementArray[currentPosition.x - 1][currentPosition.y].passed)
            possibleDirections.push("left");
        if (currentPosition.y + 1 < sizeY && !mazeElementArray[currentPosition.x][currentPosition.y + 1].passed)
            possibleDirections.push("bottom");
        if (currentPosition.y - 1 >= 0 && !mazeElementArray[currentPosition.x][currentPosition.y - 1].passed)
            possibleDirections.push("top");

        if (possibleDirections.length > 0) {
            if (possibleDirections.length > 1)
                cellStack.push(currentPosition);

            await new Promise(r => setTimeout(r, (Math.log2(1000) - Math.log2(speed.value)) * 30));

            let selectedDirection = Math.floor(Math.random() * possibleDirections.length);

            if (possibleDirections[selectedDirection] === "left") {
                mazeElementArray[currentPosition.x][currentPosition.y].classList.remove('leftBorder');
                mazeArray[currentPosition.x][currentPosition.y].left = false;
                mazeElementArray[currentPosition.x - 1][currentPosition.y].classList.remove('rightBorder');
                mazeArray[currentPosition.x - 1][currentPosition.y].right = false;
                cellStack.push({ x: currentPosition.x - 1, y: currentPosition.y });
            }
            else if (possibleDirections[selectedDirection] === "right") {
                mazeElementArray[currentPosition.x][currentPosition.y].classList.remove('rightBorder');
                mazeArray[currentPosition.x][currentPosition.y].right = false;
                mazeElementArray[currentPosition.x + 1][currentPosition.y].classList.remove('leftBorder');
                mazeArray[currentPosition.x + 1][currentPosition.y].left = false;
                cellStack.push({ x: currentPosition.x + 1, y: currentPosition.y });
            }
            else if (possibleDirections[selectedDirection] === "top") {
                mazeElementArray[currentPosition.x][currentPosition.y].classList.remove('topBorder');
                mazeArray[currentPosition.x][currentPosition.y].top = false;
                mazeElementArray[currentPosition.x][currentPosition.y - 1].classList.remove('bottomBorder');
                mazeArray[currentPosition.x][currentPosition.y - 1].bottom = false;
                cellStack.push({ x: currentPosition.x, y: currentPosition.y - 1 });
            }
            else if (possibleDirections[selectedDirection] === "bottom") {
                mazeElementArray[currentPosition.x][currentPosition.y].classList.remove('bottomBorder');
                mazeArray[currentPosition.x][currentPosition.y].bottom = false;
                mazeElementArray[currentPosition.x][currentPosition.y + 1].classList.remove('topBorder');
                mazeArray[currentPosition.x][currentPosition.y + 1].top = false;
                cellStack.push({ x: currentPosition.x, y: currentPosition.y + 1 });
            }
        }

        mazeElementArray[currentPosition.x][currentPosition.y].passed = true;
    }

    countOfRunningGenerators--;
}

async function changeSize() {
    breakGenerating = true;

    //Waiting for generating to stop
    while (countOfRunningGenerators > 0) {
        await new Promise(r => setTimeout(r, 100));
    }

    generateMap();
}

generateMap();
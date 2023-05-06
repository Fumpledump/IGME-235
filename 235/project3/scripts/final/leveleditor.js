
document.addEventListener('DOMContentLoaded', () => {
    const editorCols = 30;
    const editorRows = 20;
    const editorWidth = 32;
    const editorSpacing = 1;

    const levelContainer = document.querySelector("#levelEditorGrid");
    const outputtedLevelData = document.querySelector("#outputtedLevelData");

    const span = document.createElement('span');
    span.className = 'cell';

    const levelCells = [];
    let levelData = []; // Level Editor Stored Tiels

    const editorOutputButton = document.getElementById('editorOutputButton');

    for(let row = 0; row<editorRows; row++)
    {
        levelCells.push([]);
        levelData.push([]);
        for(let col = 0; col<editorCols; col++)
        {
            let cell = span.cloneNode();
            cell.style.left = `${col * (editorWidth + editorSpacing)}px`;
            cell.style.top = `${row * (editorWidth + editorSpacing)}px`;
            levelContainer.appendChild(cell);
            levelCells[row][col] = cell;

            levelData[row][col] = -1;
        }
    }

    let tile = "wall";
    levelContainer.onclick = fillCell;

    function fillCell(e)
    {
        let rect = levelContainer.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;
        let levelColumnWidth = editorWidth + editorSpacing;
        let col = Math.floor(mouseX/levelColumnWidth); 
        let row = Math.floor(mouseY/levelColumnWidth);
        let selectedCell = levelCells[row][col];
        let currentTile = selectedCell.classList[1];
        selectedCell.classList.remove(currentTile);

        if(tile != "erase")
        {
            selectedCell.classList.add(tile);
        }
        console.log(levelData);

        // Store Data
        let tileData = -1

        // Get Tile Data
        switch(tile)
        {
            case "wall":
                tileData = 1;
                break;
            case "floor":
                tileData = 0;
                break;
            case "grass":
                tileData = 2;
                break;
            case "water":
                tileData = 3;
                break;
            case "ground":
                tileData = 4;
                break;
            case "rock":
                tileData = 5;
                break;
        }

        levelData[row][col] = tileData;
    }

    let mouseIsDown = false;

    levelContainer.onmousemove = (e) => {
        e.preventDefault();
        if(mouseIsDown) fillCell(e);
    };

    levelContainer.onmousedown = (e) => {
        e.preventDefault();
        mouseIsDown = true;
    };

    levelContainer.onmouseup = (e) => {
        e.preventDefault();
        mouseIsDown = false;
    };

    document.querySelector('#tileChooser').onchange = (e)=> {
        tile = e.target.value;
    };

    editorOutputButton.addEventListener('click', () => {
          // Find rows and columns to ignore
        const ignoreRows = [];
        const ignoreCols = [];
        for (let i = 0; i < levelData.length; i++) {
            let ignoreRow = true;
            for (let j = 0; j < levelData[i].length; j++) {
            if (levelData[i][j] !== -1) {
                ignoreRow = false;
                break;
            }
            }
            if (ignoreRow) {
            ignoreRows.push(i);
            }
        }
        for (let j = 0; j < levelData[0].length; j++) {
            let ignoreCol = true;
            for (let i = 0; i < levelData.length; i++) {
            if (levelData[i][j] !== -1) {
                ignoreCol = false;
                break;
            }
            }
            if (ignoreCol) {
            ignoreCols.push(j);
            }
        }

        // Create new 2D array with non-negative values
        const nonNegativeData = [];
        for (let i = 0; i < levelData.length; i++) {
            if (!ignoreRows.includes(i)) {
            const row = [];
            for (let j = 0; j < levelData[i].length; j++) {
                if (!ignoreCols.includes(j) && levelData[i][j] !== -1) {
                row.push(levelData[i][j]);
                }
            }
            nonNegativeData.push(row);
            }
        }


        outputtedLevelData.innerHTML = JSON.stringify(nonNegativeData);
    });
});


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
            case "floor_grass":
                tileData = 6;
                break;                
            case "floor_tree":
                tileData = 7;
                break;                
            case "floor_boulder":
                tileData = 8;
                break;                
            case "floor_cliff":
                tileData = 9;
                break;                
            case "floor_dead_tree":
                tileData = 10;
                break;                
            case "dungeon_entrance":
                tileData = 11;
                break;                
            case "dungen_top":
                tileData = 12;
                break;                
            case "grass_cliff":
                tileData = 13;
                break;
            case "grass_tree":
                tileData = 14;
                break;
            case "grass_boulder":
                tileData = 15;
                break;
            case "grass_flowers_red":
                tileData = 16;
                break;
            case "grass_flowers_yellow":
                tileData = 17;
                break;
            case "ground_cliff":
                tileData = 18;
                break;                
            case "ground_grass":
                tileData = 19;
                break;                
            case "ground_boulder":
                tileData = 20;
                break;                
            case "ground_door":
                tileData = 21;
                break;                
            case "ground_wave":
                tileData = 22;
                break;                
            case "ground_shield":
                tileData = 23;
            break;
            case "rock_cliff":
                tileData = 24;
            break;
            case "rock_tree":
                tileData = 25;
            break;
            case "rock_grass":
                tileData = 26;
            break;
            case "rock_wave":
                tileData = 27;
            break;
            case "grass_grass":
                tileData = 28;
            break;
            case "dungeon_rocks":
                tileData = 29;
            break;
            case "dungeon_stairs":
                tileData = 30;
            break;
            case "dungeon_lump":
                tileData = 31;
            break;
            case "dungeon_hammer":
                tileData = 32;
            break;
            case "dungeon_blood":
                tileData = 33;
            break;
            case "wall_glow":
                tileData = 34;
            break;
            case "wall_books":
                tileData = 35;
            break;
            case "wall_door":
                tileData = 36;
            break;
            case "wall_timer":
                tileData = 37;
            break;
            case "wall_eye":
                tileData = 38;
            break;
            case "wall_locked":
                tileData = 39;
            break;
            case "wall_mouse":
                tileData = 40;
            break;
            case "ground_tree":
                tileData = 41;
            break;
            case "wire_1":
                tileData = 42;
            break;
            case "wire_2":
                tileData = 43;
            break;
            case "wire_3":
                tileData = 44;
            break;
            case "wire_4":
                tileData = 45;
            break;
            case "wire_5":
                tileData = 46;
            break;
            case "wire_6":
                tileData = 47;
            break;
            case "wire_7":
                tileData = 48;
            break;
            case "wire_8":
                tileData = 49;
            break;
            case "wire_9":
                tileData = 50;
            break;
            case "wire_10":
                tileData = 51;
            break;
            case "wire_11":
                tileData = 52;
            break;
            case "wire_12":
                tileData = 53;
            break;
            case "wire_13":
                tileData = 54;
            break;
            case "wire_14":
                tileData = 55;
            break;
            case "wire_15":
                tileData = 56;
            break;
            case "wire_16":
                tileData = 57;
            break;
            case "wire_17":
                tileData = 58;
            break;
            case "wire_18":
                tileData = 59;
            break;
            case "wire_19":
                tileData = 60;
            break;
            case "wire_20":
                tileData = 61;
            break;
            case "wire_21":
                tileData = 62;
            break;
            case "wire_22":
                tileData = 63;
            break;
            case "wire_23":
                tileData = 64;
            break;
            case "wire_24":
                tileData = 65;
            break;
            case "wire_25":
                tileData = 66;
            break;
            case "wire_26":
                tileData = 67;
            break;
            case "wire_27":
                tileData = 68;
            break;
            case "wire_28":
                tileData = 69;
            break;
            case "wire_29":
                tileData = 70;
            break;
            case "dungeon_stairs_flipped":
                tileData = 71;
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

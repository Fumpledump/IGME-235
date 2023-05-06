

document.addEventListener('DOMContentLoaded', () => {

    // Get references to the buttons and div elements
    const explorerButton = document.getElementById('explorerButton');
    const levelEditorButton = document.getElementById('levelEditorButton');
    const mapExplorerDiv = document.getElementById('Explorer');
    const levelEditorDiv = document.getElementById('Editor');
    const menuDiv = document.getElementById('Menu');

    const leaveEditorButton = document.getElementById('leaveEditorButton');

        // Add click event listeners to the buttons
    explorerButton.addEventListener('click', () => {
        mapExplorerDiv.style.display = 'block';
        levelEditorDiv.style.display = 'none';
        menuDiv.style.display = 'none';
    });

    levelEditorButton.addEventListener('click', () => {
        levelEditorDiv.style.display = 'block';
        mapExplorerDiv.style.display = 'none';
        menuDiv.style.display = 'none';
    });

    leaveEditorButton.addEventListener('click', () => {
        levelEditorDiv.style.display = 'none';
        mapExplorerDiv.style.display = 'none';
        menuDiv.style.display = 'block';
    });

  });
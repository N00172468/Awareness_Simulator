/* 
    ---GLOBAL VARIABLES---
 */

// Molecules:
let molecules = [];
let molKey = [];
const numOfMolecules = 300;

// Radius of Molecules:
const radiusMin = 5;
const radiusMax = 5;

// Grid:
const gridCols = 10;
const gridRows = 4;
let gridWidth;
let gridHeight;
let intersectCount = 0;

// Quarantine Wall Global x-position:
let wallPosX = 180;

// Graph:
let visualHeight = 150;
let graphHeight = 100;
let visualData = [];
let graphLeftOffset = 170;
let graphTopOffset = 27;
let graphWidth = 750;

// GUI:
var guiVars = {
    Grid: false,
    Wall: true,
    Graph: true,
    Social_Distancing: true,
    FPS: false
};

/* 
    ---SETUP FUNCTION---
 */
function setup() {
    createCanvas(1000, 500);
    background(0);

    gridWidth = width / gridCols;
    gridHeight = (height-visualHeight) / gridRows; // Prevents Molecules & Grid to extend graph.
    
    for (let i = 0; i < numOfMolecules; i++) {
        if(i > 0){ // Molecule[0] will always be Infector.
            molecules.push(new Healthy(i));
        } else {
            molecules.push(new Infector(i));
        }
    }

    formation(wallPosX); // Prevents all molecules to spawn outside of Quarantine.
    displayGUI();
    smooth();
    // noLoop();
}

/* 
    ---DRAW FUNCTION---
 */
function draw() {
    background(0);

    make2DArray();
    splitIntoGrids();
    activateMolecule();
    checkIntersections();
    if(guiVars.Grid) drawGrid();
    if(guiVars.Social_Distancing) socialDistancing();
    if(guiVars.Wall) quarantineWall();
    if(guiVars.Graph) renderGraph();
    if(guiVars.FPS) showFPS();

    // Divider Between Molecules and Graph:
    noStroke();
    fill(255)
    rect(0, 350, windowWidth, 10);
}

/* 
    ---ACTIVATE MOLECULE FUNCTION---
    Display molecule class and run its methods.
 */
function activateMolecule() {
    molecules.forEach(molecule => {
        molecule.render();
        molecule.checkEdges();
        molecule.radiateMolecule();
        molecule.reset();
    });
}

/* 
    ---CHECK INTERSECTION FUNCTION---
    Function also checks if molecules are bouncing from each other.
 */
function checkIntersections() {
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            let tempArray = molKey[i][j];
            let numInArray = tempArray.length;

            if (numInArray > 1) {
                for (let z = 0; z < numInArray; z++) {
                    for (let w = z + 1; w < numInArray; w++) {
                        let indexValue01 = tempArray[z];
                        let indexValue02 = tempArray[w];
                        
                        // If primary molecule is intersecting, transform secondary molecule to corresponding sub-class.
                        if(molecules[indexValue01].checkIntersecting(indexValue02)) {
                            molecules[indexValue01].evaluateCondition(indexValue02);  
                        }
                    }
                }
            }
        }
    }
}

/* 
    ---RENDER GRID FUNCTION---
 */
function drawGrid() {
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            noFill();
            strokeWeight(1);
            stroke("#006600");
            rect(j * gridWidth, i * gridHeight, gridWidth, gridHeight);

            let intersectCount = 0;

            let tempArray = molKey[i][j];
            let numArray = tempArray.length;
            
            tempArray.forEach(function (indexValue) {
                if (molecules[indexValue].intersecting == true) {
                    intersectCount++;
                }
            })
            
            // Display Updating No. of Molecules per. Grid:
            noStroke();
            fill("#dbdbdb");
            textSize(16);
            textAlign(RIGHT);
            text(numArray, j * gridWidth + gridWidth - 5, i * gridHeight + 20);
            
            // Display Updating No. of Molecules Intersecting per. Grid:
            fill("#9e0000");
            text(intersectCount, j * gridWidth + gridWidth - 5, i * gridHeight + gridHeight - 5);
        }
    }
}

/* 
    ---SPLIT INTO GRIDS FUNCTION---
    Checks for intersections when applicable.
    Function also tracks on what direction the molecules are coming from.
 */
function splitIntoGrids() {
    molecules.forEach(function (molecule) {
        let iNum = floor(molecule.position.y / gridHeight);
        let jNum = floor(molecule.position.x / gridWidth);
        
        if(iNum < 0) {
            iNum = 0;
        }
        if(iNum > gridRows - 1) {
            iNum = gridRows - 1; 
        }
        if(jNum < 0) {
            jNum = 0;
        }
        if(jNum > gridCols - 1) {
            jNum = gridCols - 1;
        }
        
        molKey[iNum][jNum].push(molecule.arrayPosition);
        
        // West (Left):
        if (molecule.position.x % width < molecule.radius && molecule.position.x > width) {    
            molKey[iNum][jNum - 1].push(molecule.arrayPosition);
            molecule.west = true;
        }
        
        // East (Right):
        if (molecule.position.x % width > width - molecule.radius && molecule.position.x < width - width) {
            molKey[iNum][jNum + 1].push(molecule.arrayPosition);
            molecule.east = true;
        }
        
        // South (Bottom):
        if (molecule.position.y % height < molecule.radius && molecule.position.y > height) {   
            molKey[iNum - 1][jNum].push(molecule.arrayPosition);
            molecule.south = true;
        }
        
        // North (Top):
        if (molecule.position.y % height > height - molecule.radius && molecule.position.y < height - visualHeight - width) {
            molKey[iNum + 1][jNum].push(molecule.arrayPosition);
            molecule.north = true;
        }
        
        // North-West (Top-Left):
        if(molecule.north && molecule.west) { 
            molKey[iNum + 1][jNum - 1].push(molecule.arrayPosition);
        }

        // North-East (Top-Right):
        if(molecule.north && molecule.east) {
            molKey[iNum + 1][jNum + 1].push(molecule.arrayPosition);
        }
        
        // South-West (Bottom-Left):
        if(molecule.south && molecule.west) {
            molKey[iNum - 1][jNum - 1].push(molecule.arrayPosition);
        }
        
        // South-East (Bottom-Right):
        if(molecule.south && molecule.east) {
            molKey[iNum - 1][jNum + 1].push(molecule.arrayPosition);
        }
    });
}

/* 
    ---GRIDIFY FUNCTION---
    Used to spawn molecules evenly within the canvas.
 */
function formation(wallPosX) {
    const iNum = ceil(sqrt(numOfMolecules))
    const jNum = iNum
    
    const gridX = width / iNum;
    const gridY = (height - visualHeight) / jNum;
    
    molecules.map((dat, i) => {
        let iPos = i % iNum;
        let jPos = floor(i / jNum);
        
        // Allows molecules to spawn evenly between the Quarantine Wall.
        // Without this function, all molecules will spawn outside of Quarantine.
        if(iPos * gridX + (gridCols * 5) < wallPosX) {
            dat.isWithinWall = true;
        }
        
        dat.position.x = iPos * gridX + (gridCols * 5);
        dat.position.y = jPos * gridY + (gridRows * 5);
    })
}

/* 
    ---2D ARRAY FUNCTION---
 */
function make2DArray() {
    molKey = [];
    
    for (let i = 0; i < gridRows; i++) {
        molKey.push([]);
        
        for (let j = 0; j < gridCols; j++) {
            molKey[i].push([]);
        }
    }
}

/* 
    ---RENDER GRAPH FUNCTION---
    Includes "shift()" = 
    A function that removes the first element of the array thus reducing the size of the original array by 1.
 */
function renderGraph() {
    // Filter Sub-Classes (Condition of Molecules):
    let healthyStat = molecules.filter(function(molecule) {
        return molecule.constructor.name === "Healthy";    
    });

    let infectedStat = molecules.filter(function(molecule) {
        return molecule.constructor.name === "Infector";    
    });

    let recoveredStat = molecules.filter(function(molecule) {
        return molecule.constructor.name === "Recovered";    
    });

    let fatalStat = molecules.filter(function(molecule) {
        return molecule.constructor.name === "Fatal";    
    });

    // Map Default Data-Height Value to Desired Range:
    let healthyHeight = map(healthyStat.length, 0, numOfMolecules, 0, graphHeight);
    let infectedHeight = map(infectedStat.length, 0, numOfMolecules, 0, graphHeight);
    let recoveredHeight = map(recoveredStat.length, 0, numOfMolecules, 0, graphHeight);
    let fatalHeight = map(fatalStat.length, 0, numOfMolecules, 0, graphHeight);

    if(visualData.length > graphWidth) {
        visualData.shift(); // Shifts data from "visualData" array.
    }

    // Equal stats to height:
    visualData.push({
        healthyStat: healthyHeight, 
        infectedStat: infectedHeight,
        recoveredStat: recoveredHeight,
        fatalStat: fatalHeight
    });

    // Display Updating Visual Graph:
    push()
        translate(0, height - visualHeight);

        visualData.forEach((data, index) => {
            // Healthy Molecules:
            noStroke();
            fill("#4287f5");
            rect(graphLeftOffset + index, graphTopOffset + data.recoveredStat, 1, data.healthyStat);

            // Infected Molecules:
            noStroke();
            fill("#ff3b3b");
            rect(graphLeftOffset + index, graphTopOffset + data.healthyStat + data.recoveredStat, 1, data.infectedStat);

            // Recovered Molecules:
            noStroke();
            fill("#50ff29");
            rect(graphLeftOffset + index, graphTopOffset, 1, data.recoveredStat);

            // Fatal Molecules:
            noStroke();
            fill("#6e6e6e");
            rect(graphLeftOffset + index, graphTopOffset + data.infectedStat + data.healthyStat + data.recoveredStat, 1, data.fatalStat);
        });

        // Display Texted Info:
        textSize(20);
        textAlign(RIGHT);

        fill("#4287f5");
        text("Healthy: " + healthyStat.length, graphLeftOffset - 10, graphTopOffset + 30);
        
        fill("#ff3b3b");
        text("Infected: " + infectedStat.length, graphLeftOffset - 10, graphTopOffset + 50);
        
        fill("#50ff29");
        text("Recovered: " + recoveredStat.length, graphLeftOffset - 10, graphTopOffset + 70);
        
        fill("#6e6e6e");
        text("Fatal: " + fatalStat.length, graphLeftOffset - 10, graphTopOffset + 90);
    pop()
}

/* 
    ---RENDER QUARANTINE WALL FUNCTION---
    Includes small gap at the bottom to allow molecules to pass through.
    This is to simulate the danger of ignoring the quarantine rule, 
 */
function quarantineWall(){
    let wallPosY = 0;
    let wallWidth = 10;
    let wallHeight = windowHeight / 3;

    // Quarantine Wall:
    noStroke();
    fill(255);
    rect(wallPosX, wallPosY, wallWidth, wallHeight);

    molecules.forEach(molecule => {
        // Left Side of Wall:
        if(molecule.isWithinWall) { 
            if(molecule.position.y > wallHeight && molecule.position.x >= wallPosX - 15) {
                molecule.isWithinWall = false; // Allows Molecules to pass through gap from left to right.
            
            } else if(molecule.position.x >= wallPosX - molecule.radius) {
                molecule.position.x = wallPosX - 5; // Prevents molecules from sticking to wall (left side).
                molecule.velocity.x = molecule.velocity.x * -1; //Bounces molecules on left side.
            }

        // Right Side of Wall:    
        } else {
            if(molecule.position.y > wallHeight && molecule.position.x <= wallPosX + 15) {
                molecule.isWithinWall = true; // Allows Molecules to pass through gap from right to left.

            } else if(molecule.position.x <= wallPosX + molecule.radius + wallWidth) {
                molecule.position.x = wallPosX + 15; // Prevents molecules from sticking to wall (right side).
                molecule.velocity.x = molecule.velocity.x * -1; //Bounces molecules on right side.
            }
        }
    });
}

/* 
    ---SOCIAL DISTANCING FUNCTION---
    Used for the GUI.
    Allows user to control the "step()" method of molecules.
    Basic simulation/demonstration of Social Distancing.
 */
function socialDistancing() {
    molecules.forEach(molecule => {
        molecule.step();
    });
}

/* 
    ---DISPLAY GUI FUNCTION---
 */
function displayGUI() {
    let gui = new dat.GUI();
    gui.domElement.id = "gui";

    gui.add(guiVars, "Grid");
    gui.add(guiVars, "Wall");
    gui.add(guiVars, "Graph");
    gui.add(guiVars, "Social_Distancing");
    gui.add(guiVars, "FPS");
}

/* 
    ---SHOW FPS FUNCTION---
    Used for GUI.
    Off by default.
 */
function showFPS() {
    fill(47, 226, 255);
    textSize(11);
    text("FPS: " + frameRate().toFixed(0), 5, 495);
}


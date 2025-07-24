// --- p5.js Sketch ---

let sketch = function(p) {
    // --- Sketch Variables ---
    let symmetry = 8; // Number of symmetrical sections
    let angle; // Angle between sections
    let hueValue = 0; // For cycling through colors
    let brushColor = '#ff0000';
    let bgColor = '#111827';
    let minBrush = 2;
    let maxBrush = 30;
    let brushSize = 6;

    // --- Undo History ---
    let strokes = [];
    let currentStroke = null;

    // --- UI Elements ---
    let symmetrySlider, symmetryValueSpan, clearButton, saveButton, undoButton;
    let brushSizeSlider, brushSizeValueSpan, colorPicker, bgColorPicker, randomColorToggle;

    // --- Setup ---
    p.setup = function() {
        symmetrySlider = document.getElementById('symmetrySlider');
        symmetryValueSpan = document.getElementById('symmetryValue');
        clearButton = document.getElementById('clearButton');
        saveButton = document.getElementById('saveButton');
        undoButton = document.getElementById('undoButton');
        brushSizeSlider = document.getElementById('brushSizeSlider');
        brushSizeValueSpan = document.getElementById('brushSizeValue');
        colorPicker = document.getElementById('colorPicker');
        bgColorPicker = document.getElementById('bgColorPicker');
        randomColorToggle = document.getElementById('randomColorToggle');

        const container = document.getElementById('canvas-container');
        const canvasSize = Math.min(p.windowWidth * 0.8, p.windowHeight * 0.7);
        let canvas = p.createCanvas(canvasSize, canvasSize);
        canvas.parent(container);

        p.angleMode(p.DEGREES);
        p.colorMode(p.RGB, 255, 255, 255, 255);
        p.background(p.color(bgColor));
        angle = 360 / symmetry;

        // --- Event Listeners for Controls ---
        symmetrySlider.addEventListener('input', () => {
            symmetry = symmetrySlider.value;
            symmetryValueSpan.textContent = symmetry;
            angle = 360 / symmetry;
            redrawAll();
        });

        brushSizeSlider.addEventListener('input', () => {
            brushSize = brushSizeSlider.value;
            brushSizeValueSpan.textContent = brushSize;
        });

        colorPicker.addEventListener('input', () => {
            brushColor = colorPicker.value;
        });

        randomColorToggle.addEventListener('change', () => {
            // No action needed, checked state will be read in draw
        });

        bgColorPicker.addEventListener('input', () => {
            bgColor = bgColorPicker.value;
            redrawAll();
        });

        clearButton.addEventListener('click', () => {
            strokes = [];
            redrawAll();
        });

        undoButton.addEventListener('click', () => {
            if (strokes.length > 0) {
                strokes.pop();
                redrawAll();
            }
        });

        saveButton.addEventListener('click', () => {
            p.saveCanvas('kaleidoscope_art', 'png');
        });
    };

    // --- Draw Loop ---
    p.draw = function() {
        p.translate(p.width / 2, p.height / 2);

        if (p.mouseIsPressed && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            if (!currentStroke) {
                currentStroke = {
                    points: [],
                    symmetry: symmetry,
                    angle: angle,
                    brushSize: brushSize,
                    randomColor: randomColorToggle && randomColorToggle.checked,
                    color: brushColor,
                    hueStart: hueValue
                };
            }

            let mx = p.mouseX - p.width / 2;
            let my = p.mouseY - p.height / 2;
            let pmx = p.pmouseX - p.width / 2;
            let pmy = p.pmouseY - p.height / 2;

            // Calculate mouse speed to change brush size
            let speed = p.abs(p.mouseX - p.pmouseX) + p.abs(p.mouseY - p.pmouseY);
            let dynamicBrush = p.map(speed, 0, 20, parseInt(brushSize), Math.max(2, brushSize - 8));

            let colorToUse;
            if (randomColorToggle && randomColorToggle.checked) {
                hueValue = (hueValue + 1) % 360;
                colorToUse = p.color(`hsl(${hueValue}, 80%, 50%)`);
            } else {
                colorToUse = brushColor;
            }

            p.strokeWeight(dynamicBrush);
            p.noFill();
            p.stroke(colorToUse);

            for (let i = 0; i < symmetry; i++) {
                p.rotate(angle);
                p.line(mx, my, pmx, pmy);
                p.push();
                p.scale(1, -1);
                p.line(mx, my, pmx, pmy);
                p.pop();
            }

            // Save this segment to the current stroke
            currentStroke.points.push({
                mx, my, pmx, pmy, dynamicBrush, colorToUse: randomColorToggle && randomColorToggle.checked ? hueValue : brushColor
            });
        } else if (currentStroke) {
            // Mouse released, save the stroke
            strokes.push(currentStroke);
            currentStroke = null;
        }
    };

    // Redraw all strokes from history
    function redrawAll() {
        p.push();
        p.resetMatrix();
        p.background(p.color(bgColor));
        p.translate(p.width / 2, p.height / 2);
        for (let s of strokes) {
            let localHue = s.hueStart || 0;
            for (let pt of s.points) {
                p.strokeWeight(pt.dynamicBrush);
                if (s.randomColor) {
                    localHue = (localHue + 1) % 360;
                    let c = p.color(`hsl(${localHue}, 80%, 50%)`);
                    p.stroke(c);
                } else {
                    p.stroke(s.color);
                }
                for (let i = 0; i < s.symmetry; i++) {
                    p.rotate(s.angle);
                    p.line(pt.mx, pt.my, pt.pmx, pt.pmy);
                    p.push();
                    p.scale(1, -1);
                    p.line(pt.mx, pt.my, pt.pmx, pt.pmy);
                    p.pop();
                }
            }
        }
        p.pop();
    }

    p.windowResized = function() {
        const canvasSize = Math.min(p.windowWidth * 0.8, p.windowHeight * 0.7);
        p.resizeCanvas(canvasSize, canvasSize);
        redrawAll();
    };
};

new p5(sketch);

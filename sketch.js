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

    // --- UI Elements ---
    let symmetrySlider, symmetryValueSpan, clearButton, saveButton;
    let brushSizeSlider, brushSizeValueSpan, colorPicker, bgColorPicker;

    // --- Setup ---
    p.setup = function() {
        symmetrySlider = document.getElementById('symmetrySlider');
        symmetryValueSpan = document.getElementById('symmetryValue');
        clearButton = document.getElementById('clearButton');
        saveButton = document.getElementById('saveButton');
        brushSizeSlider = document.getElementById('brushSizeSlider');
        brushSizeValueSpan = document.getElementById('brushSizeValue');
        colorPicker = document.getElementById('colorPicker');
        bgColorPicker = document.getElementById('bgColorPicker');

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
            p.background(p.color(bgColor));
        });

        brushSizeSlider.addEventListener('input', () => {
            brushSize = brushSizeSlider.value;
            brushSizeValueSpan.textContent = brushSize;
        });

        colorPicker.addEventListener('input', () => {
            brushColor = colorPicker.value;
        });

        bgColorPicker.addEventListener('input', () => {
            bgColor = bgColorPicker.value;
            p.background(p.color(bgColor));
        });

        clearButton.addEventListener('click', () => {
            p.background(p.color(bgColor));
        });

        saveButton.addEventListener('click', () => {
            p.saveCanvas('kaleidoscope_art', 'png');
        });
    };

    // --- Draw Loop ---
    p.draw = function() {
        p.translate(p.width / 2, p.height / 2);
        if (p.mouseIsPressed && p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            let mx = p.mouseX - p.width / 2;
            let my = p.mouseY - p.height / 2;
            let pmx = p.pmouseX - p.width / 2;
            let pmy = p.pmouseY - p.height / 2;

            // Calculate mouse speed to change brush size
            let speed = p.abs(p.mouseX - p.pmouseX) + p.abs(p.mouseY - p.pmouseY);
            let dynamicBrush = p.map(speed, 0, 20, parseInt(brushSize), Math.max(2, brushSize - 8));
            p.strokeWeight(dynamicBrush);
            p.stroke(brushColor);
            p.noFill();

            for (let i = 0; i < symmetry; i++) {
                p.rotate(angle);
                p.line(mx, my, pmx, pmy);
                p.push();
                p.scale(1, -1);
                p.line(mx, my, pmx, pmy);
                p.pop();
            }
        }
    };

    p.windowResized = function() {
        const canvasSize = Math.min(p.windowWidth * 0.8, p.windowHeight * 0.7);
        p.resizeCanvas(canvasSize, canvasSize);
        p.background(p.color(bgColor));
    };
};

new p5(sketch);

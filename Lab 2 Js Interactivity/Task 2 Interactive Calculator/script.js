// Sound effect setup
const sparkleSound = new Audio("https://www.soundjay.com/buttons/sounds/button-37a.mp3");

function doMath() {
    // 1. Get Values
    const n1 = parseFloat(document.getElementById('num1').value);
    const n2 = parseFloat(document.getElementById('num2').value);
    const operation = document.getElementById('op').value;
    const output = document.getElementById('output');

    // 2. Play Sound
    sparkleSound.play();

    // 3. Validation
    if (isNaN(n1) || isNaN(n2)) {
        output.innerText = "Add numbers, bestie! 🎀";
        output.className = "result-box";
        return;
    }

    let result;

    // 4. Calculator Logic
    switch(operation) {
        case "+": result = n1 + n2; break;
        case "-": result = n1 - n2; break;
        case "*": result = n1 * n2; break;
        case "/": 
            if (n2 === 0) {
                output.innerText = "Can't div by 0! 🛑";
                output.className = "result-box neg-bg";
                console.error("Math Error: Division by zero attempted.");
                return;
            }
            result = n1 / n2; 
            break;
    }

    // 5. Update DOM
    output.innerText = "Total: " + result;

    // 6. Console Log (with pretty styling)
    console.log(`%c✨ Math Success: ${n1} ${operation} ${n2} = ${result}`, "color: #ff69b4; font-weight: bold; font-size: 12px;");

    // 7. Bonus Background logic
    output.className = "result-box"; 
    if (result > 0) {
        output.classList.add('pos-bg');
    } else if (result < 0) {
        output.classList.add('neg-bg');
    }
}

function reset() {
    document.getElementById('num1').value = "";
    document.getElementById('num2').value = "";
    document.getElementById('output').innerText = "Waiting for math...";
    document.getElementById('output').className = "result-box";
    console.clear();
    console.log("%cCalculator Reset ✨", "color: #ad1457; font-style: italic;");
}
//CALCULATOR FUNCTIONALITY
const operations = {
    '+': (n1, n2) => n1 + n2,
    '-': (n1, n2) => n1 - n2,
    '*': (n1, n2) => n1 * n2,
    '/': (n1, n2) => n2 == 0 ? display.textContent = 'Div by 0?!' : n1 / n2,
  }
  
  //create variables for the 3 user inputs
  let num1 = 0;
  let operator = '';
  let num2 = 0; 
  
  function operate(n1, op, n2) {
    num1 = Number(n1);
    operator = op;
    num2 = Number(n2);
  
    //looks through operations obj for the correct operator key, then performs the operation
    return operations[operator](num1, num2);
  }
  
  
  //CALCULATOR DISPLAY 
  const display = document.querySelector('.display');
  const opBtns = document.querySelectorAll('.operation');
  const numbers = document.querySelectorAll('.number');
  const clear = document.querySelector('.clear');
  const dot = document.querySelector('.dot');
  const back = document.querySelector('.back');
  const percent = document.querySelector('.percent');
  const sign = document.querySelector('.sign');
  
  //EVENT LISTENERS
  
  //EVENT LISTENER HELPER FUNCTIONS
  //clear display for next number by remove selected class from operation button
  function removeSelected() {
    //turn a node list into a proper array to iterate
    let opBtnsArr = [...opBtns];
    //for every button, check for the selected class and remove if found
    for(let btn in opBtnsArr) {
      if(opBtnsArr[btn].classList.contains('selected')) {
        opBtnsArr[btn].classList.remove('selected');
        display.textContent = 0;
      }
    }
  }
  
  //clear user inputs
  function clearInputs() {
    dot.disabled = false;
    num1 = 0;
    operator = '';
    num2 = 0;
    return num1, operator, num2;
  }
  
  //sign button
  sign.addEventListener('click', () => display.textContent = Number(display.textContent) * -1);
  
  //percent button and key
  function makePercent() {
    //divide number in display by 100 then round to 8 or 9 digits
    let percentage = roundTo9(Number(display.textContent) / 100);
    //display percentage if percentage is not in scientific notation
    //and is greater than the smallest possible value of this calculator
    if(!percentage.toString().match(/[e]/i) && percentage >= 0.0000001) {
      display.textContent = percentage;
    }
  }
  
  percent.addEventListener('click', () => makePercent());
  
  document.addEventListener('keydown', (e) => {
    if(e.key === '%') { makePercent(); }
  })
  
  //if display shows 0, clicking any number except 0 replaces 0 
  //if it's not 0, the clicked number gets added onto the end of what's already there
  function addToDisplay(val) {
    if(display.textContent.length < 9) {
      if(display.textContent === '0') {
        display.textContent = val;
      } else {
        display.textContent += val;
      }
    }
  }
  
  numbers.forEach(num => num.addEventListener('click', () => {
    //call removeSelected first to make display 0 before moving to ternary
    removeSelected();
    addToDisplay(num.textContent);
  }));
  
  document.addEventListener('keydown', (e) => {
    if(e.key.match(/^[\d]/)) {
      removeSelected();
      addToDisplay(e.key);
    }
  });
  
  //dot button and key
  function dotHandler() {
    dot.disabled = true;
    display.textContent += '.';
  }
  
  dot.addEventListener('click', () => dotHandler());
  document.addEventListener('keydown', (e) => {
    if(e.key === '.' && dot.disabled === false) {
      dotHandler();
    }
  });
  
  //remove what's in display, all saved inputs, and any additional classes
  clear.addEventListener('click', () => {
    display.textContent = 0;
    clearInputs();
    removeSelected();
  });
  
  document.addEventListener('keydown', (e) => {
    if(e.key == 'Delete') {
      display.textContent = 0;
      clearInputs();
      removeSelected();
    };  
  });
  
  //remove one number at a time
  back.addEventListener('click', () => {
    backHandler();
  })
  
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Backspace') {
      backHandler();
    }
  })
  
  function backHandler() {
    if(display.textContent.length > 1) {
      display.textContent = display.textContent.slice(0, display.textContent.length - 1);
    } else {
      display.textContent = 0;
    }
  }
  
  //click listener to operator buttons and =
  opBtns.forEach(btn => btn.addEventListener('click', (e) => {
    //add selected class that helps with clearing display
    btn.classList.add('selected');
    //pass button's symbol to handler
    calculateHandler(e.target.textContent);
    dot.disabled = false;
  }));
  
  //keyboard listener for operations
  document.addEventListener('keydown', (e) => {
    //add selected class to help with clearing display
    let opBtnsArr = [...opBtns];
    for(let btn in opBtnsArr) {
      if(e.key === opBtnsArr[btn].textContent || 
        (e.key === 'Enter' && opBtnsArr[btn].textContent === '=')) {
        opBtnsArr[btn].classList.add('selected');
      }
    }
  
    let keys = Object.keys(operations);
    if(keys.includes(e.key) || e.key === '=') {
      dot.disabled = false;
      calculateHandler(e.key);
    } else if (e.key === 'Enter') {
      dot.disabled = false;
      calculateHandler('=');
    }
  })
  
  //click and keydown handler for operations
  function calculateHandler(symbol) {
    if(!operator) {
      if(symbol !== '=') {
        num1 = display.textContent;
        operator = symbol;
      } 
    } else {
      num2 = display.textContent;
      let content = operate(num1, operator, num2);
  
      //limit the display to show only 9 digits including the decimal
      display.textContent = content > 999999999 ? 'NA' : roundTo9(content);
      clearInputs();
  
      if(symbol !== '=') {
        num1 = display.textContent;
        operator = symbol;
      }
    }
  }
  
  //using the length of the num input, set the digits to 9 if there's no decimal or 8 with decimal
  function roundTo9 (num) {
    let digits = Math.round(num).toString().length;
    let max = num % 1 === 0 ? 9 : 8;
    let power = digits <= max ? max - digits : 0;
    return Math.round(num * (10 ** power)) / 10 ** power;
  }
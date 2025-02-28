const LENGTHDISPLAY = document.querySelector('.length-label');
const LENGTHSELECT = document.querySelector("input[name='length']");
const PASSWORDFORM = document.querySelector('.password-form');
const PASSWORDDISPLAY = document.querySelector('p.password');
const PLACEHOLDERPASSWORD = "P4$5W0rD!";
const STRENGTHWRAPPER = document.querySelector('.strength');
const STRENGTHDISPLAY = document.querySelectorAll('.meter-wrapper');
const COPYBUTTTON = document.querySelector('.copy-button');

const CATEGORIES = {'lowercase': generateLower, 'uppercase': generateUpper, 'numbers': generateNumbers, 'symbols': generateSymbols};

const PASSWORDCHARACTERS = {
    'lowercase': Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)),
    'uppercase': Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    'symbols': [
        ...Array.from({ length: 15 }, (_, i) => String.fromCharCode(33 + i)), 
        ...['@', '?', ';', ':', '^']
    ],
    'numbers': [0,1,2,3,4,5,6,7,8,9]
}

adjustMaxLength();

window.onresize = adjustMaxLength;





PASSWORDFORM.addEventListener('input', () => {

    LENGTHDISPLAY.textContent = LENGTHSELECT.value;  

    const formValues = {};
    new FormData(PASSWORDFORM).forEach((value, key) => {
        formValues[key] = value;
    })

    

    const [password, bagOfCharacters, generated] = generatePassword(formValues);
    setPasswordState(generated);
    PASSWORDDISPLAY.textContent = password;
    const strength = evaluateStrength(bagOfCharacters, formValues.length, generated); 
    updateStrengthMeter(strength);

});

COPYBUTTTON.addEventListener('click', () => {
    if (PASSWORDDISPLAY.classList.contains('generated')) {
        copyPassword(true);
    }
})

function generatePassword (formValues) {
    const usedCategories = []
    let partitions = 0;
    let bagOfCharacters = 0;
    let password = [];


    for (const category of Object.keys(CATEGORIES)) {
        if (formValues[category]) {
            partitions += 1;
            usedCategories.push(category);
            bagOfCharacters += PASSWORDCHARACTERS[category].length;
        }

    }
    if (partitions == 0) {
        return [PLACEHOLDERPASSWORD, partitions, false];
    }
    const amount = Math.floor((formValues.length / partitions) + 1);

    for (const [category, generator] of Object.entries(CATEGORIES)) {
        if (formValues[category]) {
            password = [...password, ...generator(amount)];
        }
    }

    return [randomizeAndTrim(password, formValues.length), bagOfCharacters, true];


}


function randomizeAndTrim (passwordArray, length) {
    let localPasswordArray = passwordArray;
    let output = String();
    
    print(localPasswordArray);

    for (const i in range(0, length)) {
        let finder = Math.floor(Math.random() * (localPasswordArray.length));
        output += localPasswordArray[finder];
        localPasswordArray.splice(finder, 1);
    }
    print(localPasswordArray);
    return output;

}

function generateLower (amount) {
    let output = [];
    for (i in range(0, amount)) {
        
        const finder = Math.floor(Math.random() * PASSWORDCHARACTERS.lowercase.length);
        const char = PASSWORDCHARACTERS.lowercase[finder];

        output.push(char);



    }

    print(output);

    return output;
}

function generateUpper (amount) {
    let output = [];
    for (const i in range(0, amount)) {
        
        const finder = Math.floor(Math.random() * PASSWORDCHARACTERS.uppercase.length);
        const char = PASSWORDCHARACTERS.uppercase[finder];

        output.push(char);

    }

    return output;
}

function generateSymbols (amount) {
    let output = [];
    for (const i in range(0, amount)) {
        
        const finder = Math.floor(Math.random() * PASSWORDCHARACTERS.symbols.length);
        const char = PASSWORDCHARACTERS.symbols[finder];

        output.push(char);

    }

    return output;
}

function generateNumbers (amount) {
    let output = [];
    for (const i in range(0, amount)) {

        output.push(Math.floor(Math.random() * 10));

    }

    return output;
}


function adjustMaxLength () {
    let max = Math.floor(PASSWORDFORM.clientWidth * 0.04);
    let generated = true;
    LENGTHSELECT.setAttribute('max', max);
    if (PASSWORDDISPLAY.textContent.length > max || PASSWORDDISPLAY.textContent == PLACEHOLDERPASSWORD) {
        PASSWORDDISPLAY.textContent = PLACEHOLDERPASSWORD;
        generated = false
    }
    setPasswordState(generated);
}


function evaluateStrength (bagOfCharacters, length, generated) {
    let evaluatedStrength = 'tooWeak';
    console.log(bagOfCharacters);
    if (generated) {
        const strengthIndicator = Math.log(bagOfCharacters)/Math.log(2)*length;
        console.log(strengthIndicator);
        const strengthSteps = [30, 47, 67];
        
        
        if (strengthIndicator < strengthSteps[0]) {
            evaluatedStrength = 'tooWeak';
        }
        else if (strengthIndicator < strengthSteps[1]) {
            evaluatedStrength = 'weak';
        }
        else if (strengthIndicator < strengthSteps[2]) {
            evaluatedStrength = 'medium';
        }
    
        else evaluatedStrength = 'strong';
     }
        
     return evaluatedStrength;
   
}

function updateStrengthMeter (passwordStrength) {
    
    for (const meter of Object.values(STRENGTHDISPLAY)) {
        if (meter.id == passwordStrength) {
            meter.classList.add('active');
        }
        else {
            meter.classList.remove('active');
        }
    }
    STRENGTHWRAPPER.setAttribute('data-strength-eval', passwordStrength);
}

function copyPassword (alert=True) {
    if (PASSWORDDISPLAY.classList.contains('generated')) {
        navigator.clipboard.writeText(PASSWORDDISPLAY.textContent);
        if (alert) alertCopied();
    }
}

function alertCopied () {
    COPYBUTTTON.classList.add('copied');
    setTimeout(() => {
        COPYBUTTTON.classList.remove('copied');
    }, 2000);
}

function setPasswordState(state) {
    if (state) {
        PASSWORDDISPLAY.classList.add('generated');
    }
    else {
        PASSWORDDISPLAY.classList.remove('generated');
    }
}



// backend utilities //

function range (start, stop, step=1) {
    const output = [];
    let i = start
    while (i < stop) {
        output.push(i);
        i += step;
        
    }
    return output
}

function print (arg) {
    console.log(arg);
}
// progress bar module
// https://kimmobrunfeldt.github.io/progressbar.js/

// donations
// https://www.paypal.com/donate/buttons


// open_parenthisis = new Key("(", "(", "(", "(", test.display_append);

class Question {
    constructor() {
        this._question = "";
        this._answer = "";
        this._bank = [["sqrt(2)/2", ["Math.cos(Math.PI/4)", "Math.sin(Math.PI/4)"]],
                ["-sqrt(2)/2", ["Math.cos(3*Math.PI/4", "Math.sin(-Math.PI/4)"]],
                ["sqrt(3)/2", ["Math.cos(Math.PI/6)", "Math.sin(Math.PI/3)"]],
                ["-sqrt(3)/2", ["Math.cos(5*Math.PI/6", "Math.sin(-Math.PI/3)"]],
                ["-Infinity", "Math.log(0)"]];
        this._factorial = [6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600]
        this._level = 1;
    }
    
    get question () {
        return this._question;
    }

    set question (val) {
        try {
            if(typeof val === "string" || eval(question) < Infinity) {
                this._question = val;
            }
        } catch (error) {
            return;
        }
    }

    get answer () {
        return this._answer;
    }

    set answer (val) {
        if(typeof val === "string" || typeof val === "object") {
            this._answer = val;
        }
    }

    get level () {
        return this._level;
    }

    set level (val) {
        if(typeof val === "number"){
            this._level = val;
        }
    }

    lvl1Question () {
        // returns random whole number from 0 to 999
        return (Math.floor(Math.random()*1000)).toString();
    }

    lvl2Question () {
        let mode = Math.floor(Math.random()*4);
        switch(mode) {
            // random 2-digit to 3-digit number
            case 0:
                return (Math.random()*1000).toFixed(Math.floor(Math.random()*2+2)).toString();
            // multiples of pi
            case 1:
            case 2:
                return (Math.PI * Math.floor(Math.random()*4+1)).toString();
            // power of e
            case 3:
                return (Math.exp(Math.floor(Math.random()*4+1))).toString();
        }
    }

    lvl3Question () {
        let mode = Math.floor(Math.random() * 4);
        let q;
        switch(mode) {
            // random question from bank
            case 0:
                let index = Math.floor(Math.random() * this._bank.length);
                this._answer = this._bank[index][1]
                return this._bank[index][0]
            // random exponential from 3 to 12
            case 1:
                q = Math.floor(Math.random()* 9 + 3);
                this._answer = this._factorial[q - 3].toString();
                return (q.toString() + "!");
            // random cube from 12 to 16
            case 2:
            case 3:
                q = Math.floor(Math.random() * 4 + 12) ** 3;
                this._answer = q;
                return q;
        }
    }

    genQuestion () {
        const question = document.getElementById("question")
        let q;
        let mode;
        switch(this._level) {
            // level 1 unlocked
            case 1:
                q = this.lvl1Question()
                this._question = q;
                this._answer = q;
                break;
            // level 2 unlocked
            case 2:
                // asks a level 1 or a level 2 question
                mode = Math.floor(Math.random() * 2);
                switch(mode) {
                    // lvl 1
                    case 0:
                        q = this.lvl1Question();
                        break;
                    // lvl 2
                    case 1:
                        q = this.lvl2Question();
                        break;
                }
                this._question = q;
                this._answer = q;
                break;
            // level 3 unlocked
            case 3:
                // asks a level 1, 2 or 3 question
                mode = Math.floor(Math.random() * 5);
                switch(mode) {
                    // lvl 1
                    case 0:
                        this._question = this._answer = this.lvl1Question();
                        break;
                    // lvl 2
                    case 1:
                        this._question = this._answer = this.lvl2Question();
                        break;
                    // lvl 3
                    case 2:
                    case 3:
                    case 4:
                        this._question = this.lvl3Question();
                        break;
                }
                break;
        }
        question.innerHTML = (this.question);
    }

    checkAnswer (answer) {
        // user can't just copy question
        if (answer === this._question) {
            return false;
        }
        // answer compared to two strings in array
        if(typeof this._answer === "object") {
            if (answer === this._answer[0] || answer === this._answer[1]) {
                return true;        
            }
        }
        // answer compared to one string
        else if (eval(answer) === eval(this._answer)) {
            return true;
        }
        // incorrect answer
        return false;       
    }

    nextLevel () {
        if(this._level +1 <= 3) {
            this._level += 1;
        }
    }
}


// ====================================================================
//                                  BUTTON
// ====================================================================

class Button {
    constructor(id, shortcut, display, calc, parent, max_uses=3) {
        // button element from DOM
        this.button = document.getElementById(id);
        this.button.onclick = () => this.button_press();
        // logs uses for deactivation
        this.max_uses = max_uses;
        this.num_uses = 0;
        this.active = true;
        this.turn_count = 0;
        // binding shortcut
        this.shortcut = shortcut;
        document.addEventListener("keydown", (event) => this.key_press(event));
        // display parameters
        this.display = display;
        this.calc = calc;
        this.parent = parent;
    }

    next_turn() {
        this.turn_count ++;
        this.check_status();
    } 

    activate () {
        this.active = true;
        this.num_uses = 0;
        this.turn_count = 0;
        this.button.style.backgroundColor = "white";
        this.button.style.color = "rgb(95, 64, 206)";
    }

    deactivate () {
        this.active = false;
        this.button.style.backgroundColor = "gray";
        this.button.style.color = "white"
    }

    button_press() {
        if(this.active) {
            this.increment_uses();
            this.parent.display_append(this.display, this.calc);
            this.check_status();
        }
    }

    key_press(event) {
        if(event.key === this.shortcut && this.active) {
            this.increment_uses();
            this.parent.display_append(this.display, this.calc);
            this.check_status();
        }
    }

    increment_uses() {
        if(this.max_uses != false) {
            this.num_uses ++;
        }
    }

    check_status() {
        // deactivates button if max number of uses has been reached
        if(this.num_uses === this.max_uses && this.active) {
            this.deactivate();
            this.turn_count = 0;
        }
        // reactivates button after 3 turns
        else if(this.turn_count === 3) {
            this.activate();
        }
    }

}

// sqrt(), log(), pi, sin()...
class Complex_button {
    constructor(id, keys, display, calc, parent, forbidden="") {
        // binds button
        this.button = document.getElementById(id);
        this.button.onclick = () => this.button_press();
        // forbidden shortcuts
        this.forbidden = forbidden;
        // binds shortcuts
        this.keys = keys;
        this.parent = parent
        this.bind_keys();
        // display and calculation values
        this.display = display;
        this.calc = calc;
    }

    button_press() {
        this.parent.display_append(this.display, this.calc);
    }

    bind_keys() {
        for(let i=0; i < this.keys.length; i++) {
            let key = this.keys[i];
            // last key
            if(i === this.keys.length - 1) {
                document.addEventListener("keydown", () => {
                    if(!this.forbidden.includes(key)) {
                        this.key_press(event, key);
                    }
                    this.optimise(this.keys);
                })
            }
            // all other keys
            else if (!this.forbidden.includes(key)){
                document.addEventListener("keydown", () => this.key_press(event, key))
            }
        }
    }

    key_press(event, key) {
        if(event.key === key){
            this.parent.display_append(key, key);
        }
    }

    optimise (val) {
        let val_length = val.length;
        // scans display for word
        for(let i = 0; i < this.parent.display_memory.length; i++) {
            // word found
            if(this.parent.display_memory.slice(i, i+val_length).join("") === val){
                // deletes all word cells in display but one
                this.parent.display_memory.splice(i+1, val_length-1);
                // repeats process for calculations
                this.parent.operation_memory.splice(i+1, val_length-1);
                // populates leftover cell with word
                this.parent.display_memory[i] = this.display;
                this.parent.display_refresh();
                this.parent.operation_memory[i] = this.calc;
            }
        }
    }

}


// button which calls function such as bakspace and enter button
class SpecialButton {
    constructor(id, shortcut, func, parent) {
        this.func = func;
        this.parent = parent;
        // binds button to function
        this.button = document.getElementById(id);
        this.button.onclick = () => this.acessFunc();
        // binds shortcut to function
        this.shortcut = shortcut;
        document.addEventListener("keydown", (event) => this.onKeydown(event))
    }

    acessFunc() {
        this.parent[this.func]()
    }

    onKeydown(event) {
        if(event.key === this.shortcut) {
            this.acessFunc();
        }
    }
}

// ====================================================================
//                               CALCULATOR
// ====================================================================

class Calculator {
    constructor(name) {
        
        // Points class TBA
        this.points = 0;
        this.point_holder = document.getElementById("holder_1").getElementsByClassName("points")[0];
        // Points class TBA
        
        // question
        this.question = new Question;
        this.question.level = 3;
        this.question.genQuestion();
        // allows for screen reset
        this.reset = false
        // display
        this.display_content = document.getElementById("operation");
        this.display_memory = [];
        this.operation_memory = [];
        this.display_result = document.getElementById("result");
        // lvl 2 buttons
        this.open_parenthisis = new Button("(", "(", "(", "(", this, false);
        this.close_parenthisis = new Button(")", ")", ")", ")", this, false);
        this.exponent = new Button("pow", "*", "**", "**", this, false);
        this.sqrt = new Complex_button("sqrt", "sqrt", "sqrt(", "Math.sqrt(", this);
        this.log = new Complex_button("log", "log", "log(", "Math.log(", this);

        // lvl 3 buttons
        this.e = new Button("e", "e", "e", "Math.E", this, false);
        
        this.pi = new Complex_button("pi", "pi", "pi", "Math.PI", this);
        this.sin = new Complex_button("sin", "sin", "sin(", "Math.sin(", this, "si");
        this.cos = new Complex_button("cos", "cos", "cos(", "Math.cos(", this, "os");
        this.tan = new Complex_button("tan", "tan", "tan(", "Math.tan(", this, "tn");
        // numbers
        this.numbers = [
            new Button("0", "0", "0", "0", this),
            new Button("1", "1", "1", "1", this),
            new Button("2", "2", "2", "2", this),
            new Button("3", "3", "3", "3", this),
            new Button("4", "4", "4", "4", this),
            new Button("5", "5", "5", "5", this),
            new Button("6", "6", "6", "6", this),
            new Button("7", "7", "7", "7", this),
            new Button("8", "8", "8", "8", this),
            new Button("9", "9", "9", "9", this)
        ]
        
        this.comma = new Button(".", ",", ",", ".", this, false);
        
        this.pow10 = new Complex_button("pow10", "x10**", "x10**", "*10**", this, "x10*");
        // operations
        this.times = new Button("x", "x", "<i class=\"fas fa-times\"></i>", "*", this, false);
        this.div = new Button("/", "/", "<i class=\"fas fa-divide\"></i>", "/", this, false);
        this.plus = new Button("+", "+", "<i class=\"fas fa-plus\"></i>", "+", this, false);
        this.minus = new Button("-", "-", "<i class=\"fas fa-minus\"></i>", "-", this, false);

        // delete key
        this.del = new SpecialButton("del", "Backspace", "delete", this);
        // exe key
        this.exe = new SpecialButton("exe", "Enter", "result_refresh", this);
    }

    display_refresh () {
        this.display_content.innerHTML = this.display_memory.join("");
    }

    display_append(key_display, key_val) {
        if(this.reset) {
            this.display_memory = [];
            this.operation_memory = [];
            this.display_result.innerHTML = "";
            this.reset = false;
        } 
        if (this.operation_memory.join("").length <= 30) {
            this.display_memory.push(key_display);
            this.display_refresh();
            this.operation_memory.push(key_val);
        }
    }

    result_refresh () {
        // displays result if a new operation exists
        if(this.operation_memory.length > 0 && !this.reset ) {
            let answer = this.operation_memory.join("")
            this.display_result.innerHTML = eval(answer);
            this.reset = true;
            // adds turn to number buttons for reactivation
            this.numbers.forEach((element) => element.next_turn())
            // adds 100pts if correct answer
            if(this.question.checkAnswer(answer)) {
                this.points += 100;
                this.point_holder.innerHTML = this.points;
            }
            this.question.genQuestion()
        }
    }

    delete () {
        this.display_memory.pop();
        this.operation_memory.pop();
        this.display_result.innerHTML = "";
        this.reset = false;
        this.display_refresh();
    }
}


test = new Calculator;
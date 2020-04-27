class Table {
    constructor(id) {
        this.table = document.getElementById(id)
        this.rows = [["Name", "Score", "Time"],
                    ["Eliot", "11000011101010010110000000", "Xmin"],
                    ["Thibaud le bikiniste", "Infinity", "0min"],
                    ["Justin Bieber", "0", "12j"],
                    ["&nbsp", "&nbsp", "&nbsp"]];
    }

    add(elements) {
        this.rows.splice(this.rows.length-1, 0, elements);
        console.log(this.rows)
    }

    construct() {
        let table = ""
        for(let i=0; i < this.rows.length; i++) {
            if(i === 0 || i === this.rows.length-1) {
                table += `<tr>
                            <th>${this.rows[i][0]}</th>
                            <th>${this.rows[i][1]}</th>
                            <th>${this.rows[i][2]}</th>
                          </tr>`
            } else {
                table += `<tr>
                            <td>${this.rows[i][0]}</th>
                            <td>${this.rows[i][1]}</th>
                            <td>${this.rows[i][2]}</th>
                          </tr>`
            }
        }
        console.log(table)
        return table;
    }

    refresh() {
        this.table.innerHTML = this.construct();
    }
}

test = new Table("scores");

const button = document.getElementById("add");
button.onclick = () => {
    test.add([rand_name(), rand_score(), rand_time()]);
    test.refresh();
}


const names = ["Camille", "Vaccarezza", "Poutinette", "Chloée", "Louis qui fait peur",
                "Le Baudot", "Louis", "Maéva", "Rainier"]
function rand_name() {
    return names[Math.floor(Math.random()*(names.length-1))];
}

function rand_score() {
    let millions = Math.floor(Math.random()*1000);
    let thousands = Math.floor(Math.random()*900+100);
    let hundreds = Math.floor(Math.random()*900+100);

    return `${millions} ${thousands} ${hundreds}`;
}

function rand_time() {
    return `${Math.floor(Math.random()*60)} min`;
}
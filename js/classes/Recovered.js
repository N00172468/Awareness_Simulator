class Recovered extends Molecule {
    constructor(_i) {
        super(_i);
        this.strokeColour = "#50ff29";
        this.colour = "#2eff00";
    }

    /* 
        ---RENDER METHOD---
    */
    render() {
        super.render();
    }

    /* 
        ---EVALUATE CONDITION METHOD---
    */
    evaluateCondition(_indexValue) {
        let jMolecule = molecules[_indexValue]; // jMolecule = Other molecules around primary molecule (e.g. i & j).

        if(jMolecule.constructor.name == "Infector") {
            const randomNum = random();

            if(randomNum < 0.10) { // 10% chance recovered molecules will be infected again.
                molecules[this.arrayPosition] = new Infector(this.arrayPosition);
                molecules[this.arrayPosition].position = this.position;
                molecules[this.arrayPosition].velocity = this.velocity;
                molecules[this.arrayPosition].radius = this.radius;
            }
        }
    }
}
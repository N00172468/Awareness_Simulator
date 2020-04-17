class Healthy extends Molecule {
    constructor(_i) {
        super(_i);
        this.strokeColour = "#4287f5";
        this.colour = "#8fd1ff";
    }

    /* 
        ---RENDER METHOD---
    */
    render() {
        super.render();
    }

    /* 
        ---EVALUATE CONDITION METHOD---
        Used when an infected molecule has made contact with a healthy molecule.
        When in contact, healthy molecule transform into infected.
    */
    evaluateCondition(_indexValue) {
        let jMolecule = molecules[_indexValue]; // jMolecule = Other molecules around primary molecule (e.g. i & j).

        if(jMolecule.constructor.name == "Infector") {
            const randomNum = random();

            if(randomNum < 1) { // 100% chance of being infected.
                molecules[this.arrayPosition] = new Infector(this.arrayPosition);
                molecules[this.arrayPosition].position = this.position;
                molecules[this.arrayPosition].velocity = this.velocity;
                molecules[this.arrayPosition].radius = this.radius;
                molecules[this.arrayPosition].isWithinWall = this.isWithinWall;
            }
        }
    }
}
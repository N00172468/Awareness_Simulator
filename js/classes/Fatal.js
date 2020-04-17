class Fatal extends Molecule {
    constructor(_i) {
        super(_i);
        this.strokeColour = "#6e6e6e";
        this.colour = "#6e6e6e";
        this.fillWhenIntersect = true;
        this.fatal = true;
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

            if(randomNum < 0) { // 0% chance to be infected again.
                molecules[this.arrayPosition] = new Infector(this.arrayPosition);
                molecules[this.arrayPosition].position = this.position;
                molecules[this.arrayPosition].velocity = this.velocity;
                molecules[this.arrayPosition].radius = this.radius;
            }
        }
    }
}
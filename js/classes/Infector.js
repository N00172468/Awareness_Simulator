class Infector extends Molecule {
    constructor(_i) {
        super(_i);
        this.strokeColour = "#ff3b3b";
        this.colour = "#ff3b3b";
        this.fillWhenIntersect = true;
        this.radiate = true;
        this.radiateSpeed = 0.2;

        this.recovering();
        this.fatality();
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

        if(jMolecule.constructor.name == "Healthy") {
            const randomNum = random();
            
            if(randomNum < 1) { // 100% chance of infecting healthy molecules..
                molecules[jMolecule.arrayPosition] = new Infector(jMolecule.arrayPosition);
                molecules[jMolecule.arrayPosition].position = jMolecule.position;
                molecules[jMolecule.arrayPosition].isWithinWall = jMolecule.isWithinWall;
                molecules[jMolecule.arrayPosition].velocity = jMolecule.velocity;
                molecules[jMolecule.arrayPosition].radius = jMolecule.radius;
            }
        }
    }

    /* 
        ---RECOVERING METHOD---
        Used to transform infected molecules into recovered in a certain amount of time.
        Simulates the statistics of recovered people.
    */
    recovering() {
        setTimeout(() => {
            const randomNum = random();

            if(randomNum < 1) { // 100% chance to transform infected into either recovered or fatal.
                molecules[this.arrayPosition] = new Recovered(this.arrayPosition);
                molecules[this.arrayPosition].position = this.position;
                molecules[this.arrayPosition].isWithinWall = this.isWithinWall;
                molecules[this.arrayPosition].velocity = this.velocity;
                molecules[this.arrayPosition].radius = this.radius;
            }
        }, this.timer);
    }

    /* 
        ---FATALITY METHOD---
        Used to transform infected molecules into fatal in a certain amount of time.
        Simulates the statistics of deceased people.
    */
    fatality() {
        setTimeout(() => {
            const randomNum = random();

            if(randomNum < 0.35) { // 35% of Infected molecule will transform into fatal while 65% will be recovered. 
                molecules[this.arrayPosition] = new Fatal(this.arrayPosition);
                molecules[this.arrayPosition].position = this.position;
                molecules[this.arrayPosition].isWithinWall = this.isWithinWall;
                molecules[this.arrayPosition].velocity = this.velocity;
                molecules[this.arrayPosition].radius = this.radius;
            }
        }, this.timer);
    }
}
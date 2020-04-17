class Molecule {
    constructor(_i) {
        // Position, Speed and Size of Molecules:
        this.position = createVector(random(radiusMax, width - radiusMax), random(radiusMax, height - radiusMax));
        this.velocity = createVector(random(-2, 2), random(-2, 2));
        this.radius = random(radiusMin,radiusMax);
        
        // Related to "splitIntoGrids()":
        this.arrayPosition = _i; 
        this.intersecting = false;
        this.bounce = true;
        this.north = false;
        this.east = false;
        this.south = false;
        this.west = false;

        // Related to "checkWall()":
        this.isWithinWall = false;

        // Radiate Variables:
        this.radiate = false;
        this.radiateMin = 0;
        this.radiateMax = 5;
        this.radiateSpeed = 0;

        // Related to Sub-Classes:
        this.timer = 10000; // When 10secs pass, transform infected molecule to corresponding sub-class (i.e. "Recovered"/"Fatal").
        this.fatal = false; // Used to disable "step()" if molecule is in fatal condition.

        // Default Molecule Variables:
        this.fillWhenIntersect = false;
        this.strokeColour = "#fff";
        this.colour = "#fff";
    }

    /* 
        ---RENDER MOLECULES METHOD---
    */
    render() {
        strokeWeight(2);
        stroke(this.strokeColour);

        this.fillWhenIntersect ? fill(this.colour) : noFill();

        push()
            translate(this.position.x,this.position.y);
            ellipse(0, 0, this.radius * 2, this.radius * 2);
        pop();
    }

    /* 
        ---RADIATE MOLECULES METHOD---
        Set up to only radiate Infected molecules.
    */
    radiateMolecule() {
        if(this.radiate == true) {
            if(this.radiateMin < this.radiateMax) {
                this.radiateMin += this.radiateSpeed;
            } else {
                this.radiateMin = 0;
            }


            push()
                noFill();
                stroke(this.strokeColour);
                translate(this.position.x, this.position.y);
                ellipse(0, 0, (this.radius + this.radiateMin) * 2, (this.radius + this.radiateMin) * 2);
            pop()
        }
    }

    /* 
        ---ANIMATE/MOVE METHOD---
        Set up to when a molecule transforms into a "Fatal", that molecule will cease to animate.
        Simulates/demonstrates the amount of people that are/will be deceased. 
    */
    step() {
        if(this.fatal == false) {
            this.position.add(this.velocity);
        }
    }

    /* 
        ---CHECK EDGES METHOD---
    */
    checkEdges() {
        if(this.position.x < this.radius || this.position.x > width - this.radius){
            this.velocity.x = this.velocity.x * -1;
        }
        
        if(this.position.y < this.radius || this.position.y > height - visualHeight - this.radius){
            this.velocity.y = this.velocity.y * -1;
        }

        // Prevent Molecules to be Nudged Outside of Canvas:
        if(this.position.x < this.radius > width) {
            this.position.x = this.position.x - this.radius * 2;
        }

        if(this.position.x < this.radius) {
            this.position.x = this.position.x + this.radius / 2;
        }

        if(this.position.y < this.radius > height) {
            this.position.y = this.position.y - this.radius * 2;
        }

        if(this.position.y < this.radius) {
            this.position.y = this.position.y + this.radius / 2;
        }
    }

    /* 
        ---CHECK INTERSECTING & BOUNCE METHOD---
    */
    checkIntersecting(_indexValue) {
        let dist = p5.Vector.sub(this.position, molecules[_indexValue].position);
        
        if (dist.mag() < this.radius + molecules[_indexValue].radius) {
            this.intersecting = true;
            molecules[_indexValue].intersecting = true;

            // Display When Molecules Have Made Contact:
            stroke("#FDD023");
            strokeWeight(3);
            line(
                this.position.x, this.position.y, 
                molecules[_indexValue].position.x, molecules[_indexValue].position.y);

            if (this.bounce) {
                let dx = this.position.x - molecules[_indexValue].position.x;
                let dy = this.position.y - molecules[_indexValue].position.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                let normalX = dx / dist;
                let normalY = dy / dist;

                let midpointX = (this.position.x.x + molecules[_indexValue].position.x) / 2;
                let midpointY = (this.position.x.y + molecules[_indexValue].position.y) / 2;

                let dVector = (this.velocity.x - molecules[_indexValue].velocity.x) * normalX;
                dVector += (this.velocity.y - molecules[_indexValue].velocity.y) * normalY;

                let dvx = dVector * normalX;
                let dvy = dVector * normalY;

                this.velocity.x -= dvx;
                this.velocity.y -= dvy;
                molecules[_indexValue].velocity.x += dvx;
                molecules[_indexValue].velocity.y += dvy;

                this.separateMols(_indexValue);
            }
            return true;
        }
    }

    /* 
        ---SEPARATE MOLECULES METHOD---
        Used to separate multiple molecules apart after they have made contact.
    */
    separateMols(molecule) {
        const dist = p5.Vector.sub(this.position, molecules[molecule].position);
        const heading  = dist.heading()
        const moveDistance  = (abs(dist.mag() - this.radius - molecules[molecule].radius) / 2)
        const dx = moveDistance * (Math.cos(heading))
        const dy = moveDistance * (Math.sin(heading))

        this.position.x += dx
        this.position.y += dy

        molecules[molecule].position.x -= dx
        molecules[molecule].position.y -= dy
    }

    /* 
        ---RESET METHOD---
    */
    reset() {
        this.intersecting = false
        this.north = false
        this.east = false
        this.south = false
        this.west = false
    }
}
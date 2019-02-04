document.addEventListener("DOMContentLoaded", function(){

// === Canvas Layout ===
const canvas = document.getElementById('Canvas');
const c = canvas.getContext("2d");
// === Game Variables ===
        var ballRadius = 15;
        var x = canvas.width/2;
        var y = canvas.height-30;
        var dx = 2;
        var dy = -2;
// Control Variables
        var controlHeight = 20;
        var controlWidth = 80;
        var controlX = (canvas.width-controlWidth)/2;
        var rightPressed = false; //false, controls not pressed at 0 time
        var leftPressed = false;
// Barrier 
        var barrierX = (canvas.width - canvas.width/2)
// Ship Variables
        var shipRowCount = 8;
        var shipColCount = 2;
        var shipWidth = 75;
        var shipHeight = 75;
        var shipPadding = 50; // space between ships
        var shipOffsetTop = 100; //offset position - loop
        var shipOffsetLeft = 100; //offset position - loop
// Status variables
        var score = 0; // ships destroyed
        var lives = 3; // player chances
// Ships Array
        var ships = []; //push ship in to this array
// Sound Effects
        var myMusic = new Audio("").play(); // add background music & sound effects, define variables as needed

        for(var i = 0; i < shipColCount; i++) {
          ships[i] = [];
          for(var r = 0; r < shipRowCount; r++) {
            ships[i][r] = { x: 0, y: 0, status: 1 };
          }
        }
        //=== controls & event listeners === 
        document.addEventListener("keydown", keyDown, false); //keyboard
        document.addEventListener("keyup", keyUp, false); //keyboard
        document.addEventListener("mousemove", mouseMove, false); //for mobile & tablet
        
        //function executed when key pressed down
        function keyDown(e) {
            if(e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = true;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = true;
            }
        }
        
        //function stopped when key is released (or up)
        function keyUp(e) {
            if(e.key == "Right" || e.key == "ArrowRight") {
                rightPressed = false;
            }
            else if(e.key == "Left" || e.key == "ArrowLeft") {
                leftPressed = false;
            }
        }
        
        //controls for mobile and tablet
        function mouseMove(e) { 
          var relativeX = e.clientX - canvas.offsetLeft;
          if(relativeX > 0 && relativeX < canvas.width) {
            controlX = relativeX - controlWidth/2;
          }
        }
        // === Ships destroyed upon impact ===
        function collisionDetection() {
          for(var i = 0; i < shipColCount; i++) {
            for(var r = 0; r < shipRowCount; r++) {
              var b = ships[i][r];
              if(b.status == 1) { //status property for ship, when 1, draw ship for the frame
                if(x > b.x && x < b.x + shipWidth && y > b.y && y < b.y + shipHeight) {
                  dy = -dy;
                  b.status = 0; //status property for ship, when 0, ship already destroyed, add to score
                  score++;
                  if(score == shipRowCount * shipColCount) {
                    alert("Congratulations! You've completed this level");
                    document.location.reload(); //add .assign here to load new page; to share player score on social media / play again / play next game level
                    clearInterval(interval); //ends game
                  }
                }
              }
            }
          }
        }
        //draw ball
        function drawBall() {
          c.beginPath();
          c.arc(x, y, ballRadius, 0, Math.PI*2);
          c.fillStyle = "crimson";
          c.fill();
          c.closePath();
        }
        //draw control
        function drawControl() {
          c.beginPath();
          c.rect(controlX, canvas.height-controlHeight, controlWidth, controlHeight);
          c.fillStyle = "green";
          c.fill();
          c.closePath();
        }
        //draw ships using loop and predefined offset & padding 
        function drawShips() {
          for(var i = 0; i < shipColCount; i++) {
            for(var r = 0; r < shipRowCount; r++) {
              if(ships[i][r].status == 1) {
                var shipX = (r * (shipWidth + shipPadding)) + shipOffsetLeft;
                var shipY = (i * (shipHeight + shipPadding)) + shipOffsetTop;
                ships[i][r].x = shipX;
                ships[i][r].y = shipY;
                c.beginPath();
                c.rect(shipX, shipY, shipWidth, shipHeight);
                c.fillStyle = "orange"; //shadow styles to ships
                c.shadowBlur    = 100;
                c.shadowOffsetX = 20;
                c.shadowOffsetY = 10;
                c.shadowColor   = "yellow"; // styles end
                c.fill();
                c.closePath();
              }
            }
          }
        }
        // //draw barrier
        // function drawBarrier(){
        //   c.beginPath();
        //   c.rect(canvas.width/4, canvas.height/2, 600, 25);
        //   c.fillStyle = "purple";
        //   c.fill();
        //   c.closePath();
        // }

        // ships destroyed status on canvas
        function drawScore() {
          c.font = "30px Helvetica";
          c.fillStyle = "#fff";
          c.fillText(`Ships destroyed: ${score}`, canvas.width-500, 50);
        }

        // player lives status on canvas
        function drawLives() {
          c.font = "30px Helvetica";
          c.fillStyle = "#fff";
          c.fillText(`Player lives: ${lives}`, canvas.width-900, 50);
        }
        
        // invoking canvas elements when draw function is invoked
        function draw() {
          c.clearRect(0, 0, canvas.width, canvas.height); //clears canvas 
          drawShips();
          // drawBarrier();
          drawBall();
          drawControl();
          drawScore();
          drawLives();
          collisionDetection();
        
          //=== Defining movement, direction on impact & boundaries for ball ===
          if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {//sides of canvas
            dx = -dx; //reverse x direction on collision
          }
          if(y + dy < ballRadius) { //top of canvas
            dy = -dy; //reverse y direction on collision
          }
          else if(y + dy > canvas.height-ballRadius) { //control
            if(x > controlX && x < controlX + controlWidth) {
              dy = -dy; //reverse y direction on collision with control
            }
            else {
              lives--; //removing lives for each loss
              if(!lives) { //no lives
                alert("GAME OVER");
                document.location.reload(); //reloads page, once alert is closed
              }
              else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                controlX = (canvas.width-controlWidth)/2; //control moves between 0 & canvas.width
              }
            }
          }
        
          //=== Defining movement of control ===
          if(rightPressed && controlX < canvas.width-controlWidth) {
            controlX += 8; //8px movement on right press & mouse move right
          }
          else if(leftPressed && controlX > 0) {
            controlX -= 8; //8px movement on left press & mouse move left
          }
        
          x += dx;
          y += dy;
          requestAnimationFrame(draw); //invokes code on the next frame
        }
        
        draw(); //invokes draw function


}); //DOM CONTENTLOADED END
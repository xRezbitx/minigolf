/* A: Gaige Johnston, 000869398, 31/03/22 *this file made 31st, code written in the HTML on 21st */
/* handles the ball movement, score tracking, and resetting the minigolf game */


var golfball = document.getElementById("ball");
var theCourse = document.getElementById("game");
var layout = theCourse.getBoundingClientRect();

var mouseX;
var mouseY;
var makeShot = false;
var readyToShoot = false;
var shotPower;

var directionX = 0;
var directionY = 0;
// sets shot angle and starts power meter
function mouseCoordinates(event) {
    //clearInterval(drawAimer);
    mouseX = event.clientX - layout.left;
    mouseY = event.clientY - layout.top;
    readyToShoot = true;

    let width = 0;
    let countUp = true;
    shotStrength = setInterval(function() {
        if (countUp) {
            width++;
            if (width == 95) {
                countUp = false;
            }
        }
        else {
            width--;
            if (width == 0) {
                countUp = true;
            }
        }
        powerIndicator.setAttribute("width", width);

        document.addEventListener("keydown", function(event) {
            if (event.keyCode == 32) {
                shotPower = width;
                clearInterval(shotStrength);

                directionX = mouseX - parseInt(golfball.getAttribute("cx"));
                directionY = mouseY - parseInt(golfball.getAttribute("cy"));
                
                aiming.setAttribute("x2", golfball.getAttribute("cx"));
                aiming.setAttribute("y2", golfball.getAttribute("cy"));
                
                // aim based on distance being 35 and finding ratio between x and y
                // so that mouse distance from ball doesn't affect speed
                let ratio = 35;
                if (Math.abs(directionX) > Math.abs(directionY)) {
                    let temp = directionX / ratio;
                    if (directionX > 0) {
                        directionX = ratio;
                        directionY = directionY/temp;
                    } else {
                        directionX = ratio * -1;
                        directionY = directionY/temp * -1;
                    }
                } else {
                    let temp = directionY / ratio;
                    if (directionY > 0) {
                        directionY = ratio;
                        directionX = directionX/temp;
                    } else {
                        directionY = ratio * -1;
                        directionX = directionX / temp * -1;
                    }
                    
                }
                return;
            }
        })
        
    }, 10);
    return;
    
}
var powerIndicator = document.getElementById("powerBar");

var numberOfShots = 0;
let shotCountText = document.getElementById("shotCount");

// moves the ball after releasing spacebar
document.addEventListener("keyup", function(event) {
    if (event.keyCode == 32) {
        if (readyToShoot) {
            numberOfShots++;
            shotCount.textContent = ("Shots: " + numberOfShots);
            let counter = 0;
            let flipX = false;
            let flipY = false;
            var moveBall = setInterval(function() {
            
                let ballX = parseInt(golfball.getAttribute("cx"));
                let ballY = parseInt(golfball.getAttribute("cy"));

                if (counter >= shotPower/1.5) {
                    // slows the ball down near the end of movement
                    golfball.setAttribute("cx", ballX + directionX/9);
                    golfball.setAttribute("cy", ballY + directionY/9);
                    // slow enough to fall in hole when going over
                    if (ballX >= 111 && ballX <= 137) {
                        if (ballY >= 463 && ballY <= 489) {
                            golfball.setAttribute("cx", 125);
                            golfball.setAttribute("cy", 478);
                            clearInterval(moveBall);
                            clearInterval(shotStrength);
                            powerIndicator.setAttribute("width", 0);
                            ballInHole();
                            return;
                        }
                    }
                } else {
                    // normal movement
                    golfball.setAttribute("cx", ballX + directionX/4.5);
                    golfball.setAttribute("cy", ballY + directionY/4.5);
                }
                


                // bouncing off the walls

                // horizontal boundaries
                if (!flipX) {
                    // right most wall
                    if (ballX >= 845) {
                        directionX = directionX * -1;
                        flipX = true;
                    }
                    // 2 far left walls
                    if ((ballY >= 55 && ballY <= 195) || (ballY >= 405 && ballY <= 545)) {
                        if (ballX <=55) {
                            directionX = directionX * -1;
                            flipX = true;
                        }
                    }
                }
                if (!flipX) {
                    // middle vertical wall
                    if (ballX <= 705 && ballX >= 695) {
                        if (ballY >= 195 && ballY <= 405) {
                            directionX = directionX * -1;
                            flipX = true;
                        }
                    }
                }

                // top barrier in valid area
                if (!flipX) {
                    if(ballX >= 448 && ballX <= 452) {
                        if (ballY >= 85 && ballY <= 165) {
                            directionX = directionX * -1;
                            flipX = true;
                        }
                    }
                }

                // bottom barriers in valid space
                if (!flipX) {
                    if(ballX >= 395 && ballX <= 405) {
                        if (ballY >= 400 && ballY <= 515) {
                            directionX = directionX * -1;
                            flipX = true;
                        }
                    }
                }

                if (!flipX) {
                    if(ballX >= 545 && ballX <= 555) {
                        if (ballY >= 435 && ballY <= 550) {
                            directionX = directionX * -1;
                            flipX = true;
                        }
                    }
                }

                // back in valid space between field barriers
                if (ballX > 405 && ballX < 545) {
                    if (ballY > 400 && ballY < 550) {
                        flipX = false;
                    }
                }


                // back in valid space between two vertical walls on the right
                if (ballY >= 195 && ballY <= 405) {
                    if (ballX > 705 && ballX < 845) {
                        flipX = false;
                    }
                }

                // vertical boundaries
                if (!flipY) {
                    // top and bottom walls
                    if (ballY <= 55 || ballY >= 545) {
                        flipY = true;
                        directionY = directionY * -1;
                    }
                }
                if (!flipY) {
                    // middle horizontal walls
                    if (ballX >= 55 && ballX <= 695) {
                        // top middle wall
                        if (ballY >= 195 && ballY <= 205) {
                            flipY = true;
                            directionY = directionY * -1;
                        }
                        // bottom middle wall
                        if (ballY >= 395 && ballY <= 405) {
                            flipY = true;
                            directionY = directionY * -1;
                        }
                    }
                }
                // back in valid space vertically
                if ((ballY > 55 && ballY < 195) || (ballY < 545 && ballY > 405)) {
                    flipY = false;
                }

                

                // end of wall bouncing


                // ball is done moving
                counter++;
                if (counter >= shotPower) {
                    clearInterval(moveBall);
                    clearInterval(shotStrength);
                    aiming.setAttribute("x1", golfball.getAttribute("cx"));
                    aiming.setAttribute("x2", golfball.getAttribute("cx"));
                    aiming.setAttribute("y1", golfball.getAttribute("cy"));
                    aiming.setAttribute("y2", golfball.getAttribute("cy"));
                    powerIndicator.setAttribute("width", 0);

                    // check if ball ended too close to outside of valid space and move it back in
                    if (ballY <= 55) {
                        golfball.setAttribute("cy", 60);
                        aiming.setAttribute("y1", 60);
                    }
                    if (ballY >= 694) {
                        golfball.setAttribute("cy", 690);
                        aiming.setAttribute("y1", 690);
                    }
                    if (ballX >= 845) {
                        golfball.setAttribute("cx", 840);
                        aiming.setAttribute("x1", 840);
                    }
                    if (ballX <= 55) {
                        golfball.setAttribute("cx", 60);
                        aiming.setAttribute("x1", 60);
                    }
                    if (ballX >= 55 && ballX <= 695) {
                        // top middle wall
                        if (ballY >= 195 && ballY <= 205) {
                            golfball.setAttribute("cy", 190);
                            aiming.setAttribute("y1", 190);
                        }
                        // bottom middle wall
                        if (ballY >= 395 && ballY <= 405) {
                            golfball.setAttribute("cy", 410);
                            aiming.setAttribute("y1", 410);
                        }
                    }
                    if (ballX <= 705 && ballX >= 685) {
                        if (ballY >= 195 && ballY <= 405) {
                            golfball.setAttribute("cx", 710);
                            aiming.setAttribute("x1", 710);
                        }
                    }

                    // check if ball in the hole
                    if (ballX >= 111 && ballX <= 137) {
                        if (ballY >= 463 && ballY <= 489) {
                            golfball.setAttribute("cx", 125);
                            golfball.setAttribute("cy", 478);
                            ballInHole();
                            return;
                        }
                    }
                    readyToShoot = false;
                    return;
                }
            }, 20)
        }
    }
})

const svgNS = "http://www.w3.org/2000/svg";
var score = document.createElementNS(svgNS, "text" );
function endScore() {
    score.setAttribute("id", "endScore");
    score.setAttribute("x", "325");
    score.setAttribute("y", "300");
    score.setAttribute("fill", "white");
    score.setAttribute("style", "font-size:28;");
    if (numberOfShots < 6) {
        score.textContent = ("Great! You got " + (numberOfShots - 6));
    } else if (numberOfShots == 6) {
        score.textContent = ("Nice, you got Par");
    } else {
        score.textContent = ("Too bad, you got +" + (numberOfShots - 6));
    }
    theCourse.appendChild(score);
    return;
}
function ballInHole() {
    // clear intervals
    clearInterval(drawAimer);
    clearInterval(shotStrength);
    // add score message
    endScore();
}


// constantly draws the aiming line until direction placed with mouseclick
aiming = document.getElementById("aim");

function drawAimer() {
    game.onmousemove = function(event) {
        if (readyToShoot) {
            return;
        }
        aimX = event.clientX;
        aimY = event.clientY;
        layout = theCourse.getBoundingClientRect();
        aiming.setAttribute("x2", aimX-layout.left);
        aiming.setAttribute("y2", aimY-layout.top);
    }
}
setInterval(drawAimer, 20);

function replay() {
    // clear powerbar interval and reset ready to shoot state to allow redrawing of aiming line
    readyToShoot = false;
    setInterval(drawAimer, 20);
    // reset shot count
    numberOfShots = 0;
    shotCount.textContent = ("Shots: " + numberOfShots);
    
    // reset ball
    golfball.setAttribute("cx", 80);
    golfball.setAttribute("cy", 125);
    // reset aiming line
    aiming.setAttribute("x1", 80);
    aiming.setAttribute("y1", 125);
    aiming.setAttribute("x2", 130);
    aiming.setAttribute("y2", 125);
    // reset power bar
    powerIndicator.setAttribute("width", 0);
    if (theCourse.getElementsByTagName("text").length == 4) {
        // the final score text is the fourth text in the game svg, so if it exists when the button is pressed, remove it
        theCourse.removeChild(score);
    }
}
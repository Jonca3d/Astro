const COLOR_BLACK           = "#000000";
const COLOR_WHITE           = "#FFFFFF";
const COLOR_GRAY            = "#666666";
const COLOR_GREEN           = "#00FF00";
const COLOR_RED             = "#FF0000";
const COLOR_DARK_RED        = "#8B0000";
const COLOR_ORANGE          = "#FF8C00";
const COLOR_DARK_STATE_GRAY = "#2F4F4F";
const COLOR_MAROON          = "#800000";

let canvas =  document.getElementById("gameCanvas");
let ctx    =  canvas.getContext("2d");

// Переменные для работы с Progressbar
let time             =  { value: 0 }; // Относительное игровое время. Значение time соответствует длине Progressbar в пикселях
let renderIterations =  { iteration: 0 }; // Подсчитывает количество перерисовок canvas
let levelLength      =  2; // Значение влияет на скорость заполнения Progressbar. Чем выше значение тем медленее заполняется шкала

let menu             =  ["Start / Resume", "Restart"];
let selectedMenuItem =  0;
let pressKeyUp       =  false;
let pressKeyDown     =  false;
let pressKeyEnter    =  false;

let menuStatus          =  true; // Если значение true то неоюходимо открыть меню и приостановить игру
let gameOverStatus      =  false;
let levelCompleteStatus =  false;

let numberOfStars = 10;
let stars = [];

let numberOfAsteroids = 100;
let asteroids =[];

let numberOfAidKit = 1;
let aidKit = [];

let fire = [];

let numberOfUpgrade = 2;
let upgrade = [];

let bonusSpeed = [];
let bonusFrequency = [];
let bonusAngle = [];

//Описание цветов обьектов
let colorSpaceship = COLOR_WHITE;

let score = 0;

let spaceship = {
    x:             40,
    y:             100,
    dimTopSide:    10,
    dimRightSide:  40,
    dimBottomSide: 10,
    dimLeftSide:   0,
    color:         COLOR_WHITE,
    status:        true,
    helth:         100,
    numberOfGun:   4,
    attackAngle:   false, // если true, то пули разлетаются веером
    luck:          50, // Вероятность выпадения бонуса после уничтожения врага
}

let bossLevelOne = {
    x:       500,
    y:       200,
    color:   COLOR_WHITE,
    helth:   100,
    status:  true,
    del:     false,
}

function restartGame() {
    time.value                 = 0;
    renderIterations.iteration = 0;
    pressKeyUp                 = false;
    pressKeyDown               = false;
    pressKeyEnter              = false;
    menuStatus                 = false;
    gameOverStatus             = false;
    levelCompleteStatus        = false;
    score                      = 0;
    spaceship.helth            = 1;
    initialization();
}

function initialization() {

    //Создание задника. Задаем колличество и инициализируем элементы
    for(let i=0; i<numberOfStars; i++) {
       stars[i] = {
          x:      randomeInteger(1,canvas.width),
          y:      randomeInteger(0, canvas.height),
          radius: randomeInteger(1,3),
          speed:  randomeInteger(10,20),
        };
    }

    for(let i=0, radius = 0,  j= canvas.width / numberOfAsteroids; i<numberOfAsteroids; i++) {
       radius =  randomeInteger(10, 20)
       asteroids[i] = {
          x:              canvas.width + 20,
          y:              randomeInteger(10, canvas.height - 10),
          radius:         radius,
          dimTopSide:     radius,
          dimRightSide:   radius,
          dimBottomSide:  radius,
          dimLeftSide:    radius,
          speed:          randomeInteger(1, 3),
          appearanceTime: j * i + 1,
          helth:          3,
          status:         false,
          del:            false, // флаг. Если true, то обьект помечен для удаленя
        }
    }

for (let i=0, j = canvas.width / numberOfUpgrade; i<numberOfUpgrade; i++) {
        upgrade[i] = {
        startY:         randomeInteger(10, canvas.height - 10),
        x:              canvas.width + 20,
        color:          COLOR_GRAY,
        appearanceTime: j * i + 1,
        dimTopSide:     6,
        dimRightSide:   40,
        dimBottomSide:  6,
        dimLeftSide:    0,
        status:         false,
        del:            false,
        move:           -0.6,
        speed:          1,
    };

        upgrade[i].y  = upgrade[i].startY;
        upgrade[i].tail1Y = upgrade[i].startY;
        upgrade[i].tail2Y = upgrade[i].startY;
        upgrade[i].tail3Y = upgrade[i].startY;
        upgrade[i].tail4Y = upgrade[i].startY;
        upgrade[i].tail5Y = upgrade[i].startY;
        upgrade[i].tail1X = upgrade[i].x + 14;
        upgrade[i].tail2X = upgrade[i].x + 24;
        upgrade[i].tail3X = upgrade[i].x + 32;
        upgrade[i].tail4X = upgrade[i].x + 38;
        upgrade[i].tail5X = upgrade[i].x + 42;

    }

for(let i=0, j = canvas.width / numberOfAidKit; i < numberOfAidKit; i++) {
    aidKit[i] =  {
        x:              canvas.width + 20,
        y:              randomeInteger(10, canvas.height - 10),
        dimTopSide:     0, 
        dimRightSide:   30, 
        dimBottomSide:  30, 
        dimLeftSide:    0, 
        speed:          randomeInteger(6, 50),
        appearanceTime: j * i + 1,
        helth:          5,
        status:         false,
        del:            false,
    }
}

} // initialization

//Привязываем центр коробля к курсор
function mouseMoveHandler(e) {
    let relativeY = e.clientY - canvas.offsetTop;
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeY > 0 && relativeY < canvas.height - 12) {
        spaceship.y = relativeY;
    }
    if(relativeX > 0 && relativeX < canvas.width - 10) {
        spaceship.x = relativeX;
    }
}

function keyDownHandler(e) {
    switch (e.keyCode) {
        case 27: //клавиша Esc
        if (!menuStatus) {
                menuStatus = true;
            } else {
                menuStatus = false;
            }
            break;
        case 38: // Up
            pressKeyUp = true;
            break;
        case 40: // Down
            pressKeyDown = true;
            break;
    case 13: // Enter
        pressKeyEnter = true;
            break;
        default:
            break;
    }
}

//Сгенерировать случайное число в диапозоне от min до max
function randomeInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function mainMenu() {
    if(pressKeyUp && selectedMenuItem > 0) {
            selectedMenuItem--;
    }
    if(pressKeyDown && selectedMenuItem < menu.length - 1) {
            selectedMenuItem++;
    }
    if(pressKeyEnter) {
        switch (selectedMenuItem) {
            case 0:
            menuStatus = false;
                break;
        case 1:
            restartGame();
                break;
            default:
                break;
        }
    }
    pressKeyUp    = false;
    pressKeyDown  = false;
    pressKeyEnter = false;
}

function gameover() {

    ctx.fillStyle = "rgba(0,0,0,0.6)"
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.font = "60px Arial";
    ctx.fillStyle = COLOR_DARK_RED;
    ctx.fillText("GAME_OVER", 100, 100);
}

function chance() {
    return randomeInteger(1,100) < spaceship.luck;
}

function levelComplete() {
    console.log("Level_Complete");
    levelCompleteStatus = true;
}

function drawUpgrade() {
for(i in upgrade) {
        ctx.beginPath();
    ctx.moveTo(upgrade[i].x, upgrade[i].y);
    ctx.lineTo(upgrade[i].x + 7, upgrade[i].y - 6);
    ctx.lineTo(upgrade[i].x + 7, upgrade[i].y + 6);
    ctx.lineTo(upgrade[i].x, upgrade[i].y);
    ctx.closePath();
    ctx.fillStyle = COLOR_GREEN;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = COLOR_WHITE;
    ctx.stroke();
    ctx.fillStyle = upgrade[i].color;
    ctx.beginPath();
    ctx.arc(upgrade[i].tail1X, upgrade[i].tail1Y, 5, 0, Math.PI*2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(upgrade[i].tail2X, upgrade[i].tail2Y, 4, 0, Math.PI*2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(upgrade[i].tail3X, upgrade[i].tail3Y, 3, 0, Math.PI*2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(upgrade[i].tail4X, upgrade[i].tail4Y, 2, 0, Math.PI*2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(upgrade[i].tail5X, upgrade[i].tail5Y, 1, 0, Math.PI*2, true);
    ctx.fill();
}
}

function drawBonusSpeed() {
if(bonusSpeed.length > 0) {
        for(i in bonusSpeed) {
            ctx.strokeStyle = COLOR_WHITE;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(bonusSpeed[i].x, bonusSpeed[i].y, 20, 0, Math.PI*2, true);
            ctx.stroke();

            ctx.font = "22px Arial";
            ctx.fillStyle = COLOR_WHITE;
            ctx.fillText("S", bonusSpeed[i].x - 7, bonusSpeed[i].y + 7);
        }
    }
}

function drawBonusAngle() {
    if(bonusAngle.length > 0) {
        for(i in bonusAngle) {
            ctx.strokeStyle = COLOR_WHITE;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(bonusAngle[i].x, bonusAngle[i].y, 20, 0, Math.PI*2, true);
            ctx.stroke();

            ctx.font = "22px Arial";
            ctx.fillStyle = COLOR_WHITE;
            ctx.fillText("A", bonusAngle[i].x - 7, bonusAngle[i].y + 6);
        }
    }
}

function drawBonusFrequency() {
    if(bonusFrequency.length > 0) {
        for(i in bonusFrequency) {
            ctx.strokeStyle = COLOR_WHITE;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(bonusFrequency[i].x, bonusFrequency[i].y, 20, 0, Math.PI*2, true);
            ctx.stroke();

            ctx.font = "22px Arial";
            ctx.fillStyle = COLOR_WHITE;
            ctx.fillText("F", bonusFrequency[i].x - 7, bonusFrequency[i].y + 7);
        }
    }
}

function drawMenu() {
    let menuCoordinates = canvas.height/2 - menu.length * 30;
    ctx.fillStyle = "rgba(0,0,0,0.6)"
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = COLOR_WHITE;
    for (i in menu) {
        if( i == selectedMenuItem) {
            ctx.fillText("[ " + menu[i] + " ]", 100, menuCoordinates);
        } else {
            ctx.fillText(menu[i], 100, menuCoordinates);
        }
        menuCoordinates += 60;
    }
}

/**
* @param {number} levelLength - Значение влияет на скорость заполнения Progressbar. Чем выше значение тем медленее заполняется шкала
* @param {object} renderIterations - Подсчитывает количество перерисовок canvas. Имеет параметр с числовым значением iteration
* @param {object} time - Относительное игровое время. Значение time соответствует длине Progressbar в пикселях. Имеет параметр с числовым значением value
* Принимает в качестве параметров обьекты значения параметров которых меняет в процессе своей работы
*/
function calculateProgress(levelLength, time) {
    if( renderIterations.iteration % levelLength == 0 ) {
        time.value++;
    }
}

function drawProgressbar(progress){
    ctx.strokeStyle = COLOR_WHITE;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0,canvas.height - 3);
    ctx.lineTo(progress, canvas.height - 3);
    ctx.stroke();
}

function drawStars() {
    for(i in stars) {
        ctx.fillStyle = COLOR_GRAY;
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, stars[i].radius, 0, Math.PI*2, true);
        ctx.fill();
    }
}

function drawAsteroids() {
    for(i in asteroids) {
        if (asteroids[i].status) {
            switch (asteroids[i].helth) {
                case 3:
                    ctx.strokeStyle = COLOR_GREEN;
                    break;
                case 2:
                    ctx.strokeStyle = COLOR_ORANGE;
                    break;
                case 1:
                    ctx.strokeStyle = COLOR_RED;
                    break;
                default:
                    break;

            }
        //	ctx.strokeStyle = COLOR_GREEN;
        ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(asteroids[i].x, asteroids[i].y, asteroids[i].radius, 0, Math.PI*2, true);
            ctx.stroke();
        }
    }
}

function drawAidKit() {
    for(i in aidKit) {
        if (aidKit[i].status){
            ctx.fillStyle = COLOR_RED;
            ctx.fillRect(aidKit[i].x, aidKit[i].y + 10, 30, 10);
            ctx.fillRect(aidKit[i].x + 10, aidKit[i].y, 10, 30);
        }
    }
}

function drawSpaceship() {
    ctx.beginPath();
    ctx.strokeStyle = spaceship.color;
    ctx.lineWidth = 2;
    ctx.moveTo(spaceship.x,spaceship.y - 10);
    ctx.lineTo(spaceship.x + 50,spaceship.y);
    ctx.lineTo(spaceship.x,spaceship.y + 10);
    ctx.lineTo(spaceship.x,spaceship.y - 10);
    ctx.stroke();
}

function drawBossLevel() {
    if(bossLevelOne.status) {
        ctx.fillStyle = COLOR_DARK_STATE_GRAY;
        ctx.beginPath();
        ctx.arc(bossLevelOne.x, bossLevelOne.y, 70, 0, Math.PI*2, true);
        ctx.fill();
        ctx.fillStyle = COLOR_RED;
        ctx.fillRect(bossLevelOne.x - 60, bossLevelOne.y - 32, 20, 4);
        ctx.fillRect(bossLevelOne.x - 60, bossLevelOne.y + 33, 20, 4);
        ctx.fillStyle = COLOR_WHITE;
        ctx.fillRect(bossLevelOne.x - 40, bossLevelOne.y - 35, 40, 10);
        ctx.fillRect(bossLevelOne.x - 40, bossLevelOne.y + 30, 40, 10);
        ctx.fillStyle = COLOR_MAROON;
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 20, bossLevelOne.y - 55, 8, 0, Math.PI*2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 35, bossLevelOne.y - 45, 8, 0, Math.PI*2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 48, bossLevelOne.y - 31, 8, 0, Math.PI*2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 56, bossLevelOne.y - 14, 8, 0, Math.PI*2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 58, bossLevelOne.y + 5, 8, 0, Math.PI*2, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 54, bossLevelOne.y + 24, 8, 0, Math.PI*2, true);
        ctx.fill();
        ctx.fillStyle = COLOR_BLACK;
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 20, bossLevelOne.y , 23, 0, Math.PI*2, true);
        ctx.fill();
        ctx.fillStyle = "#008080";
        ctx.beginPath();
        ctx.arc(bossLevelOne.x + 20, bossLevelOne.y , 20, 0, Math.PI*2, true);
        ctx.fill();
    }
}

function drawFillBackground() {
    ctx.fillStyle = COLOR_BLACK;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFire() {

    for(i in fire) {
        ctx.beginPath();
        ctx.strokeStyle = COLOR_RED;
        ctx.lineWidth = 2;
        ctx.moveTo(fire[i].x, fire[i].y);
        ctx.lineTo(fire[i].x + 10, fire[i].y);
        ctx.stroke();
    }
}

function drawTextScore() {
    ctx.font = "22px Arial";
    ctx.fillStyle = COLOR_GRAY;
    ctx.fillText("Score: " + score, 650, 30);
}

function drawTextHelth() {
    ctx.font = "22px Arial";
    ctx.fillStyle = COLOR_GRAY;
    ctx.fillText("Helth: " + spaceship.helth, 500, 30);
}

function updatetStateOfMovingObj(movingObj) {

    if (movingObj.status) {
        movingObj.x -= movingObj.speed;
    } else if(movingObj.appearanceTime == time.value) {
        movingObj.status = true;
    }
}

function intersectionOfObjects(objOne, objTwo) {
    if(    objOne.x + objOne.dimRightSide   >  objTwo.x - objTwo.dimLeftSide
        && objOne.x - objOne.dimLeftSide    <  objTwo.x + objTwo.dimRightSide
        && objOne.y - objOne.dimTopSide     <  objTwo.y + objTwo.dimBottomSide
        && objOne.y + objOne.dimBottomSide  >  objTwo.y - objTwo.dimTopSide
        && objOne.status
        && objTwo.status
        && gameOverStatus == false) {
        return true;
    } else {
        return false;
    }
}

function update() {

    renderIterations.iteration++;
    if(renderIterations.iteration == 1000) renderIterations.iteration = 0;

    if (menuStatus) {
        mainMenu();
    } else {
    // Движение звезд на заднем плане
    for(i in stars) {
        if(!levelCompleteStatus) {
            if(stars[i].x > -5) {
            stars[i].x -= stars[i].speed;
        } else {
            stars[i].x = canvas.width + 5;
            stars[i].y = randomeInteger(0, canvas.height);
        }
        }
    }

// Проверка столкновения астероидов с кораблем и пулями
    // Проверка времени создания астероидов
    for (i in asteroids) {

    updatetStateOfMovingObj(asteroids[i]);

    
    if (intersectionOfObjects(spaceship, asteroids[i])) {
        asteroids[i].helth -= 1;
        spaceship.helth -= 1;
        if(asteroids[i].helth < 1) {
            asteroids[i].del = true;
            score++;
        }
        if(spaceship.helth < 1) {
            gameOverStatus = true;            
        }
        
    }
        // Проверка столкновения астроида с каждей пулей
        for (j in fire) {
            if (intersectionOfObjects(fire[j], asteroids[i])) {
                    asteroids[i].helth -= 1;
                    if(asteroids[i].helth < 1) {
                        asteroids[i].del = true;
                            if(chance()) {
                switch (randomeInteger(1,3)) {
                    case 1:
                        bonusSpeed.push({x:             asteroids[i].x,
                                         y:             asteroids[i].y,
                                         dimTopSide:    20,
                                         dimRightSide:  20,
                                         dimBottomSide: 20,
                                         dimLeftSide:   20,
                                         speed:         randomeInteger(3,6),
                                         status:        true,
                                         del:           false,
                        });
                        break;                        
                    case 2:
                        bonusAngle.push({x:             asteroids[i].x,
                                         y:             asteroids[i].y,
                                         dimTopSide:    20,
                                         dimRightSide:  20,
                                         dimBottomSide: 20,
                                         dimLeftSide:   20,
                                         speed:         randomeInteger(3,6),
                                         status:        true,
                                         del:           false,
                        });
                        break;
                    case 3:
                        bonusFrequency.push({x:             asteroids[i].x,
                                             y:             asteroids[i].y,
                                             dimTopSide:    20,
                                             dimRightSide:  20,
                                             dimBottomSide: 20,
                                             dimLeftSide:   20,
                                             speed:         randomeInteger(3,6),
                                             status:        true,
                                             del:           false,
                        });
                    default:
                    break;
                }
                            }
                        score++;
                    }
                    fire.splice(j,1);break;
            }
        }
        if (asteroids[i].x < -30){
            asteroids[i].del = true;
        }
        if (asteroids[i].del) asteroids.splice(i,1);
    } // Конец перебора астероидов

// Перебор юнитов бонус-upgrade
for(i in upgrade) {

        if (!upgrade[i].status && upgrade[i].appearanceTime == time.value) {
            upgrade[i].status = true;
        }
        if (upgrade[i].status) {
        if(upgrade[i].y >= upgrade[i].startY + 5 || upgrade[i].y <= upgrade[i].startY - 5) upgrade[i].move *= -1;
        upgrade[i].y += upgrade[i].move;
        if(upgrade[i].tail1Y > upgrade[i].y) {
            upgrade[i].tail1Y -= 0.6;
        } else if(upgrade[i].tail1Y < upgrade[i].y){
            upgrade[i].tail1Y += 0.6;
        }
        if(upgrade[i].tail2Y > upgrade[i].tail1Y) {
            upgrade[i].tail2Y -= 0.5;
        } else if(upgrade[i].tail2Y < upgrade[i].tail1Y){
            upgrade[i].tail2Y += 0.5;
        }
        if(upgrade[i].tail3Y > upgrade[i].tail2Y) {
            upgrade[i].tail3Y -= 0.4;
        } else if(upgrade[i].tail3Y < upgrade[i].tail2Y){
            upgrade[i].tail3Y += 0.4;
        }
        if(upgrade[i].tail4Y > upgrade[i].tail3Y) {
            upgrade[i].tail4Y -= 0.3;
        } else if(upgrade[i].tail4Y < upgrade[i].tail3Y){
            upgrade[i].tail4Y += 0.3;
        }
        if(upgrade[i].tail5Y > upgrade[i].tail4Y) {
            upgrade[i].tail5Y -= 0.2;
        } else if(upgrade[i].tail5Y < upgrade[i].tail4Y){
            upgrade[i].tail5Y += 0.2;
        }

            upgrade[i].x  -= upgrade[i].speed;
            upgrade[i].tail1X -= upgrade[i].speed;
            upgrade[i].tail2X -= upgrade[i].speed;
            upgrade[i].tail3X -= upgrade[i].speed;
            upgrade[i].tail4X -= upgrade[i].speed;
            upgrade[i].tail5X -= upgrade[i].speed;

            if (upgrade[i].x == -60) upgrade[i].del = true;
    }

    if(intersectionOfObjects(spaceship, upgrade[i]) ) {
                spaceship.numberOfGun++;
                upgrade[i].del = true;
            }

        if(upgrade[i].del) upgrade.splice(i,1);
    } // Конец перебора бонуса upgrade
    // Конец перебора юнитов бонус-upgrade

    for(i in bonusAngle) {
        updatetStateOfMovingObj(bonusAngle[i]);
        if (bonusAngle[i].x < -40) {
            bonusAngle[i].del = true;
        }
        
        if(intersectionOfObjects(spaceship, bonusAngle[i])) {
            bonusAngle[i].del = true;
            // TO DO: написать код для воздействия этого бонуса на корабль
        }
        if (bonusAngle[i].del) bonusAngle.splice(i,1);
    }

    for(i in bonusSpeed) {
        updatetStateOfMovingObj(bonusSpeed[i]);
        if (bonusSpeed[i].x < -40) {
            bonusSpeed[i].del = true;
        }
        if(intersectionOfObjects(spaceship, bonusSpeed[i])) {
            bonusSpeed[i].del = true;
            // TO DO: написать код для воздействия этого бонуса на корабль
        }
        if (bonusSpeed[i].del) bonusSpeed.splice(i,1);
    }

    for(i in bonusFrequency) {
        updatetStateOfMovingObj(bonusFrequency[i]);
        if (bonusFrequency[i].x < -40) {
            bonusFrequency[i].del = true;
        }
        if(intersectionOfObjects(spaceship, bonusFrequency[i])) {
            bonusFrequency[i].del = true;
            // TO DO: написать код для воздействия этого бонуса на корабль
        }
        if (bonusFrequency[i].del) bonusFrequency.splice(i,1);
    }

// Перебор аптечек
    for(i in aidKit) {

    updatetStateOfMovingObj(aidKit[i]);

    if (intersectionOfObjects(spaceship, aidKit[i])) {
                aidKit[i].del = true;
                spaceship.helth += aidKit[i].helth;
            }

    if ( aidKit[i].x < -40 ) {
        aidKit[i].del = true;
    }
    if (aidKit[i].del) aidKit.splice(i,1);
} // конец перебора аптечек

    // Генерация пуль
    if(renderIterations.iteration % 60 == 0 && gameOverStatus == false) {
        for(let i=0, j = spaceship.y - 3 * (spaceship.numberOfGun - 1); i<spaceship.numberOfGun; i++, j+=6) {
            fire.push({x:             spaceship.x + 50, 
                       y:             j, 
                       dx:            10,
                       dimTopSide:    0,
                       dimRightSide:  10,
                       dimBottomSide: 0,
                       dimLeftSide:   0,
                       status:        true,
            });
        }
    }

// Удаление пуль
    for(i in fire) {
        fire[i].x += fire[i].dx;
        if(fire[i].x > canvas.width + 10) {
        fire.splice(i,1);
        }
    }
 
if(time.value == canvas.width) {
        levelComplete();
    }

    calculateProgress(levelLength, time);
}
} // function update()

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Задний фон
    drawFillBackground();
    drawStars();
        drawAsteroids();
        drawFire();
        drawAidKit();
        drawBonusAngle();
        drawBonusSpeed();
        drawBonusFrequency();
        drawProgressbar(time.value);

        if (menuStatus) {
            drawMenu();
            drawBossLevel();
        } else if (gameOverStatus) {
            gameover();
        } else {
            drawSpaceship();
            drawTextScore();
            drawTextHelth();
            drawUpgrade();
        }
} // function draw()

function game() {
    update();
    draw();
    requestAnimationFrame(game)
}

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);

initialization();
game();

const COLOR_BLACK    = "#000000";
const COLOR_WHITE    = "#FFFFFF";
const COLOR_GRAY     = "#666666";
const COLOR_GREEN    = "#00FF00";
const COLOR_RED		   = "#FF0000";
const COLOR_DARK_RED = "#8B0000";
const COLOR_ORANGE   = "#FF8C00";

let canvas =  document.getElementById("gameCanvas");
let ctx    =  canvas.getContext("2d");

// Переменные для работы с Progressbar
let time             =  { value: 0 }; // Относительное игровое время. Значение time соответствует длине Progressbar в пикселях
let renderIterations =  { iteration: 0 }; // Подсчитывает количество перерисовок canvas
let levelLength      =  1; // Значение влияет на скорость заполнения Progressbar. Чем выше значение тем медленее заполняется шкала

let menu             =  ["Start / Resume", "Restart", "Exit"];
let selectedMenuItem =  0;
let pressKeyUp       =  false;
let pressKeyDown     =  false;
let pressKeyEnter    =  false;

let menuStatus          =  true; // Если значение true то неоюходимо открыть меню и приостановить игру
let gameOverStatus      =  false;
let levelCompleteStatus =  false;

let numberOfStars = 10;
let stars = [];

let numberOfAsteroids = 1;
let asteroids =[];

let numberOfAidKit = 1;
let aidKit = [];

let fire = [];
let upgrade = {
	headX:     400,
	headY:     100,
	tail1X:    414,
	tail1Y:    100,
	tail2X:    424,
	tail2Y:    100,
	tail3X:    432,
	tail3Y:    100,
	tail4X:    438,
	tail4Y:    100,
	tail5X:    442,
	tail5Y:    100,
	color:     COLOR_WHITE,
}

//Описание цветов обьектов
let colorSpaceship = COLOR_WHITE;

let score = 0;

let spaceship = {
	x:			40,
	y: 			100,
	color: 	COLOR_WHITE,
	helth:	1,
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
		x: 			randomeInteger(1,canvas.width),
		y: 			randomeInteger(0, canvas.height),
		radius: randomeInteger(1,3),
	  speed: 	randomeInteger(10,20),
				};
  }

	for(let i=0, j= canvas.width / numberOfAsteroids; i<numberOfAsteroids; i++) {
	asteroids[i] = {
		x:	        		canvas.width + 20,
		y: 		        	randomeInteger(10, canvas.height - 10),
		radius:	        randomeInteger(10, 20),
		speed:	        randomeInteger(1, 3),
		appearanceTime: j * i + 1,
		helth:        	3,
		status:	        false,
		del:	          false, // флаг. Если true, то обьект помечен для удаленя
	}
}

  for(let i=0, j = canvas.width / numberOfAidKit; i < numberOfAidKit; i++) {
    aidKit[i] =  {
	    x:              canvas.width + 20,
	    y: 							randomeInteger(10, canvas.height - 10),
	    speed: 					randomeInteger(6, 50),
	    appearanceTime: j * i + 1,
	    helth:          5,
	    status:         false,
	    del: 	          false,
    }
  }

} // initialization

//Привязываем центр коробля к оси Y курсора
function mouseMoveHandler(e) {
	let relativeY = e.clientY - canvas.offsetTop;
	if(relativeY > 0 && relativeY < canvas.height - 12) {
		spaceship.y = relativeY;
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

function levelComplete() {
	console.log("Level_Complete");
}

function drawUpgrade() {
	ctx.beginPath();
	ctx.moveTo(upgrade.headX, upgrade.headY);
	ctx.lineTo(upgrade.headX + 7, upgrade.headY - 6);
	ctx.lineTo(upgrade.headX + 7, upgrade.headY + 6);
	ctx.lineTo(upgrade.headX, upgrade.headY);
	ctx.closePath();
	ctx.fillStyle = COLOR_GREEN;
	ctx.fill();
	ctx.lineWidth = 1.2;
	ctx.strokeStyle = COLOR_WHITE;
	ctx.stroke();
	ctx.fillStyle = COLOR_WHITE;
	ctx.beginPath();
	ctx.arc(upgrade.tail1X, upgrade.tail1Y, 5, 0, Math.PI*2, true);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(upgrade.tail2X, upgrade.tail2Y, 4, 0, Math.PI*2, true);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(upgrade.tail3X, upgrade.tail3Y, 3, 0, Math.PI*2, true);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(upgrade.tail4X, upgrade.tail4Y, 2, 0, Math.PI*2, true);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(upgrade.tail5X, upgrade.tail5Y, 1, 0, Math.PI*2, true);
	ctx.fill();
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

function update() {

	renderIterations.iteration++;
	if(renderIterations.iteration == 1000) renderIterations.iteration = 0;
	
	if (menuStatus) {
		mainMenu();
	} else {
	// Движение звезд на заднем плане
	for(i in stars) {
		if(stars[i].x > -5) {
			stars[i].x -= stars[i].speed;
		} else {
			stars[i].x = canvas.width + 5;
			stars[i].y = randomeInteger(0, canvas.height);
		}
	}

  // Проверка столкновения астероидов с кораблем и пулями
	// Проверка времени создания астероидов
	// Проверка выхода астероида за край экрана
	for (i in asteroids) {
		if (asteroids[i].status) {
			asteroids[i].x -= asteroids[i].speed;
		} else if(asteroids[i].appearanceTime == time.value) {
			asteroids[i].status = true;
		}

		if (spaceship.x + 40 > asteroids[i].x - asteroids[i].radius
				&& spaceship.x < asteroids[i].x + asteroids[i].radius
				&& spaceship.y - 10 < asteroids[i].y + asteroids[i].radius
				&& spaceship.y + 10 > asteroids[i].y - asteroids[i].radius
				&& asteroids[i].status
			  && gameOverStatus == false) {
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
			if (fire[j].x + 10 > asteroids[i].x - asteroids[i].radius
					&& fire[j].x < asteroids[i].x + asteroids[i].radius
					&& fire[j].y > asteroids[i].y - asteroids[i].radius
					&& fire[j].y < asteroids[i].y + asteroids[i].radius
					&& asteroids[i].status) {
				    asteroids[i].helth -= 1;
				    if(asteroids[i].helth < 1) {
					    asteroids[i].del = true;
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

  // Перебор аптечек
	for(i in aidKit) {
		if (aidKit[i].status) {
		aidKit[i].x -= aidKit[i].speed;
	} else if (aidKit[i].appearanceTime == time.value) {
		aidKit[i].status = true;
	}

	if (spaceship.x + 40 > aidKit[i].x
	    && spaceship.x < aidKit[i].x + 30
		  && spaceship.y - 10 < aidKit[i].y + 30
		  && spaceship.y + 10 > aidKit[i].y
		  && aidKit[i].status) {
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
		fire.push({x: spaceship.x + 50, y: spaceship.y, dx: 3})
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
		drawProgressbar(time.value);

		if (menuStatus) {
			drawMenu();
			drawUpgrade();
		} else if (gameOverStatus) {
			gameover();
		} else if (levelCompleteStatus) {
			levelComplete();
		}
		else {
			drawSpaceship();
			drawTextScore();
			drawTextHelth();
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

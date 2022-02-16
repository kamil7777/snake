const canvas = document.querySelector('.game');
var context = canvas.getContext('2d');
const textName = document.querySelector('.text_name');
const submit = document.querySelector('.submit');
const grid = 16;
let count = 0;
const snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4,
    level: 0
};
const apple = {
    x: 320,
    y: 320
};
let isPlay = false;

// количество набранных очков на старте 
let score = 0;
// рекорд игры 
let record = 0;
// текущий уровень сложности 
let level = 1;
// имя игрока с наибольшим рейтингом 
let gamerName = '';
let recordName = '';
//скорость движения змеи
let speed = 6;


// Функция ввода имени и запуска игры
function nameLoad() {
    localStorage.clear()
    gamerName = textName.value;

    localStorage.setItem('gamerName', `${textName.value}`);
}

submit.addEventListener('click', nameLoad)

// Узнаём размер хранилища 
//
let Storage_size = localStorage.length;
// Если в хранилище уже что-то есть… 
if (Storage_size > 0) {
    // …то достаём оттуда значение рекорда и имя чемпиона 
    record = localStorage.getItem('record');
    recordName = localStorage.getItem('recordName');
} else {


}




// получаем доступ к холсту с игровой статистикой
const canvasScore = document.querySelector('.score');
const contextScore = canvasScore.getContext('2d');

//Делаем генератор случайных чисел в заданном диапазоне.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};



function showScore() {
    contextScore.clearRect(0, 0, canvasScore.width, canvasScore.height);
    contextScore.globalAlpha = 1;
    contextScore.fillStyle = 'orange';
    contextScore.font = '18px Courier New';
    contextScore.fillText('SNAKE', 120, 60);
    contextScore.fillText('Игрок:   ' + gamerName, 15, 100);
    contextScore.fillText('Уровень: ' + level, 15, 150);
    contextScore.fillText('Очков:   ' + score, 15, 250);
    contextScore.fillText('Чемпион: ' + recordName, 160, 150);
    contextScore.fillText('Рекорд:  ' + record, 160, 250);
};

//Игровой цикл - основной процесс, внутри которого будет все происходить
function loop() {

    // Дальше будет хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15. Для этого она пропускает три кадра из четырёх, то есть срабатывает каждый четвёртый кадр игры. Было 60 кадров в секунду, станет 15.
    window.requestAnimationFrame(loop);
    // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет. 
    if (++count < speed) {
        return;
    }
    //Обнуляем переменную скорости
    count = 0;
    //Очищаем игровое поле
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Двигаем змейку с нужной скоростью
    snake.x += snake.dx;
    snake.y += snake.dy;
    // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной стороны
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    // Делаем тоже самое для движения по вертикали
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
    // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку.
    snake.cells.unshift({ x: snake.x, y: snake.y });
    // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно особождает клетки после себя
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    // Рисуем еду — красное яблоко
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
    // Одно движение змейки — один новый нарисованный квадратик
    context.fillStyle = 'green';
    // Обрабатываем каждый элемент змейки
    snake.cells.forEach(function(cell, index) {
        // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        // Если змейка добралась до яблока...
        if (cell.x === apple.x && cell.y === apple.y) {
            // увеличиваем длину змейки
            snake.maxCells++;
            //увеличивем счетчик
            score++;
            //увеличиваем скорость при набранных очках
            if (score == 5 || score == 10 || score == 15 || score == 40) {
                speed--;
                level++;
            };

            // Рисуем новое яблочко
            // Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        // Проверяем, не столкнулась ли змея сама с собой
        // Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами
        for (let i = index + 1; i < snake.cells.length; i++) {
            // Если такие клетки есть — начинаем игру заново
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // Задаём стартовые параметры основным переменным
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
                // Ставим яблочко в случайное место
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;

                // если игрок побил прошлый рекорд           
                if (score > record) {
                    // ставим его очки как рекорд
                    record = score;
                    // заносим в хранилище значение рекорда 
                    localStorage.setItem('record', `${record}`);
                    // меняем имя чемпиона 
                    recordName = gamerName;
                    // заносим в хранилище его имя 
                    localStorage.setItem('recordName', `${gamerName}`);
                };
                score = 0;
                level = 1;
                speed = 6;
            }
        }
    });
    // выводим статистику 
    showScore();
}

// Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
document.addEventListener('keydown', function(event) {
    // Дополнительно проверяем такой момент: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой на лету и не усложнять код игры. 
    // Стрелка влево
    // Если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали…
    if (event.key === 'ArrowLeft' && snake.dx === 0) {
        // то даём ей движение по горизонтали, влево, а вертикальное — останавливаем
        // Та же самая логика будет и в остальных кнопках
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Стрелка вверх
    else if (event.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Стрелка вправо
    else if (event.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Стрелка вниз
    else if (event.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// Запускаем игру
document.querySelector('.play-button').addEventListener('click', loop)
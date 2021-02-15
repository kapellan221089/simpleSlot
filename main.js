
import {background,border} from './src/js/border.js'
import {linesArray} from './src/js/lines.js'


const app = new PIXI.Application({width: 1040, height: 600, backgroundColor: 0x211d02 });
document.body.appendChild(app.view);


app.loader
    .add('src/img/eldar.png', 'src/img/eldar.png')
    .add('src/img/orcs.png', 'src/img/orcs.png')
    .add('src/img/chaos.png', 'src/img/chaos.png')
    .add('src/img/inq.png', 'src/img/inq.png')
    //.add('src/border.png', 'src/border.png')
    .load(onAssetsLoaded);

const REEL_WIDTH = 200;
const SYMBOL_SIZE = 150;


function onAssetsLoaded() {
    // Создание текстур символов.
    let slotTextures = [
        PIXI.Texture.from('src/img/eldar.png'),
        PIXI.Texture.from('src/img/orcs.png'),
        PIXI.Texture.from('src/img/chaos.png'),
        PIXI.Texture.from('src/img/inq.png'),
    ];
    

    // Создание барабана
    const reels = [];
    const reelContainer = new PIXI.Container();
    for (let i = 0; i < 5; i++) {
        const rc = new PIXI.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        
        // Создание символов
        for (let j = 0; j < 4; j++) {
            const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            symbol.border = 2;
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);


    // Добавление рамки
    app.stage.addChild(background);
    background.addChild(border);


    // Добавление разделительных линий
    app.stage.addChild(linesArray);

    let running = false;
    // Функция запуска игры.
    function startPlay() {
        if (running) return;
        running = true;
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 10000 + i * 500 + extra * 500;
            tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    };


    // Функция досрочной остановки игры.
    function stopGame1(){
        const remove = [];
        for (let i = 0; i < tweening.length; i++) {
            const t = tweening[i];
            let phase = 1
            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
        }
    };
    
    // Создание текстур кнопок
    const buttonStartTexture = PIXI.Texture.from('src/img/btnC.png');
    const buttonStartTextureOver = PIXI.Texture.from('src/img/btnCA.png');
    

    // Создание кнопки старт
    const buttonStart = new PIXI.Sprite(buttonStartTexture);
    buttonStart.buttonMode = true;
    buttonStart.anchor.set(0.5);
    buttonStart.x = 110;
    buttonStart.y = 565;

    buttonStart.interactive = true;
    buttonStart.buttonMode = true;

    buttonStart
        .on('pointerdown', startPlay)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
    app.stage.addChild(buttonStart);

    
    // Создание кнопки досрочной остановки игры
    const buttonStop1 = new PIXI.Sprite(buttonStartTexture);
    buttonStop1.buttonMode = true;
    buttonStop1.anchor.set(0.5);
    buttonStop1.x = 930;
    buttonStop1.y = 565;

    buttonStop1.interactive = true;
    buttonStop1.buttonMode = true;

    buttonStop1
        .on('pointerdown',stopGame1)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
    app.stage.addChild(buttonStop1);


    // Функции действий мыши над кнопками
    function onButtonUp() {
        this.isdown = false;
        if (this.isOver) {
            this.texture = buttonStartTextureOver;
        }
        else {
            this.texture = buttonStartTexture;
        }
    }
    
    function onButtonOver() {
        this.isOver = true;
        if (this.isdown) {
            return;
        }
        this.texture = buttonStartTextureOver;
    }
    
    function onButtonOut() {
        this.isOver = false;
        if (this.isdown) {
            return;
        }
        this.texture = buttonStartTexture;
    }


    // Создание верхней обложки
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    const top = new PIXI.Graphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, app.screen.width, margin);

    
    // Стиль текста
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 26,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    
    // Добавление текста обложки
    const headerText = new PIXI.Text('WARHAMMER 40k create you army', style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);
    app.stage.addChild(top);


    // Добавление текста кнопок
    const buttonStartText = new PIXI.Text('Start', style);
    buttonStartText.x = -35;
    buttonStartText.y = -20;
    buttonStart.addChild(buttonStartText);

    const buttonStopText = new PIXI.Text('Stop', style);
    buttonStopText.x = -35;
    buttonStopText.y = -20;
    buttonStop1.addChild(buttonStopText);

    
    // Обработчик завершения игры
    function reelsComplete() {
        running = false;;
    }

    // Анимация
    app.ticker.add((delta) => {
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Обновление позиция символов на барабане
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                    
                }
            }
        }
    });
}


// Обработка анимации
const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}


// Отслеживание обновления анимации
app.ticker.add((delta) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);
        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});


function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}
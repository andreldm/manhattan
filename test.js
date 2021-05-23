function findElement() {
    return Array.prototype.slice
        .call(document.querySelectorAll('canvas'))
        .filter(e => e.style.visibility == 'visible')
        .sort((a, b) => b.style.zIndex - a.style.zIndex)[0];
}

function customTyperGremlin({ randomizer, window }) {
    return () => {
        const document = window.document;
        const targetElement = findElement();
        const eventType = randomizer.pick(['keypress', 'keyup', 'keydown']);
        const key = randomizer.pick([
            8, 9, 13, 27, 32, 37, 38, 39, 40, 46, 48, 49, 50, 51,
            52, 53, 54, 55, 56, 57, 58, 63, 64, 65, 66, 67, 68, 69,
            70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
            84, 85, 86, 87, 88, 89, 90, 106, 107,108, 109, 110, 111
        ]);

        const keyboardEvent = document.createEvent('Events');
        keyboardEvent.initEvent(eventType, true, true);

        keyboardEvent.keyCode = key;
        targetElement.dispatchEvent(keyboardEvent);
    };
}

function customClickerGremlin({ randomizer, window }) {
    const defaultPositionSelector = (targetElement) => {
        return [
            randomizer.natural({
                min: Math.max(0, targetElement.offsetLeft),
                max: Math.max(0, targetElement.offsetLeft) + targetElement.width
            }),
            randomizer.natural({
                min: Math.max(0, targetElement.offsetTop),
                max: Math.max(0, targetElement.offsetTop) + targetElement.height
            }),
        ];
    };

    const defaultShowAction = (x, y) => {
        const document = window.document;
        const body = document.body;
        const clickSignal = document.createElement('div');
        clickSignal.style.zIndex = 2000;
        clickSignal.style.border = '5px solid red';
        clickSignal.style['border-radius'] = '50%'; // Chrome
        clickSignal.style.borderRadius = '50%'; // Mozilla
        clickSignal.style.width = '1px';
        clickSignal.style.height = '1px';
        clickSignal.style['box-sizing'] = 'border-box';
        clickSignal.style.position = 'absolute';
        clickSignal.style.transition = 'opacity 1s ease-out';
        clickSignal.style.left = x - 20 + 'px';
        clickSignal.style.top = y - 20 + 'px';
        const element = body.appendChild(clickSignal);
        setTimeout(() => body.removeChild(element), 1000);
        setTimeout(() => element.style.opacity = 0, 50);
    };

    return () => {
        const targetElement = findElement();
        const [posX, posY] = [... defaultPositionSelector(targetElement)];

        ['mousedown', 'mouseup'].forEach(clickType => {
            const evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(clickType, true, true, window, 0, 0, 0, posX, posY, false, false, false, false, 0, null);
            targetElement.dispatchEvent(evt);
            defaultShowAction(posX, posY, clickType);
        });
    };
}

function initGremlins() {
    gremlins
    .createHorde({
        species: [ customTyperGremlin, customClickerGremlin ],
        mogwais: [ ],
        strategies: [gremlins.strategies.distribution({
            nb: 1000,
            delay: 50
        })]
    })
    .unleash()
    .then(() => document.title = 'DONE');
}

(function() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/gremlins.js';
    script.addEventListener('load', initGremlins, false);
    document.body.appendChild(script);
})();

// 背景の演出(浮かんで光る点と、流れて出てくる言葉)。
// ポートフォリオ(huraru-portfolio)の dotMotion.js・textMotion.js を元にしている。
// 文章を読むページ(<html data-fx="subtle">。記事の本文と About)では、読みやすさのために控えめにする
// 流れる言葉の一覧は src/data/content.ts の backgroundMessages
import { backgroundMessages as messages } from '../data/content.ts';

type FxLevel = 'full' | 'subtle';

const dotColors = ['#407ec5', '#6d64f4', '#e495fa', '#009ed3'];

// 強さごとの、点の数と同時に出す言葉の数
const levelConfig: Record<FxLevel, { dots: number; texts: number }> = {
  full: { dots: 25, texts: 3 },
  subtle: { dots: 10, texts: 0 },
};

const typing = {
  startDelay: 1000,
  typingSpeed: 90,
  displayDuration: 2500,
  fadeOutDuration: 1500,
  pauseAfterErase: 750,
  rotationRange: 45,
};

function currentFxLevel(): FxLevel {
  return document.documentElement.dataset.fx === 'subtle' ? 'subtle' : 'full';
}

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function renderDots(container: HTMLElement, count: number): void {
  container.replaceChildren();
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    const color = dotColors[Math.floor(Math.random() * dotColors.length)];
    dot.className = 'fx__dot';
    dot.style.setProperty('--size', `${Math.random() > 0.6 ? 6 : 3}px`);
    dot.style.setProperty('--color', color);
    dot.style.setProperty('--duration', `${random(2, 7)}s`);
    dot.style.setProperty('--delay', `${random(0, 2)}s`);
    // 漂う向きは点ごとに変える
    dot.style.setProperty('--dx1', `${random(-20, 20)}px`);
    dot.style.setProperty('--dy1', `${random(-20, 20)}px`);
    dot.style.setProperty('--dx2', `${random(-30, 30)}px`);
    dot.style.setProperty('--dy2', `${random(-30, 30)}px`);
    dot.style.left = `${random(0, 100)}%`;
    dot.style.top = `${random(0, 100)}%`;
    if (Math.random() <= 0.3) dot.style.borderRadius = '0';
    container.appendChild(dot);
  }
}

function createTextElement(container: HTMLElement): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'fx__text';
  const left = random(0, 100);
  const alignLeft = Math.random() > 0.5;
  wrap.style.top = `${random(0, 100)}%`;
  if (alignLeft) {
    wrap.style.left = `${left}%`;
    wrap.style.transformOrigin = 'left top';
  } else {
    wrap.style.right = `${100 - left}%`;
    wrap.style.transformOrigin = 'right top';
    wrap.style.textAlign = 'right';
  }
  wrap.style.transform = `rotate(${(Math.random() - 0.5) * typing.rotationRange}deg)`;
  container.appendChild(wrap);
  return wrap;
}

// 1文字ずつ打ち出し、しばらく見せてから消し、次の言葉へ進む
function startTextLoop(container: HTMLElement): void {
  let index = Math.floor(Math.random() * messages.length);

  const loop = () => {
    const el = createTextElement(container);
    const text = messages[index];
    let charIndex = 0;

    const typingTimer = window.setInterval(() => {
      if (charIndex < text.length) {
        el.textContent += text[charIndex];
        charIndex++;
        return;
      }
      window.clearInterval(typingTimer);
      window.setTimeout(() => {
        el.classList.add('is-fading');
        window.setTimeout(() => {
          el.remove();
          index = (index + 1) % messages.length;
          window.setTimeout(loop, typing.pauseAfterErase);
        }, typing.fadeOutDuration);
      }, typing.displayDuration);
    }, typing.typingSpeed);
  };

  loop();
}

export function startBackgroundFx(): void {
  const dots = document.getElementById('fxDots');
  const texts = document.getElementById('fxTexts');
  if (!dots || !texts) return;

  const config = levelConfig[currentFxLevel()];
  // 動きを減らす設定の人には、点は止めて出し、言葉は出さない(点の停止は CSS 側)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderDots(dots, config.dots);
  if (reduceMotion) return;

  for (let i = 0; i < config.texts; i++) {
    window.setTimeout(() => startTextLoop(texts), i * typing.startDelay);
  }
}

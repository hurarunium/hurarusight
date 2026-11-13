// カードを上へ詰めて並べる(高さの違うカードの下に隙間を作らない)。
// グリッドの行を細かく(rowUnit px)して、カードごとに高さぶんの行数をまたがせる。並び順は左→右のまま。
// JS が動かないときは、ふつうのグリッド(行ごとに高さをそろえる並び)のまま表示される
const rowUnit = 4;

export function setupMasonry(list: HTMLElement): void {
  const items = [...list.children] as HTMLElement[];
  list.classList.add('is-masonry');

  const layout = (item: HTMLElement) => {
    // 非表示(タグで絞り込まれた)カードは高さ0なので、行をまたがせない
    const height = item.getBoundingClientRect().height;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    // 行どうしの隙間は0にしてあるので、カードの間隔(gap)ぶんを高さに足す
    item.style.gridRowEnd = `span ${Math.ceil((height + gap) / rowUnit)}`;
  };

  // 画像の読み込み・画面幅の変化・絞り込みで高さが変わるたびに、並べ直す
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) layout(entry.target as HTMLElement);
  });
  for (const item of items) {
    // 最初の1回はすぐ並べる(ResizeObserver の通知は描画の時まで待つので、その間に重なって見えないように)
    layout(item);
    observer.observe(item);
  }
}

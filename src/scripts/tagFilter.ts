// タグでの絞り込み(Articles と Works で共通)。TagFilter.astro のチップと、一覧の各項目を結びつける
// - 選べるタグは1つ。選択中のタグは ?tag= に持たせ、他のページのタグリンクから絞り込んだ状態で開けるようにする
// - 一覧の項目は data-tags(タグの JSON 配列)を持つ

interface Options {
  // 一覧の各項目
  items: HTMLElement[];
  // 一覧の中のタグリンク。押すとページを読み込み直さずに絞り込む
  tagLinks: HTMLAnchorElement[];
  // 1件も合わないときに出すメッセージ
  emptyMessage: HTMLElement;
  // タグ以外の条件(Articles の検索語など)。省略時はタグだけで決める
  extraMatch?: (item: HTMLElement) => boolean;
}

export function setupTagFilter({ items, tagLinks, emptyMessage, extraMatch = () => true }: Options) {
  const chips = document.querySelectorAll<HTMLButtonElement>('.tag-filter__chip');
  const moreButton = document.querySelector<HTMLButtonElement>('.tag-filter__more');
  const entries = items.map((item) => ({ item, tags: JSON.parse(item.dataset.tags ?? '[]') as string[] }));

  let selectedTag = new URLSearchParams(location.search).get('tag') ?? '';
  let expanded = false;

  // 折りたたみ中も、選択中のタグのチップは見せておく(何で絞り込んでいるか分かるように)
  function updateChips() {
    chips.forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.tag === selectedTag));
      if (chip.dataset.extra !== undefined) chip.hidden = !expanded && chip.dataset.tag !== selectedTag;
    });
    if (moreButton) {
      moreButton.setAttribute('aria-expanded', String(expanded));
      const hiddenCount = [...chips].filter((chip) => chip.hidden).length;
      moreButton.textContent = expanded ? '閉じる' : `+${hiddenCount}`;
    }
  }

  // タグと追加の条件の両方を満たす項目だけを表示する
  function apply() {
    let visible = 0;
    for (const { item, tags } of entries) {
      const match = (selectedTag === '' || tags.includes(selectedTag)) && extraMatch(item);
      item.hidden = !match;
      if (match) visible++;
    }
    emptyMessage.hidden = visible > 0 || entries.length === 0;
    updateChips();
  }

  function selectTag(tag: string) {
    selectedTag = tag;
    const url = new URL(location.href);
    if (tag === '') url.searchParams.delete('tag');
    else url.searchParams.set('tag', tag);
    history.replaceState(null, '', url);
    apply();
  }

  chips.forEach((chip) => chip.addEventListener('click', () => selectTag(chip.dataset.tag ?? '')));
  moreButton?.addEventListener('click', () => {
    expanded = !expanded;
    updateChips();
  });
  // 一覧の中のタグリンクは、ページを読み込み直さずに絞り込む(入力中の検索語などを消さないため)
  tagLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      selectTag(new URL(link.href).searchParams.get('tag') ?? '');
    });
  });

  apply();
  // 追加の条件が変わったとき(検索語の入力など)に呼ぶ
  return { refresh: apply };
}

import { callApi, getCoursList} from "./animeApi.js";

/*** DOM ***/
const d_seasonsList = document.getElementById("d_seasonsList");
const d_season = document.getElementById("d_season");
const d_selectedSeasonsAnime = document.getElementById("d_selectedSeasonsAnime");



/*** 関数 ***/

// 過去のシーズンデータのリストデータ
const seasonsArray = {
    // 過去のシーズンデータのリスト
    list: [],
    getSeasonsList: function() {
        return this.list;
    },
    setSeasonsList: function() {
        this.list = Array.from(d_seasonsList.childNodes);
    },
    // 今選ばれている要素の番号
    selectedIndex: 0,
    getSelectedIndex: function() {
        return this.selectedIndex;
    },
    setIndex: function(index) {
        this.selectedIndex = index;
    },
}


// 指定されたシーズンを表示する
async function setAnimeData(cours) {
    setSeasonDisplay(cours);
    const result = await callApi(`${cours.year}/${cours.cours}`);
    setSelectedSeasonsAnimeList(result);
}


// 何年のどのシーズンのアニメが表示されているかを表示
function setSeasonDisplay(cours) {
    const season = getSeasons(cours.cours);
    d_season.innerText = `${cours.year}年 ${season}アニメ`;
}


// 指定されたシーズンのアニメのリストを生成
function setSelectedSeasonsAnimeList(result) {
    d_selectedSeasonsAnime.innerHTML = "";
    result.forEach(res => {
        const li = document.createElement("li");
        const dl = document.createElement("dl");
        const dt = document.createElement("dt");
        const h3 = document.createElement("h3");
        h3.innerText = res.title;
        dt.appendChild(h3);
        dl.appendChild(dt);
        dl.appendChild(ddCreate(res.public_url, 0));
        dl.appendChild(ddCreate(`https://twitter.com/${res.twitter_account}`, 1));
        li.appendChild(dl);
        d_selectedSeasonsAnime.appendChild(li);
    });
}
// 指定されたurlとurlのリンク先に応じてdd要素を生成する
function ddCreate(url, type) {
    const res = getLinkType(type);
    const dd = document.createElement("dd");
    dd.className = res.className;
    dd.appendChild(getDdLink(url, res.str));
    return dd;
}
// 指定されたtypeに応じて公式サイトか公式ツイッターの情報を返す
function getLinkType(type) {
    const urlList = [
        {str: "公式サイト", className: "dd_url_public"},
        {str: "公式Twitter", className: "dd_url_twitter"}
    ]
    return (type === 1) ? urlList[1] : urlList[0];
}
// ddタグに付与するリンクを生成する
function getDdLink(url, str) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.innerText = str;
    return link;
}

// 過去のシーズンリストを生成
async function setSeasonsList() {
    const cours = await getCoursList();
    cours.forEach(res => {
        const li = document.createElement("li");
        li.dataset.year = res.year;
        li.dataset.cours = res.cours;
        li.innerText = `${res.year}年${getSeasons(res.cours)}アニメ`;
        li.addEventListener("click", function(event) {
            seasonsList_li_clickEvent(event)
        });
        d_seasonsList.appendChild(li);
    });
}

// シーズンリストのクリックイベント
function seasonsList_li_clickEvent(event) {
    const target = event.target;
    // クリックされた要素が何番目かを判別
    const index = seasonsArray.list.findIndex(res => res === target);
    // クリックされた直前に選ばれていた要素が何番目かを判別
    const selectedIndex = seasonsArray.getSelectedIndex();
    // 選ばれていた要素番号と今回クリックされた要素番号が同じなら処理を中断
    if(selectedIndex === index) {
        return;
    }
    // 今回選ばれた要素の番号を記録
    seasonsArray.setIndex(index);
    // 前回選ばれていた要素から"selected"クラスを削除
    d_seasonsList.childNodes[selectedIndex].classList.remove("selected");
    // 今回選ばれた要素に"selected"クラスを付与
    d_seasonsList.childNodes[index].classList.add("selected");
    // クリックされた要素に変更されたかを、番号を取得して確かめる
    console.log(`index = ${index}, selestedIndex = ${seasonsArray.getSelectedIndex()}`);
    // クリックされた要素からシーズン情報を取り出す
    const cours = {year: target.dataset.year-0, cours: target.dataset.cours-0};
    // クリックされたシーズンのアニメを表示させる
    setAnimeData(cours);
    // クリックされたシーズンの情報を確認
    console.log(cours);        

}

// シーズンの名称を返す
function getSeasons(cours) {
    const coursList = [
        {cours: 1, season: "冬"},
        {cours: 2, season: "春"},
        {cours: 3, season: "夏"},
        {cours: 4, season: "秋"}
    ];
    const res = coursList.find(res => res.cours === cours);
    return res.season;
}

function getCours(month) {
    const coursNum = Math.floor(month / 4) + 1;
    console.log(coursNum);
    return coursNum;
}


/*** イベント ***/
window.onload = async function() {
    await setSeasonsList();
    seasonsArray.setSeasonsList();
    d_seasonsList.lastElementChild.click();
}
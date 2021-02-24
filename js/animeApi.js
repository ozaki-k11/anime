/*

ShangriLa Anime API Server
アニメ作品の情報を返すREST形式のAPIサーバー

秋葉原IT戦略研究所が無料で提供しているAPI
GithubのURL
https://github.com/Project-ShangriLa/sora-playframework-scala#shangrila-anime-api-server-%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E6%A6%82%E8%A6%81

*/


// エンドポイント
const endPoint = "https://api.moemoe.tokyo/anime/v1";

// 実際に使うアドレス
const apiUrl = `${endPoint}/master/`;


/*** 実際に使う処理 ***/

// apiのURLを使って実際にデータを取得する処理
async function callApi(requestUrl) {
    const res =  await fetch(`${apiUrl}${requestUrl}`);
    if(res.ok) {
        const result = await res.json();
        return　result;
    }
    throw new Error(response.status);
};

// アニメ情報のクールごとの情報のリストを取得
async function getCoursList() {
    const list = await callApi("cours");
    return Object.values(list);
};

export {callApi, getCoursList};
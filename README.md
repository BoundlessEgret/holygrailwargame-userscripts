# 聖杯之夜 Tampermonkey 腳本

適用於[聖杯之夜](https://holygrailwargame.cupnight.workers.dev/)的兩支非官方腳本：自選從者聖遺物，以及每次新人生必定取得 A 級魔術迴路。

## 安裝

1. 在瀏覽器安裝 Tampermonkey。
2. 開啟要使用的腳本連結，按 Tampermonkey 的「安裝」：
   - [自選從者聖遺物](https://raw.githubusercontent.com/BoundlessEgret/holygrailwargame-userscripts/main/cupnight-servant-relic-picker.user.js)
   - [每局必定 A 迴路](https://raw.githubusercontent.com/BoundlessEgret/holygrailwargame-userscripts/main/cupnight-every-life-a.user.js)
3. 重新整理遊戲頁面。兩支可以同時啟用。

## 自選從者聖遺物

點遊戲右下角的「🎯 選擇本局從者」，用搜尋或職階篩選選擇從者。面板固定使用繁體中文，包含 135 名可契約從者的名稱與聖遺物名稱。

- **尚未召喚**：選擇立即套用本局，聖遺物會加入行囊；召喚時自動選用它。
- **已經召喚**：選擇留給下局，新人生開始時套用。
- 遊戲的少數特殊判定可能改寫聖遺物召喚；腳本會用遊戲內建的從者指定鉤子保底，確保召喚結果是所選從者。
- 面板的「遊戲改成繁中」會切換遊戲語言並重新整理頁面。

殺生院祈荒是 Beast Ⅲ/R 劇情頭目，不在可契約從者名單中。

## 每局必定 A 迴路

啟用後，**每次新人生**都會使用遊戲原本的出生規則重抽，直到魔術迴路為 A。它不指定從者，能和自選從者面板一起使用。

## 避免腳本衝突

請停用其他會指定從者或自動跑完整段人生的腳本，例如先前的「一鍵刷成就」或「指定吉爾伽美什」腳本；它們可能覆蓋面板的選擇。

這些腳本與遊戲作者無關。遊戲原始碼：[cupnight/holygrailwargame](https://github.com/cupnight/holygrailwargame)。

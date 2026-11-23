## 論点1: repository rootとplugin配布境界の分離

**ステータス:** 決定

**種別:** TBDヒアリング

**提起の背景:** 現在はrepository root自体が`tumeda-dev` plugin rootを兼ねているため、pluginが参照する実行時リソースと、plugin開発者向けの文書・検証toolを構造上分離しにくい。将来pluginを増やす場合のmarketplace rootとplugin rootの責務も同一directoryへ重なっている。

### 議論の変遷

#### 事象の記述
- ユーザーから、repository root直下の`skills/`ではなく、`plugins/<plugin-name>/`配下へmanifest・skills・plugin実行時リソースをまとめる構成が成立するか質問があった。
- 公式仕様を確認した結果、CodexとClaude Codeはいずれもmarketplaceからrepository内のplugin subdirectoryを参照でき、plugin root内にskillsと補助リソースを置けることが分かった。

#### 原因の追跡
- なぜ: repository rootとplugin rootを同一視していたため、配布物と開発用ファイルの境界がdirectory構造へ現れていなかった。
- なぜ: repositoryが単一pluginだけを持つ初期構成では`source: "./"`で十分だったが、pluginを順次切り出す将来像に対して構造が追随していなかった。
- なぜ: skill固有リソース、plugin共有リソース、repository開発用リソースの所有境界を先に定義せず、配置例の有無をpluginの表現力として捉えていた。

#### 根本原因₀ + 提案₀
- **根本原因₀**: marketplace/development repositoryとinstallable plugin packageの責務境界が、filesystem上で同じrootへ畳み込まれている。
- **提案₀**:
  - 総論: repository rootをmarketplace/development root、`plugins/tumeda-dev/`をinstallable plugin rootとして分離する。
  - 各論:
    - ルール: pluginとしてinstall後に必要なmanifest・skills・補助ファイルだけを`plugins/tumeda-dev/`内へ置き、repository開発用文書・検証tool・marketplace catalogはrepository rootへ残す。
    - 適用例: `.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`skills/`は`plugins/tumeda-dev/`へ移し、`.agents/plugins/marketplace.json`、`.claude-plugin/marketplace.json`、`scripts/verification/`、repository `README.md`はrootへ残す。

#### イテレーション1

##### 検証
- **観点**: ユーザーは、構成例にある`references/`などを配置形だけ整える目的で作る必要はないと明示した。
- **弱点**: 提案₀を例示treeの完全再現として実施すると、利用者も参照元も存在しない空directoryを作り、現在の責務以上の構造を先取りしてしまう。

##### 修正先の判断
- **提案レベル**: repositoryとpluginの境界分離は維持し、plugin root内の任意directory作成条件だけを厳密化する。

##### 根本原因1 + 提案1
- **根本原因1**: directory例は利用可能な選択肢を示すものであり、plugin packageが満たすべき必須schemaではない。
- **変更点**: `references/`、`assets/`、`hooks/`、`scripts/`等を完成treeの必須要素から外し、現在存在するplugin内容だけを移す。
- **提案1（現時点）**:
  - 総論: 配布境界は分離するが、実体のない任意directoryは新設しない。
  - 各論:
    - ルール: directoryは現在のファイルを収容する場合、または具体的な利用者と内容が同時に追加される場合だけ作成する。
    - 適用例: 現在の`skills/task-design/templates/`はskills treeと共に移す一方、plugin root直下の空`templates/`は作らない。

**決定:** repository rootをmarketplace/development root、`plugins/tumeda-dev/`をinstallable plugin rootへ分離する。plugin名は維持し、現在存在するplugin内容だけを移し、例示にしか存在しない任意directoryは作らない。

**ネクストアクション:** `design.md`へ完成後tree、移動mapping、manifest・marketplace path、version同期、検証script更新、非目標を確定し、その設計から実行可能な`tasklist.md`を作成する。

## 論点2: 実装フローで決めた配置を永続知識として扱う条件

**ステータス:** 決定

**種別:** 認識齟齬 / レビュー指摘

**提起の背景:** tasklist承認後のdoc-enricherレビューで、今回のpackage移動から導いたrepository rootとplugin rootの役割、および空の任意directoryを作らない判断をREADMEへ追記する提案を出した。しかし、その提案が今回の変更を進めるためのフロー情報と、次回以降も明示的に維持すべきストック情報を区別できていなかった。

### 議論の変遷

#### 事象の記述
- AIは、filesystem構造の選択理由がコードだけでは分からないとして、repository rootとplugin rootの役割をREADMEへ追記する候補を提示した。
- ユーザーは、今回の議論で生じたフロー情報にすぎないものを、なぜストック情報として残すのかと指摘した。

#### 原因の追跡
- なぜ: 「設計判断である」ことを、永続知識として残す十分条件だと扱った。
- なぜ: doc-enricherのGate C「非自明」とGate F「タスク固有でない原則」を、完成後のfilesystemとmanifestから直接読み取れるかという具体で検算しなかった。
- なぜ: discussionに記録する判断経緯と、READMEへ昇格させる不変条件の保存先を混同した。

#### 根本原因₀ + 提案₀
- **根本原因₀**: 設計過程で重要だった情報と、完成後もREADMEで維持すべき情報を同一視した。
- **提案₀**:
  - 総論: READMEへrepository rootとplugin rootの責務境界、および任意directoryの作成条件を追記する。
  - 各論:
    - ルール: pluginのinstall後に必要なものをplugin root、開発用資産をrepository rootへ置く方針をREADMEに残す。
    - 適用例: `plugins/tumeda-dev/`をinstallable plugin rootと明記し、空の`references/`を作らない判断を補足する。

#### イテレーション1

##### 検証
- **観点**: ユーザーは、この情報は今回の議論と移動を進めるためのフロー情報であり、ストック情報へ昇格させる根拠がないと指摘した。
- **弱点**: 完成後はmarketplace sourceとdirectory treeを見ればplugin rootを特定できる。「空の任意directoryを作らない」は今回のスコープ制御であって、将来具体的な利用者が生じた場合にも守る不変条件ではない。README追記はコードリーディングを省く高レバレッジ知識にならず、構造と重複して腐る説明を増やす。

##### 修正先の判断
- **診断レベルへの遡及**: README文言の修正ではなく、候補をストック情報と判定した前提を撤回する。

##### 根本原因1 + 提案1
- **根本原因1**: discussionで保存済みの設計経緯を、追加の永続文書へ重複保存しようとした。
- **変更点**: README追記提案を撤回し、構造移動で既存READMEのpathが壊れる場合だけ必要最小限に追随する。今回だけのスコープ判断はdesign、discussion、tasklistに留める。
- **提案1（現時点）**:
  - 総論: 今回の議論からREADMEへ昇格させるストック情報はない。
  - 各論:
    - ルール: 完成後の構造やmanifestから直接分かる情報、今回だけの非目標、作業手順はREADMEへ重複記載しない。
    - 適用例: `plugins/tumeda-dev/`という完成pathはfilesystemとmarketplace sourceに任せ、空directoryを作らない判断は今回のdesignとtasklistだけに残す。

**決定:** READMEへの新規「repository構造・空directory作成原則」追記案を撤回する。今回の議論から新たにストック情報へ昇格させる知識はない。既存READMEは、移動で既存記述の参照先が壊れる場合だけ必要最小限に更新する。

**ネクストアクション:** tasklistからREADMEへの構造説明追加を除き、既存記述のpath追随が実際に必要かを実装時に検証する。不要ならREADMEを変更しない。

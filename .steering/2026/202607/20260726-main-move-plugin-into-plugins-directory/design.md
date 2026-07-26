# Design: tumeda-dev pluginをrepository内のplugin directoryへ分離する

## 元の依頼内容

› プラグインリポジトリについて、リポジトリ直下にskillsを置くやり方もあるけど、こんなやりかたもありな
の？ プラグイン内のskillが参照するdocsもプラグイン内に入れたいと思ったらトップ直下のskillsじゃあ貧弱
と思ってしまって。
  ---
ai_agent_dev_skill_plugin/
├── .claude-plugin/
│   └── marketplace.json
├── .agents/
│   └── plugins/
│       └── marketplace.json
│
├── plugins/
│   └── ai-agent-dev/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── .codex-plugin/
│       │   └── plugin.json
│       │
│       ├── skills/
│       ├── agents/             # Claude Code用
│       ├── hooks/
│       │   └── hooks.json
│       ├── scripts/
│       ├── references/
│       ├── templates/
│       ├── assets/
│       ├── .mcp.json
│       └── README.md
│
├── docs/                       # plugin開発者向け文書
├── examples/                   # 導入例・設定例
├── tests/
└── tools/                      # ビルド・検証・インストール用

> ありがとう。じゃあ $REPO_ROOT/plugins/<plugin-name> 構成にしたい。references/ とか例にだけあるやつは無理やり作らなくていい

---

## 1. TL;DR

repository rootがmarketplace catalog、plugin配布物、開発用ファイルを同時に担っている状態を解消し、配布境界を明確にする。repository rootはmarketplace/development root、`plugins/tumeda-dev/`はinstallable plugin rootとし、既存のmanifestとskills treeだけをplugin rootへ移す。marketplace、ローカル開発用symlink、検証script、文書内path、release versionを新しい境界に同期し、現在存在しない任意directoryは作らない。

---

## 前提とする既存仕様

- **plugin identity**: plugin名はCodex manifest、Claude manifest、両marketplace catalogで`tumeda-dev`に統一されており、今回も維持する。
- **現行配布境界**: repository root直下の`.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`skills/`が1つのpluginを構成し、両marketplace catalogはrepository rootをsourceにしている。
- **skill内リソース**: `skills/`には各`SKILL.md`だけでなく、`templates/`、`scripts/`、`example/`、`agents/`、`maintenance_policies/`と、skills共通の`runtime-execution-contracts.md`、`runtime-model-profiles.md`がある。これらの相対参照はskills tree内で完結している。
- **repository開発用ファイル**: rootの`README.md`、`AGENTS.md`、`scripts/`、marketplace catalogはpluginの開発・検証・公開元管理に使う。
- **ローカル開発用リンク**: `.agents/skills`はrootの`skills/`を指し、`.claude/skills`は`.agents/skills`を経由する。`docs/maintenance_policies`もrootの`skills/maintenance-plugin-context/maintenance_policies`を指す。
- **version規約**: release versionはsuffixやcachebusterを持たない正式な`MAJOR.MINOR.PATCH`だけを使い、後方互換な構造修正はPATCHを上げる。現行versionは`1.1.0`である。
- **version同期対象**: Codex plugin manifest、Claude plugin manifest、Claude marketplaceの`tumeda-dev` entry、既存validatorが同期対象としているClaude marketplace root versionの4値を一致させる。
- **現行検証**: `node scripts/verification/validate-plugin.mjs`はmanifest version、skill本文の必須契約、portable fileの禁止項目を検証し、変更前の状態で成功する。
- **履歴成果物**: `.steering/`配下の過去成果物は当時のpathを記録する履歴であり、現行構造への移行対象ではない。

---

## 2. 要件（Requirements）

### MUST（必達）

- repository rootをmarketplace/development root、`plugins/tumeda-dev/`をinstallable plugin rootとして分離する。
- `.codex-plugin/plugin.json`、`.claude-plugin/plugin.json`、`skills/`を内容とtree構造を保ったまま`plugins/tumeda-dev/`へ移す。
- `.claude-plugin/marketplace.json`と`.agents/plugins/marketplace.json`はrepository rootに残し、両方が`./plugins/tumeda-dev`をsourceとして指すようにする。
- plugin名`tumeda-dev`を変更しない。
- pluginとして配布する4つのversion宣言を正式SemVerの`1.1.1`へ同期する。
- `scripts/verification/validate-plugin.mjs`がnested plugin root、両marketplace source、`1.1.1`、移動後のskills treeを検証するようにする。
- validatorはmarketplace配列の位置ではなく`name: "tumeda-dev"`で対象entryを識別し、将来同じrepositoryへ別pluginが加わっても`tumeda-dev`の検証意味が変わらないようにする。
- 現行pathを前提にするAGENTS指示、READMEの既存path参照、maintenance-plugin-contextのmanifest記述、ローカル開発用symlinkを新しいpathへ更新する。
- 既存skill内の相対参照を維持し、`runtime-execution-contracts.md`と`runtime-model-profiles.md`を含むskills tree全体を同じ境界で移す。
- `.steering/`配下の過去成果物を変更しない。

### SHOULD（できれば）

- なし。実装時に選択を残す任意要件は設けない。

### MAY（あれば嬉しい）

- なし。

### 非目標

- `references/`、`assets/`、`hooks/`、plugin root直下の`templates/`や`scripts/`など、現在存在しない任意directoryを例示に合わせて新設しない。
- skill固有の`templates/`、`scripts/`、`example/`、`maintenance_policies/`やskills直下のruntime文書を再分類しない。
- plugin名、marketplace名、description、author、category、installation policy、authentication policyを変更しない。
- skill本文の実行契約、prompt、template内容を構造移動以外の理由で変更しない。
- repository rootの開発用ファイルをplugin package内へ移さない。
- UI、DB、API、アプリケーション実行時挙動を変更しない。
- pluginのpublish、外部marketplace登録、利用環境へのinstall/reinstallを実行しない。
- `.steering/`配下の過去成果物に残る旧pathを現行pathへ書き換えない。

### 受け入れ基準

- `plugins/tumeda-dev/.codex-plugin/plugin.json`、`plugins/tumeda-dev/.claude-plugin/plugin.json`、`plugins/tumeda-dev/skills/`が存在し、移動前の対応物はrepository rootに残っていない。
- 移動前に`skills/`配下でGit管理されていた全ファイルが、相対pathとfile modeを保って`plugins/tumeda-dev/skills/`配下に存在する。
- `.claude-plugin/marketplace.json`の`tumeda-dev.source`が`"./plugins/tumeda-dev"`であり、`.agents/plugins/marketplace.json`の`tumeda-dev.source.path`も`"./plugins/tumeda-dev"`である。
- Codex manifest、Claude manifest、Claude marketplace root、Claude marketplaceの`tumeda-dev` entryのversionがすべて`1.1.1`である。`.agents/plugins/marketplace.json`には新たなversion fieldを追加しない。
- Codex manifestの`skills`はplugin root相対の`"./skills/"`を維持する。
- `.agents/skills`と`docs/maintenance_policies`が移動後の実体へ解決し、`.claude/skills`からも同じskills treeへ到達できる。
- 現行ファイルを対象にした旧root path参照が、構造の説明に必要な移動元表記を除いて残っていない。
- 現在存在しない任意directoryが新設されていない。
- `node scripts/verification/validate-plugin.mjs`が成功し、`git diff --check`が成功する。
- `.steering/`配下では、この作業用directoryに追加する設計・tasklist成果物以外の差分がない。

---

## 3. 完成後の姿

### 3-1. 配布・開発フロー

**ケース: Codex marketplaceから`tumeda-dev`を解決する**

1. Codex側のcatalog readerがrepository rootの`.agents/plugins/marketplace.json`から`name: "tumeda-dev"`を選ぶ。
2. entryのlocal source path `./plugins/tumeda-dev`をrepository rootから解決する。
3. `plugins/tumeda-dev/.codex-plugin/plugin.json`をplugin manifestとして読み、同manifestの`"./skills/"`をplugin root相対で解決する。
4. `plugins/tumeda-dev/skills/`配下の既存skillsと同梱リソースが1つのplugin packageとして利用可能になる。

**ケース: Claude marketplaceから`tumeda-dev`を解決する**

1. Claude側のcatalog readerがrepository rootの`.claude-plugin/marketplace.json`から`name: "tumeda-dev"`を選ぶ。
2. entryのsource `./plugins/tumeda-dev`をrepository rootから解決する。
3. `plugins/tumeda-dev/.claude-plugin/plugin.json`と`plugins/tumeda-dev/skills/`を同じplugin root内の配布物として利用する。

**ケース: repository内でskillsを開発・検証する**

1. Codex向けの`.agents/skills`は`../plugins/tumeda-dev/skills`を指す。
2. Claude向けの`.claude/skills`は従来どおり`../.agents/skills`を指し、同じskills treeへ到達する。
3. maintenance policyの開発用導線`docs/maintenance_policies`は`../plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies`を指す。
4. 開発者が`node scripts/verification/validate-plugin.mjs`を実行すると、rootのcatalogとnested plugin packageを横断してversion、source、skill契約を検証する。

### 3-2. 設定値

永続データモデルの変更はない。完成後の配布設定は次の値になる。

| 設定 | 配置 | 完成値 |
|---|---|---|
| plugin名 | `plugins/tumeda-dev/.codex-plugin/plugin.json` | `tumeda-dev` |
| Codex plugin version | `plugins/tumeda-dev/.codex-plugin/plugin.json` | `1.1.1` |
| Codex skills path | `plugins/tumeda-dev/.codex-plugin/plugin.json` | `./skills/` |
| Claude plugin version | `plugins/tumeda-dev/.claude-plugin/plugin.json` | `1.1.1` |
| Claude marketplace root version | `.claude-plugin/marketplace.json` | `1.1.1` |
| Claude marketplace plugin version | `.claude-plugin/marketplace.json`の`tumeda-dev` entry | `1.1.1` |
| Claude marketplace source | `.claude-plugin/marketplace.json`の`tumeda-dev` entry | `./plugins/tumeda-dev` |
| Codex marketplace source | `.agents/plugins/marketplace.json`の`tumeda-dev` entry | `{ "source": "local", "path": "./plugins/tumeda-dev" }` |
| validator期待release | `scripts/verification/validate-plugin.mjs` | `1.1.1` |

### 3-3. 命名・公開境界

#### (A) 命名・公開API

- plugin identityは`tumeda-dev`を維持する。
- marketplace identityは`tumeda-dev-plugins`を維持する。
- 新しいclass、function、CLI、公開APIは追加しない。
- filesystem上の公開境界は`plugins/tumeda-dev/`とし、marketplace sourceがこのdirectoryを指す。
- Codex manifestの`skills: "./skills/"`はplugin root相対pathとして維持する。repository rootから見たpathへ展開しない。

#### (B) モジュール境界・完成後tree

```text
ai_agent_dev_skill_plugin/
├── .agents/
│   ├── plugins/
│   │   └── marketplace.json
│   └── skills -> ../plugins/tumeda-dev/skills
├── .claude/
│   └── skills -> ../.agents/skills
├── .claude-plugin/
│   └── marketplace.json
├── plugins/
│   └── tumeda-dev/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── .codex-plugin/
│       │   └── plugin.json
│       └── skills/
│           ├── design-consult/
│           ├── doc-enricher/
│           ├── maintenance-plugin-context/
│           │   ├── agents/
│           │   └── maintenance_policies/
│           ├── steering/
│           │   ├── scripts/
│           │   └── templates/
│           ├── task-design/
│           │   └── templates/
│           ├── tasklist-executor/
│           ├── test-runner/
│           ├── think-through/
│           ├── visual-inspector/
│           │   └── example/
│           ├── runtime-execution-contracts.md
│           ├── runtime-model-profiles.md
│           └── tumeda-dev-plugin-context.md
├── docs/
│   └── maintenance_policies -> ../plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies
├── scripts/
│   ├── for_local/
│   └── verification/
│       └── validate-plugin.mjs
├── tests/
├── .gitignore
├── AGENTS.md
├── CLAUDE.md -> AGENTS.md
└── README.md
```

**境界のルール**

- `plugins/tumeda-dev/`には、pluginをinstallした後に必要なmanifestと既存skills treeだけを置く。
- repository rootには、複数pluginを収容できるmarketplace catalog、開発者向け文書、検証tool、ローカル開発用リンクを置く。
- skill固有リソースは現在のskill directory内に留め、複数skill共有文書も今回は`skills/`直下の現在位置を維持する。
- directoryは収容する実ファイルがある場合だけ作り、構成例を満たす目的では作らない。

### 3-4. path mappingとファイル系deliverable

#### 移動mapping

| 移動前 | 移動後 | 内容 |
|---|---|---|
| `.codex-plugin/plugin.json` | `plugins/tumeda-dev/.codex-plugin/plugin.json` | Codex plugin manifest。versionのみ`1.1.1`へ更新し、`skills`は`./skills/`を維持する |
| `.claude-plugin/plugin.json` | `plugins/tumeda-dev/.claude-plugin/plugin.json` | Claude plugin manifest。versionのみ`1.1.1`へ更新する |
| `skills/**` | `plugins/tumeda-dev/skills/**` | 全descendantを同じ相対pathとfile modeで移す |

#### rootに残すファイルと更新内容

| ファイル | 更新内容 |
|---|---|
| `.claude-plugin/marketplace.json` | rootに残す。root versionと`tumeda-dev` entry versionを`1.1.1`へし、entry sourceを`./plugins/tumeda-dev`へ変更する |
| `.agents/plugins/marketplace.json` | rootに残す。`tumeda-dev.source.path`を`./plugins/tumeda-dev`へ変更する |
| `scripts/verification/validate-plugin.mjs` | rootに残す。plugin内pathを`plugins/tumeda-dev/`起点へ切り替え、sourceとversionの期待値を追加・更新する |
| `AGENTS.md` | migration policyの現行pathを`plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies/migration.md`へ変更する |
| `README.md` | 新しい構造説明は追加せず、既存のruntime profile参照だけを`plugins/tumeda-dev/skills/runtime-model-profiles.md`へ追随させる |
| `plugins/tumeda-dev/skills/maintenance-plugin-context/SKILL.md` | version同期対象のmanifest pathをnested plugin pathへ変更し、Claude marketplace root versionも同期対象として明記する |

#### symlink mapping

| symlink | 完成後target | 扱い |
|---|---|---|
| `.agents/skills` | `../plugins/tumeda-dev/skills` | targetを変更する |
| `.claude/skills` | `../.agents/skills` | 現状維持する |
| `docs/maintenance_policies` | `../plugins/tumeda-dev/skills/maintenance-plugin-context/maintenance_policies` | targetを変更する |
| `CLAUDE.md` | `AGENTS.md` | 現状維持する |

#### validatorの完成仕様

- repository rootは引き続きscript位置から`../..`で解決する。
- `pluginRoot`は`plugins/tumeda-dev`として一箇所に定義し、Codex manifest、Claude manifest、portable file、skill契約の各pathをこのroot配下として読む。
- `.claude-plugin/marketplace.json`と`.agents/plugins/marketplace.json`はrepository rootから読む。
- 両marketplaceで`name: "tumeda-dev"`のentryを特定し、Claude sourceとCodex local source pathがどちらも`./plugins/tumeda-dev`であることを検証する。
- `expectedRelease`を`1.1.1`とし、Codex manifest、Claude manifest、Claude marketplace root、Claude marketplaceの`tumeda-dev` entryの4値がすべてこの値と一致することを検証する。
- 既存のskill本文・frontmatter・runtime contract・portable file検証は意味を変えず、対象pathだけをnested plugin rootへ切り替える。

---

## 4. なぜこの姿か（設計判断）

### 設計選択と理由

repository rootとplugin rootを分けることで、marketplaceの管理・開発用検証と、install対象になるplugin packageの責務がfilesystem上でも一致する。plugin名とskills tree内の相対配置を維持するため、利用者から見えるskill identityとskill間契約は変わらず、変更は配布sourceの境界に限定される。

versionは、この移動が既存plugin identityと機能契約を維持する後方互換なpackage修正であるためPATCHの`1.1.1`とする。repository固有規約に従い、構造変更のcache反映を理由とするsuffixや日時cachebusterは使わない。

rootのdevelopment symlinkは単なる文書参照ではなく、現在のCodex・Claude向けskill発見経路である。plugin本体の移動と同時にtargetを付け替えることで、配布構造を正しながらrepository内の開発導線を維持する。

### 代替構成と見送る理由

- **repository rootをplugin rootのまま維持する**: 配布物とmarketplace/development資産の境界が同じdirectoryに残り、今回の目的を満たさない。
- **plugin rootへ開発用ファイルもまとめて移す**: install対象とrepository保守用ファイルが再び混在し、配布境界が不明確になる。
- **plugin root直下に任意directoryを先行作成する**: 現在の利用者や内容がなく、責務を持たない空構造になる。
- **skills共通文書をplugin root直下の`references/`へ再分類する**: skill内相対参照と所有境界を同時に変更し、package移動だけという今回の変更範囲を越える。
- **versionを維持する、またはcachebusterを付ける**: 配布物の構造変更をreleaseとして識別できないか、正式SemVerのみというrepository固有規約に反する。
- **plugin名をdirectory名変更と同時に変える**: 既存利用者から見たidentity変更になり、単なるpackage境界移動を破壊的変更へ広げる。

---

## 5. リスクと対策

| リスク | 対策 |
|---|---|
| marketplace sourceが旧rootのままで、移動後manifestを発見できない | 両catalogのsourceを同じ`./plugins/tumeda-dev`へ更新し、validatorで両方を検証する |
| manifestだけ移動し、skill検証pathやskills treeの一部が旧rootに残る | `skills/**`をtree単位で移し、Git管理対象の対応、validatorの全skill path、旧root不在を確認する |
| `.agents/skills`がdangling symlinkになり、repository内でplugin skillsを発見できない | targetをnested skills pathへ付け替え、`.claude/skills`からの連鎖を含めて実体解決を確認する |
| `docs/maintenance_policies`がdangling symlinkになり、保守規約への導線が壊れる | nested maintenance policy directoryへtargetを付け替えて実体解決を確認する |
| manifestとmarketplaceのversionがずれて別releaseとして扱われる | 4宣言を`1.1.1`へ同期し、validatorで型・一致・期待値を検証する |
| validatorのpath置換漏れにより、移動後に検証自体が旧ファイルを探す | plugin rootを一箇所に定義し、既存検証対象をすべてそのrootから導く |
| `.steering/`の旧pathを現行参照と誤認して履歴を書き換える | stale path検索と差分確認では`.steering/`を除外し、今回の成果物追加以外を変更しない |
| package移動と同時にresource再分類を行い、skill内相対参照を壊す | skills tree内の相対pathを完全維持し、共有docs再分類を非目標に固定する |
| 空directoryを完成treeの必須要素と誤認する | Git管理中の既存実体だけを移し、任意directoryの新設がないことを差分で確認する |

---

## 6. 検証方針

- **構造検証**: nested manifestとskills treeが存在し、旧rootのmanifestと`skills/`が存在しないことを確認する。
- **移動完全性**: 変更前のGit管理対象`skills/**`と、変更後の`plugins/tumeda-dev/skills/**`をprefix差し替えで対応付け、file modeと内容が構造変更・明示更新対象を除いて一致することを確認する。
- **JSON検証**: 両manifestと両marketplace catalogをparseし、plugin名、source、4つのversion宣言、Codex skills pathをvalidatorで確認する。
- **skill契約回帰**: `node scripts/verification/validate-plugin.mjs`を実行し、既存のfrontmatter、runtime contract、portable file検証を移動後pathで通す。
- **symlink検証**: `.agents/skills`、`.claude/skills`、`docs/maintenance_policies`、`CLAUDE.md`がすべて存在する実体へ解決することを確認する。
- **stale path検証**: `.steering/`を除く現行ファイルから、旧root manifest path、旧root skills path、marketplaceの`"./"` sourceを検索し、設計で残すと定めた表記以外に実行時参照がないことを確認する。
- **差分品質**: `git diff --check`を実行し、`.steering/`の過去成果物に差分がないこと、新規任意directoryがないこと、移動対象外のroot開発用ファイルが維持されていることを確認する。

---

## （付録）変更点一覧

### plugin package

- `.codex-plugin/plugin.json`を`plugins/tumeda-dev/.codex-plugin/plugin.json`へ移し、versionを`1.1.1`へ更新する。
- `.claude-plugin/plugin.json`を`plugins/tumeda-dev/.claude-plugin/plugin.json`へ移し、versionを`1.1.1`へ更新する。
- `skills/`全体を`plugins/tumeda-dev/skills/`へ移す。
- 移動後の`maintenance-plugin-context/SKILL.md`にあるmanifest pathとversion同期対象を現行構造へ更新する。

### marketplace/development root

- `.claude-plugin/marketplace.json`のsourceと2つのversion宣言を更新する。
- `.agents/plugins/marketplace.json`のlocal source pathを更新する。
- `.agents/skills`と`docs/maintenance_policies`のsymlink targetを更新する。
- `AGENTS.md`と`README.md`では、移動で壊れる既存path記述だけを更新する。
- `scripts/verification/validate-plugin.mjs`のplugin root、検証対象path、source検証、release期待値を更新する。

### 変更しない対象

- `.claude/skills`、`CLAUDE.md`のsymlink target。
- repository rootの`README.md`、`AGENTS.md`、`scripts/`、`tests/`という配置。
- skills tree内部の配置と相対参照。
- `.steering/`配下の過去成果物。

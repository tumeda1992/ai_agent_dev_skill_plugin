このディレクトリのskillsは `../plugins/tumeda-dev/skills`のシンボリックリンクである。

そのため `skills/tumeda-dev-plugin-context.md` は利用先向けのcontext instanceではなく、配布されるtemplate実体を指す。`maintenance-plugin-context` の解決手順をこのrepositoryで実行し、instanceとして書き込むと配布templateを汚染する。

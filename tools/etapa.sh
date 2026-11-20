N=$1
M=${2:-gemini/gemini-3.6-flash}
echo "USANDO MODELO: $M"
aider --subtree-only --model $M --weak-model $M --editor-model $M --edit-format diff --yes-always --no-detect-urls --no-auto-commits --no-auto-test \
  --read docs/DIRECCION.md --read docs/etapas/$N.md \
  --file src/Root.tsx --file src/explained/SceneCard.tsx --file src/explained/ExplainedVideo.tsx --file src/explained/data.ts \
  --message "Ejecuta la ETAPA $N de docs/etapas/$N.md. Si ya hay trabajo hecho, solo completa lo que falta. Conserva el id ExplainedShort. No instales dependencias. No pidas abrir links."
npx tsc --noEmit && echo ETAPA $N OK

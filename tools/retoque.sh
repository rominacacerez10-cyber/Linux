M=${2:-gemini/gemini-3.6-flash}
aider --subtree-only --model $M --weak-model $M --editor-model $M --edit-format diff --yes-always --no-detect-urls --no-auto-commits --no-auto-test \
  --read docs/DIRECCION.md --file src/explained/layers/Fx.tsx --file src/explained/layers/Slam.tsx --file src/explained/Captions.tsx \
  --message "$1"
npx tsc --noEmit && echo RETOQUE OK

N=$1
aider --subtree-only --model gemini/gemini-3.7-flash --edit-format diff --yes-always --no-detect-urls --no-auto-commits --no-auto-test \
  --read docs/DIRECCION.md --read docs/etapas/$N.md \
  --file src/Root.tsx --file src/explained/SceneCard.tsx --file src/explained/ExplainedVideo.tsx --file src/explained/data.ts --file src/explained/world3d/TestShot.tsx --file src/explained/world3d/CameraRig.tsx --file src/explained/world3d/City.tsx --file src/explained/world3d/Lights.tsx \
  --message "Ejecuta la ETAPA $N de docs/etapas/$N.md completa. Conserva el id ExplainedShort. No instales dependencias."
npx tsc --noEmit && echo ETAPA $N OK

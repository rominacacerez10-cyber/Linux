set -e
i=1
while IFS= read -r frase; do
  edge-tts --voice es-MX-JorgeNeural --rate=+6% --pitch=-4Hz --text "$frase" --write-media public/audio/vo/s0$i.mp3
  i=$((i+1))
done <<'TXT'
Se abrieron las puertas... y el internet se volvió LOCO.
En minutos, clips por todos lados. Tu feed ya no era tu feed.
¿Y la comunidad? Cero respeto: autos volando, persecuciones, puro desmadre.
Y las físicas... los detalles... la gente pausando solo para mirar.
Pero lo que nadie esperaba... fue esto.
Dime la verdad... ¿qué fue lo primero que hiciste? Comenta.
TXT
python3 tools/retime.py
python3 tools/premium_audio.py
npx tsc --noEmit && echo TODO LISTO

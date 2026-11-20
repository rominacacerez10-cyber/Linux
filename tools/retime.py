import re
from mutagen.mp3 import MP3
TEXTS = [
 "Se abrieron las puertas... y el internet se volvió LOCO.",
 "En minutos, clips por todos lados. Tu feed ya no era tu feed.",
 "¿Y la comunidad? Cero respeto: autos volando, persecuciones, puro desmadre.",
 "Y las físicas... los detalles... la gente pausando solo para mirar.",
 "Pero lo que nadie esperaba... fue esto.",
 "Dime la verdad... ¿qué fue lo primero que hiciste? Comenta.",
]
src = open("src/explained/timings.ts", encoding="utf-8").read()
files = re.findall(r'"file":\s*"([^"]+)"', src)
out = []
for i, text in enumerate(TEXTS):
    f = files[i] if i < len(files) else f"audio/vo/s0{i+1}.mp3"
    dur = round(MP3(f"public/audio/vo/s0{i+1}.mp3").info.length, 2)
    words = text.split()
    w = [len(x) + 1 for x in words]
    total, t, ws = sum(w), 0.0, []
    for x, k in zip(words, w):
        d = (dur - 0.15) * k / total
        ws.append({"text": x, "startSec": round(t, 3), "endSec": round(t + d, 3)})
        t += d
    out.append({"scene": i + 1, "file": f, "durationSec": dur, "words": ws})
import json
head = """export const VO_TIMINGS: {
  scene: number;
  file: string;
  durationSec: number;
  words: { text: string; startSec: number; endSec: number }[];
}[] = """
open("src/explained/timings.ts", "w", encoding="utf-8").write(head + json.dumps(out, ensure_ascii=False, indent=2) + ";\n")
print([o["durationSec"] for o in out])

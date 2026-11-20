#!/usr/bin/env python3
import asyncio
import json
import os
import subprocess
import wave
import edge_tts

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VO_DIR = os.path.join(BASE_DIR, "public", "audio", "vo")
SFX_DIR = os.path.join(BASE_DIR, "public", "audio", "sfx")
MUSIC_PATH = os.path.join(BASE_DIR, "public", "audio", "music.wav")
TIMINGS_TS_PATH = os.path.join(BASE_DIR, "src", "explained", "timings.ts")

os.makedirs(VO_DIR, exist_ok=True)
os.makedirs(SFX_DIR, exist_ok=True)
os.makedirs(os.path.dirname(TIMINGS_TS_PATH), exist_ok=True)

SCENES_DATA = [
    (1, 120, 6, "Se abrieron las puertas... y el internet se volvió LOCO."),
    (2, 180, 6, "En minutos, clips por todos lados. Tu feed ya no era tu feed."),
    (3, 190, 6, "¿Y la comunidad? Cero respeto: autos volando, persecuciones, puro desmadre."),
    (4, 180, 6, "Y las físicas... los detalles... la gente pausando solo para mirar."),
    (5, 190, 40, "Pero lo que nadie esperaba... fue esto."),
    (6, 160, 8, "Dime la verdad... ¿qué fue lo primero que hiciste? Comenta.")
]

VOICE = "es-MX-JorgeNeural"
BASE_RATE = 8
MAX_RATE = 25
SAMPLE_RATE = 44100


def get_mp3_duration(filepath: str) -> float:
    import mutagen.mp3
    return float(mutagen.mp3.MP3(filepath).info.length)


async def generate_single_vo(text: str, rate_pct: int, out_path: str):
    rate_str = f"+{rate_pct}%" if rate_pct >= 0 else f"{rate_pct}%"
    communicate = edge_tts.Communicate(text, VOICE, rate=rate_str)
    audio_bytes = bytearray()

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_bytes.extend(chunk["data"])

    with open(out_path, "wb") as f:
        f.write(audio_bytes)
        f.flush()
        os.fsync(f.fileno())

    duration_sec = get_mp3_duration(out_path)
    words = fallback_word_timings(text, duration_sec)

    return duration_sec, words


def fallback_word_timings(text: str, total_duration: float):
    raw_words = text.split()
    if not raw_words or total_duration <= 0.0:
        return []

    # Repartir proporcionalmente a la cantidad de caracteres por palabra
    weights = [max(len(w), 1) for w in raw_words]
    total_weight = sum(weights)

    result = []
    current_time = 0.0
    for i, (w, weight) in enumerate(zip(raw_words, weights)):
        word_dur = total_duration * (weight / total_weight)
        end_time = total_duration if i == len(raw_words) - 1 else current_time + word_dur
        result.append({
            "text": w,
            "startSec": round(current_time, 3),
            "endSec": round(end_time, 3)
        })
        current_time = end_time
    return result


async def generate_all_vo():
    timings = []
    print("--- Generando Voice Over (edge-tts) ---")
    for scene_num, frames, vo_delay, text in SCENES_DATA:
        filename = f"s{scene_num:02d}.mp3"
        out_path = os.path.join(VO_DIR, filename)
        max_allowed_sec = (frames / 30.0) - (vo_delay / 30.0) - 0.3

        rate = BASE_RATE
        dur = 0.0
        words = []

        while True:
            print(f"Escena {scene_num}: probando rate +{rate}%...")
            dur, words = await generate_single_vo(text, rate, out_path)
            if dur <= max_allowed_sec or rate >= MAX_RATE:
                break
            rate = min(rate + 3, MAX_RATE)

        if dur > max_allowed_sec:
            print(f"ADVERTENCIA: Escena {scene_num} dura {dur:.2f}s y excede límite {max_allowed_sec:.2f}s (rate final +{rate}%)")
        else:
            print(f"Escena {scene_num}: OK ({dur:.2f}s <= límite {max_allowed_sec:.2f}s, rate +{rate}%)")

        timings.append({
            "scene": scene_num,
            "file": f"audio/vo/{filename}",
            "durationSec": round(dur, 3),
            "words": words
        })

    ts_content = "export const VO_TIMINGS: {\n"
    ts_content += "  scene: number;\n"
    ts_content += "  file: string;\n"
    ts_content += "  durationSec: number;\n"
    ts_content += "  words: { text: string; startSec: number; endSec: number }[];\n"
    ts_content += "}[] = " + json.dumps(timings, indent=2, ensure_ascii=False) + ";\n"

    with open(TIMINGS_TS_PATH, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Escrito {TIMINGS_TS_PATH}")


def write_wav(filepath: str, samples_left, samples_right, sample_rate=44100):
    import numpy as np
    l = np.clip(samples_left, -0.8, 0.8)
    r = np.clip(samples_right, -0.8, 0.8)

    l_int16 = (l * 32767).astype(np.int16)
    r_int16 = (r * 32767).astype(np.int16)

    interleaved = np.empty((len(l) * 2,), dtype=np.int16)
    interleaved[0::2] = l_int16
    interleaved[1::2] = r_int16

    with wave.open(filepath, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(interleaved.tobytes())
    print(f"Generado {filepath}")


def generate_music_and_sfx():
    import numpy as np

    sfx_files = ["whoosh.wav", "hit.wav", "riser.wav", "glitch.wav", "pop.wav", "sting.wav"]
    all_sfx_exist = all(os.path.exists(os.path.join(SFX_DIR, f)) for f in sfx_files)
    music_exists = os.path.exists(MUSIC_PATH)

    if music_exists and all_sfx_exist:
        print("Música y SFX ya existen, omitiendo generación.")
        return

    print("--- Sintetizando Música Synthwave y SFX (numpy + wave) ---")
    sr = SAMPLE_RATE
    total_sec = 34.0
    total_samples = int(total_sec * sr)
    t = np.linspace(0, total_sec, total_samples, endpoint=False)

    bpm = 108.0
    beat_sec = 60.0 / bpm
    bar_sec = beat_sec * 4.0

    intro_end = bar_sec * 2.0
    bd_start = 22.3
    bd_end = 23.6

    music_l = np.zeros(total_samples, dtype=np.float32)
    music_r = np.zeros(total_samples, dtype=np.float32)

    kick_len = int(0.12 * sr)
    t_k = np.linspace(0, 0.12, kick_len, endpoint=False)
    f_k = 150.0 * np.exp(-t_k * 30.0) + 40.0
    kick_sample = np.sin(2 * np.pi * f_k * t_k) * np.exp(-t_k * 25.0)

    snare_len = int(0.2 * sr)
    t_s = np.linspace(0, 0.2, snare_len, endpoint=False)
    noise = np.random.uniform(-1.0, 1.0, snare_len)
    snare_sample = (np.sin(2 * np.pi * 180.0 * t_s) * 0.4 + noise * 0.6) * np.exp(-t_s * 20.0)

    hh_len = int(0.05 * sr)
    t_h = np.linspace(0, 0.05, hh_len, endpoint=False)
    hh_sample = np.random.uniform(-1.0, 1.0, hh_len) * np.exp(-t_h * 80.0)

    num_beats = int(total_sec / beat_sec)
    for b in range(num_beats):
        beat_t = b * beat_sec
        idx = int(beat_t * sr)

        is_breakdown = (bd_start <= beat_t <= bd_end)
        is_intro = (beat_t < intro_end)

        if not is_breakdown:
            for sub in [0.0, 0.5]:
                sub_idx = int((beat_t + sub * beat_sec) * sr)
                if sub_idx + hh_len < total_samples:
                    gain = 0.12 if sub == 0.0 else 0.18
                    music_l[sub_idx:sub_idx + hh_len] += hh_sample * gain
                    music_r[sub_idx:sub_idx + hh_len] += hh_sample * gain

        if not is_intro and not is_breakdown:
            if idx + kick_len < total_samples:
                music_l[idx:idx + kick_len] += kick_sample * 0.45
                music_r[idx:idx + kick_len] += kick_sample * 0.45

            beat_in_bar = b % 4
            if beat_in_bar in [1, 3]:
                if idx + snare_len < total_samples:
                    music_l[idx:idx + snare_len] += snare_sample * 0.35
                    music_r[idx:idx + snare_len] += snare_sample * 0.35

    notes = [73.42, 87.31, 110.0, 130.81]
    sixteenth_sec = beat_sec / 4.0
    num_16ths = int(total_sec / sixteenth_sec)

    for i in range(num_16ths):
        t_note = i * sixteenth_sec
        if bd_start <= t_note <= bd_end:
            continue
        idx = int(t_note * sr)
        note_samples = int(sixteenth_sec * sr)
        if idx + note_samples >= total_samples:
            note_samples = total_samples - idx

        freq = notes[i % 4]
        if t_note < intro_end:
            freq = 73.42

        local_t = np.linspace(0, note_samples / sr, note_samples, endpoint=False)
        saw = 2.0 * (local_t * freq - np.floor(0.5 + local_t * freq))
        env = np.exp(-local_t * 8.0)
        bass_chunk = saw * env * 0.22

        music_l[idx:idx + note_samples] += bass_chunk * 0.95
        music_r[idx:idx + note_samples] += bass_chunk * 0.95

    pad = (np.sin(2 * np.pi * 146.83 * t) +
           np.sin(2 * np.pi * 174.61 * t * 1.002) +
           np.sin(2 * np.pi * 220.0 * t * 0.998) +
           np.sin(2 * np.pi * 293.66 * t)) * 0.06

    mask = np.ones(total_samples, dtype=np.float32)
    bd_idx_s = int(bd_start * sr)
    bd_idx_e = int(bd_end * sr)
    mask[bd_idx_s:bd_idx_e] = 0.05
    fade_len = int(0.05 * sr)
    if bd_idx_s - fade_len >= 0:
        mask[bd_idx_s - fade_len:bd_idx_s] = np.linspace(1.0, 0.05, fade_len)
    if bd_idx_e + fade_len <= total_samples:
        mask[bd_idx_e:bd_idx_e + fade_len] = np.linspace(0.05, 1.0, fade_len)

    music_l = (music_l + pad * 0.8) * mask
    music_r = (music_r + pad * 0.8) * mask

    peak = max(float(np.max(np.abs(music_l))), float(np.max(np.abs(music_r))), 0.001)
    if peak > 0.75:
        music_l = (music_l / peak) * 0.75
        music_r = (music_r / peak) * 0.75

    write_wav(MUSIC_PATH, music_l, music_r, sr)

    w_len = int(0.5 * sr)
    w_t = np.linspace(0, 0.5, w_len, endpoint=False)
    w_env = np.sin(np.pi * w_t / 0.5) ** 2
    w_noise = np.random.uniform(-1.0, 1.0, w_len)
    whoosh = w_noise * w_env * 0.6
    write_wav(os.path.join(SFX_DIR, "whoosh.wav"), whoosh, whoosh, sr)

    h_len = int(0.6 * sr)
    h_t = np.linspace(0, 0.6, h_len, endpoint=False)
    h_freq = 120.0 * np.exp(-h_t * 20.0) + 35.0
    hit_sub = np.sin(2 * np.pi * h_freq * h_t) * np.exp(-h_t * 6.0)
    hit_click = np.random.uniform(-1.0, 1.0, h_len) * np.exp(-h_t * 60.0) * 0.5
    hit = (hit_sub * 0.7 + hit_click) * 0.75
    write_wav(os.path.join(SFX_DIR, "hit.wav"), hit, hit, sr)

    r_len = int(2.0 * sr)
    r_t = np.linspace(0, 2.0, r_len, endpoint=False)
    r_phase = 2 * np.pi * 100.0 * (np.power(15.0, r_t / 2.0) - 1.0) / np.log(15.0)
    r_saw = 2.0 * (r_phase / (2 * np.pi) - np.floor(0.5 + r_phase / (2 * np.pi)))
    r_noise = np.random.uniform(-1.0, 1.0, r_len)
    r_env = (r_t / 2.0) ** 2
    riser = (r_saw * 0.5 + r_noise * 0.5) * r_env * 0.7
    write_wav(os.path.join(SFX_DIR, "riser.wav"), riser, riser, sr)

    g_len = int(0.3 * sr)
    g_t = np.linspace(0, 0.3, g_len, endpoint=False)
    glitch = np.sin(2 * np.pi * (800.0 + np.sin(g_t * 300.0) * 500.0) * g_t)
    glitch_noise = np.random.choice([-0.8, 0.8], size=g_len)
    gate = (np.sin(2 * np.pi * 40.0 * g_t) > 0).astype(np.float32)
    glitch = (glitch * 0.4 + glitch_noise * 0.6) * gate * np.exp(-g_t * 3.0) * 0.6
    write_wav(os.path.join(SFX_DIR, "glitch.wav"), glitch, glitch, sr)

    p_len = int(0.12 * sr)
    p_t = np.linspace(0, 0.12, p_len, endpoint=False)
    p_freq = 600.0 + 800.0 * np.exp(-p_t * 50.0)
    pop = np.sin(2 * np.pi * p_freq * p_t) * np.exp(-p_t * 40.0) * 0.75
    write_wav(os.path.join(SFX_DIR, "pop.wav"), pop, pop, sr)

    st_len = int(0.8 * sr)
    st_t = np.linspace(0, 0.8, st_len, endpoint=False)
    sting = (np.sin(2 * np.pi * 587.33 * st_t) +
             np.sin(2 * np.pi * 739.99 * st_t) +
             np.sin(2 * np.pi * 880.00 * st_t) +
             np.sin(2 * np.pi * 1174.66 * st_t)) * 0.25
    sting = sting * np.exp(-st_t * 4.0) * 0.7
    write_wav(os.path.join(SFX_DIR, "sting.wav"), sting, sting, sr)


async def main():
    await generate_all_vo()
    print("ETAPA 01 COMPLETADA CON ÉXITO.")


if __name__ == "__main__":
    asyncio.run(main())

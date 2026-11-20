import numpy as np, wave, os
sr = 44100
rng = np.random.default_rng(7)
def T(d): return np.linspace(0, d, int(sr*d), endpoint=False)
def lp(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/sr)
    return np.fft.irfft(X/(1+(f/fc)**4), len(x))
def hp(x, fc): return x - lp(x, fc)
def reverb(x, wet=0.28, dec=0.45, ln=1.4):
    t = T(ln); ir = rng.standard_normal(len(t))*np.exp(-t/dec); ir = lp(ir, 5000)
    n = len(x)+len(ir); y = np.fft.irfft(np.fft.rfft(x, n)*np.fft.rfft(ir, n), n)
    y = y/(np.abs(y).max()+1e-9)*np.abs(x).max()
    out = np.zeros(n); out[:len(x)] += x*(1-wet); out += y*wet
    return out
def saw(f, t, det=(0.994, 1.0, 1.006)):
    return sum(2*((f*d*t) % 1)-1 for d in det)/len(det)
def sweep_noise(d, f0, f1):
    n = rng.standard_normal(int(sr*d)); fs = np.geomspace(f0, f1, 8)
    layers = [lp(n, f) for f in fs]; pos = np.linspace(0, 7, len(n)); out = np.zeros(len(n))
    for i, l in enumerate(layers): out += l*np.exp(-((pos-i)**2)/0.6)
    return out
def norm(x, pk=0.85): return x/(np.abs(x).max()+1e-9)*pk
def save(path, x):
    x = np.tanh(np.atleast_2d(x)*1.1) if x.ndim == 1 else np.tanh(x*1.1)
    if x.shape[0] == 1: x = np.vstack([x, x])
    x = (np.clip(x.T, -1, 1)*32767).astype("<i2")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
def kick(d=0.4):
    t = T(d); f = 45+120*np.exp(-t*28); ph = 2*np.pi*np.cumsum(f)/sr
    return np.sin(ph)*np.exp(-t*7) + 0.3*hp(rng.standard_normal(len(t)), 2000)*np.exp(-t*90)
D = "public/audio/sfx/"
# SFX
w = sweep_noise(0.9, 300, 9000)*np.sin(np.pi*np.linspace(0, 1, int(sr*0.9)))**1.5
save(D+"whoosh.wav", norm(reverb(w, 0.2)))
h = kick(0.9)*1.2 + 0.4*lp(rng.standard_normal(int(sr*0.9)), 600)*np.exp(-T(0.9)*6)
save(D+"hit.wav", norm(reverb(h, 0.35, 0.6)))
r = sweep_noise(2.0, 200, 12000)*np.linspace(0.05, 1, int(sr*2.0))**2
t2 = T(2.0); r += 0.3*np.sin(2*np.pi*np.cumsum(200*np.geomspace(1, 12, len(t2)))/sr)*np.linspace(0, 1, len(t2))
save(D+"riser.wav", norm(reverb(r, 0.2)))
g = np.zeros(int(sr*0.45))
for i in range(6):
    s = int(rng.integers(0, len(g)-3000)); seg = np.round(rng.standard_normal(2200)*4)/4
    g[s:s+2200] += seg*rng.uniform(0.3, 1)
save(D+"glitch.wav", norm(hp(g, 400)))
t = T(0.25); p = np.sin(2*np.pi*np.cumsum(500+900*np.exp(-t*40))/sr)*np.exp(-t*22)
save(D+"pop.wav", norm(reverb(p, 0.15)))
t = T(1.4); s = sum(saw(f, t) for f in (220, 261.63, 329.63, 440))*np.exp(-t*2.2)
save(D+"sting.wav", norm(reverb(lp(s, 5000), 0.4, 0.8)))
# MÚSICA 108 BPM, 34 s
bpm = 108; beat = 60/bpm; N = int(sr*34); L = np.zeros(N); R = np.zeros(N)
def put(buf, x, at):
    s = int(at*sr)
    if s < N: buf[s:s+len(x)] += x[:N-s]
chords = [(55, (220, 261.63, 329.63)), (43.65, (174.61, 220, 261.63)), (65.41, (196, 261.63, 329.63)), (49, (196, 246.94, 293.66))]
duck = np.ones(N)
for b in range(int(34/beat)+1):
    s = int(b*beat*sr); e = min(N, s+int(beat*sr))
    if s < N: duck[s:e] = 1-0.65*np.exp(-T(beat)[:e-s]/0.16)
bar = beat*4; pad = np.zeros(N); bass = np.zeros(N); arp = np.zeros(N)
for i in range(int(34/bar)+1):
    bf, tri = chords[i % 4]; t0 = i*bar
    tb = T(bar+0.3); fade = np.minimum(1, tb/0.4)*np.minimum(1, (bar+0.3-tb)/0.3)
    put(pad, sum(saw(f, tb) for f in tri)*0.12*fade, t0)
    put(bass, lp(saw(bf, tb, (0.997, 1.0, 1.003)), 400)*0.5*fade, t0)
    for k in range(16):
        ta = T(0.25); f = tri[k % 3]*(2 if k % 4 < 2 else 4)
        put(arp, lp(saw(f, ta), 3500)*np.exp(-ta*9)*0.12, t0+k*beat/4)
mix = (pad*0.7+bass)*duck
dr = np.zeros(N)
for b in range(int(34/beat)):
    put(dr, kick()*0.9, b*beat)
    if b % 2 == 1: put(dr, hp(rng.standard_normal(int(sr*0.3)), 1500)*np.exp(-T(0.3)*18)*0.45+0.25*np.sin(2*np.pi*190*T(0.3))*np.exp(-T(0.3)*25), b*beat)
    for h8 in (0, 0.5): put(dr, hp(rng.standard_normal(int(sr*0.08)), 7000)*np.exp(-T(0.08)*50)*0.22, b*beat+h8*beat)
a = reverb(arp[:sr*34], 0.35, 0.5)[:N]
L = mix+dr+a*0.9; R = mix+dr+np.roll(a, int(0.011*sr))*0.9
cut = int(22.3*sr); br = int(1.3*sr); L[cut:cut+br] *= 0.15; R[cut:cut+br] *= 0.15
fo = np.ones(N); fo[-sr*2:] = np.linspace(1, 0, sr*2); L *= fo; R *= fo
pk = max(np.abs(L).max(), np.abs(R).max())
save("public/audio/music.wav", np.vstack([L, R])/pk*0.8)
print("OK audio premium")

# DIRECCIÓN MAESTRA: "GTA VI: LAS PRIMERAS HORAS"
Remotion + React + TypeScript estricto. Vertical 1080x1920, 30 fps, 1020 frames (34 s). Español latino, tono callejero/meme/hype. Usa el id de composición que ya exista en src/Root.tsx.

## 1. IDEA CENTRAL (anti-plantilla)
Mini-película animada en 3D low-poly con cámara real, personajes, voz, música y SFX. NO es una presentación. Cada escena es una secuencia de PLANOS con escenario, personaje y movimiento de cámara. La historia la cuentan imagen + voz + sonido; el texto es solo acento (máx. 4 palabras a la vez).
PROHIBIDO: paneles tipo interfaz, barras, feeds, HUD, notificaciones, cualquier cosa que parezca captura de pantalla, y texto plano sobre fondo.
Sin logos, arte, personajes ni música oficiales de GTA/Rockstar. No inventes cifras ni datos oficiales: solo reacción, hype y misterio.

## 2. PSICOLOGÍA DE RETENCIÓN
- El frame 0 NUNCA es negro (las plataformas lo usan de portada): arranca con "HORA 0" gigante + flash + hit.
- Pattern interrupt en los primeros 30 frames. La premisa se entiende en 2 s incluso sin sonido (subtítulos).
- Cambio de plano cada 45 frames máximo. Micro-evento (pulso, shake, partícula) cada 10-15 frames. Ningún frame estático.
- Bucle abierto en la escena 1 ("mira lo que pasó"), pago en la 5. Antes del giro: 8 frames de negro y silencio.
- Arco emocional: shock, caos, risa, asombro, sorpresa, pertenencia.
- Cierre con pregunta fácil de responder en un comentario. El último frame es casi igual al frame 0 para que haga bucle.

## 3. LOOK
Paleta: magenta #ff2e93, cian #00e5ff, púrpura #2a0845, naranja #ff7a3d, negro #07030f. Atardecer eterno, art déco, palmeras, autos deportivos, neón.
3D: flat shading, materiales emissive para neón, niebla púrpura, ambient baja, directional magenta, point cyan, sol gigante al fondo.
Overlay 2D sobre el canvas (src/explained/layers/Fx.tsx): grano de película animado (feTurbulence con seed=frame), halftone en sombras, light leaks, glow falso (duplicado con blur + mix-blend-mode screen), aberración cromática RGB en texto e impactos, líneas de velocidad, viñeta, flash, glitch por slices horizontales, blur de whip-pan calculado por frame. Texturas en TODAS las escenas.

## 4. MOTOR 3D Y RENDIMIENTO (se renderiza SIN GPU, WebGL por software)
- @remotion/three + three + @react-three/fiber. Un <ThreeCanvas> por escena con width/height de data.ts.
- Animación SOLO con useCurrentFrame, spring e interpolate (clamp). PROHIBIDO: useFrame, requestAnimationFrame, CSS animations/transitions, setTimeout, useState/useEffect para animar, Math.random (usa random("seed") de remotion).
- Sin assets externos: solo primitivas (Box, Cylinder, Cone, Sphere, Capsule, Extrude, Plane) y CanvasTexture generada con useMemo, determinista.
- Presupuesto: sin sombras en tiempo real, sin postprocesado de three, máx. ~400 meshes visibles, geometrías y materiales compartidos con useMemo, InstancedMesh para edificios/ventanas/palmeras/postes, pocos segmentos, fog para ocultar el fondo.

## 5. PERSONAJES Y VEHÍCULOS (primitivas con articulaciones)
- Humanoid: low-poly con jerarquía de grupos (torso, cabeza, 2 brazos, 2 piernas con pivotes en hombro/cadera/rodilla). Poses: idle (respira, cabeceo), walk, run, panic (brazos arriba, temblor), celebrate (salto + brazos arriba), shock (manos a la cabeza), roll (rueda con spring). Cada pose sale de frame con sin/spring/interpolate. Variantes de color y accesorios (gorra, gafas neón, chaqueta). Rim light: luz trasera cian/magenta.
- Car: auto deportivo low-poly (carrocería, cabina, ruedas que giran, faros y luces de freno emissive), rebote de suspensión, derrape (rotación Y con spring), humo (esferas que escalan y se desvanecen), piezas sueltas para el choque.
- Patrol: patrulla con barra rojo/azul alternando cada 4 frames y point lights que iluminan alrededor.
- Partículas deterministas con random("seed"): chispas, confeti, escombros, humo.

## 6. CÁMARA
CameraRig recibe frame y una lista de planos [{from,to,pos inicial->final,look inicial->final,fov,ease}] y los interpola. Soporta: dolly, órbita, crane, whip-pan, tilt holandés, shake con decaimiento en impactos, FOV kick, y cámara lenta por remapeo de tiempo (interpolate del tiempo de escena). Cortes secos reforzados con flash/glitch de 2-3 frames. Parallax real por profundidad 3D.

## 7. AUDIO
- Voz: public/audio/vo/s01.mp3 ... s06.mp3 (edge-tts es-MX-JorgeNeural). Retraso de inicio por escena en frames: VO_DELAY = {1:6, 2:6, 3:6, 4:6, 5:40, 6:8}.
- Música synthwave sintetizada a 108 BPM en public/audio/music.wav. Volumen 0.22, baja a 0.10 mientras habla la voz (ducking suave de 6 frames), fade-out en los últimos 20 frames.
- SFX en public/audio/sfx/: whoosh, hit, riser, glitch, pop, sting. Uno en cada corte, adelantado 3 frames; hit en cada palabra gigante; riser antes del giro de la escena 5.
- Mezcla: voz 1.0, música 0.22, SFX 0.5-0.9.
- <Audio> de remotion con staticFile (o <Html5Audio> si la versión instalada lo exige; revisa package.json). Volumen como función del frame.

## 8. SUBTÍTULOS KARAOKE
Palabra por palabra con VO_TIMINGS (3-4 palabras visibles), mayúsculas en Anton, palabra activa con pop de spring y color de acento, contorno grueso y sombra, ubicados entre y=1100 y y=1380.

## 9. ZONAS SEGURAS (TikTok/Facebook)
Todo lo importante dentro de x:[60,940] y y:[220,1440]. Nada importante en los últimos 480 px ni en los 140 px del margen derecho. Solo fondos y decoración pueden sangrar.

## 10. STORYBOARD (suman 1020; inicios en 0, 120, 300, 490, 670, 860; frames relativos a la escena)
01 | 120f | GANCHO "HORA 0"
 f0-14: "HORA 0" gigante con aberración sobre flash blanco, shake fuerte, hit + sting. Detrás, dos puertas/rejas gigantes de neón.
 f14-45: las puertas se abren (rotación con spring) con luz cegadora; dolly-in rápido atravesándolas. Whoosh.
 f45-90: avenida 3D al atardecer, cámara a ras de suelo a gran velocidad, palmeras y edificios pasando, sol enorme.
 f90-120: whip-pan a la derecha, la palabra "LOCO" golpea con hit + glitch y corte.
 VOZ: "Se abrieron las puertas... y el internet se volvió LOCO."
02 | 180f | CAOS EN REDES
 f0-60: plano aéreo en órbita rápida sobre la ciudad; íconos 3D extruidos (play, corazón, llama, pulgar) salen disparados del centro hacia la cámara.
 f60-120: push-in agresivo atravesando la lluvia de íconos, líneas de velocidad, contador gigante decorativo subiendo ("999+", sin cifras oficiales).
 f120-180: whip-pan y pull-back: la ciudad cubierta de íconos flotantes y rayos de luz, shake en cada pulso.
 VOZ: "En minutos, clips por todos lados. Tu feed ya no era tu feed."
03 | 190f | LOCURAS EN LA CALLE (100% 3D)
 f0-45: cámara baja frontal, auto derrapando hacia la cámara con humo; whip-pan.
 f45-95: tracking lateral: patrullas persiguiendo con luces rojo/azul que iluminan los edificios; un NPC corre con brazos arriba (panic).
 f95-145: plano cenital siguiendo al auto que sale volando por una rampa con giro; FOV kick.
 f145-190: un jugador celebra (celebrate) frente a una explosión de confeti neón; palabra "DESMADRE".
 VOZ: "¿Y la comunidad? Cero respeto: autos volando, persecuciones, puro desmadre."
04 | 180f | FÍSICAS Y DETALLES
 f0-40: choque del auto contra una barrera a velocidad normal, shake, hit.
 f40-120: cámara lenta (0.15x por remapeo de tiempo) con órbita de 180° alrededor del impacto: piezas separándose, chispas, un humanoide rodando (roll).
 f120-180: círculo-lupa 2D que hace zoom a un detalle (rueda girando, charco reflejando neón); palabra "FÍSICAS" con aberración; regreso a velocidad normal con whoosh.
 VOZ: "Y las físicas... los detalles... la gente pausando solo para mirar."
05 | 190f | LO QUE NADIE ESPERABA
 f0-8: negro total y silencio. f8-50: riser; halo cian, silueta 3D misteriosa de espaldas en niebla, "???" parpadeando.
 f50-70: glitch fuerte (slices RGB) y flash.
 f70-190: pull-back que revela un letrero de neón gigante 3D con tubos que se encienden en secuencia ("¿QUÉ?!"), multitud de humanoides de espaldas en shock; crane-up; "NADIE LO VIO VENIR".
 VOZ: "Pero lo que nadie esperaba... fue esto."
06 | 160f | CIERRE
 f0-60: un jugador de espaldas sobre una azotea mirando el skyline al atardecer, palmeras meciéndose, crane-up.
 f60-120: dolly-out lento mientras el skyline se llena de luces; pregunta gigante "¿QUÉ HICISTE PRIMERO?" (3 líneas) con spring.
 f120-160: la luz se vuelve cegadora y el último frame casi iguala el frame 0 (bucle).
 VOZ: "Dime la verdad... ¿qué fue lo primero que hiciste? Comenta."

## 11. REGLAS TÉCNICAS
- TypeScript estricto, sin any. Código completo, sin placeholders ni "// resto igual". Una escena por archivo en src/explained/scenes/.
- Lee cada archivo antes de editarlo. Conserva las demás composiciones de Root.tsx.
- TOTAL_FRAMES se calcula con reduce sobre scene.frames. Solo se escribe 1020 dentro de una verificación que lance Error si no coincide.
- Fuentes: @remotion/google-fonts (Anton + Inter) solo si ya está en package.json; si no, Impact/Arial Black.
- Valida con npx tsc --noEmit al terminar cada etapa.

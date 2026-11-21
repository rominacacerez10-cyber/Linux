// AUTOGENERADO por tools/gen_gta_master_voice.py — NO EDITAR A MANO.
// Sincronizado al tiempo real de public/gta-master-voice.wav

export interface ScriptPanel {
  id: string;
  panel: number;
  title: string;
  text: string;
  startSec: number;
  endSec: number;
  startFrame: number;
  frames: number;
  firstWordFrame: number;
  lastWordFrame: number;
  wordStart: number;
  wordEnd: number;
}

export interface VoiceWord {
  text: string;
  panel: number;
  startSec: number;
  endSec: number;
  startFrame: number;
  endFrame: number;
}

export interface CaptionWordTiming {
  text: string;
  startFrame: number;
  endFrame: number;
}

export interface CaptionPageTiming {
  startFrame: number;
  endFrame: number;
  panel: number;
  words: CaptionWordTiming[];
}

export interface PanelVoiceBound {
  panel: number;
  startFrame: number;
  frames: number;
  firstWordFrame: number;
  lastWordFrame: number;
}

export const SCRIPT_TITLE = "COMIC GTA MASTER — EL DÍA QUE GTA VI TUMBÓ INTERNET";
export const VOICE_FILE = 'gta-master-voice.wav';
export const FPS = 30;
export const VOICE_DURATION_SEC = 36.01;
export const TOTAL_FRAMES = 1087;

export const SCRIPT_PANELS: ScriptPanel[] = [
  {
    "id": "p01-minuto-cero",
    "panel": 1,
    "title": "MINUTO CERO",
    "text": "Cero cero. GTA VI tumbó internet. Todo internet.",
    "startSec": 0.0,
    "endSec": 4.5333,
    "startFrame": 0,
    "frames": 136,
    "firstWordFrame": 2,
    "lastWordFrame": 128,
    "wordStart": 0,
    "wordEnd": 8
  },
  {
    "id": "p02-dos-millones",
    "panel": 2,
    "title": "DOS MILLONES",
    "text": "En Vice City, dos millones gritaron al mismo tiempo: ¡ya salió!",
    "startSec": 4.5333,
    "endSec": 9.0667,
    "startFrame": 136,
    "frames": 136,
    "firstWordFrame": 138,
    "lastWordFrame": 264,
    "wordStart": 8,
    "wordEnd": 19
  },
  {
    "id": "p03-servidores",
    "panel": 3,
    "title": "SERVIDORES EN LLAMAS",
    "text": "Los servidores pidieron auxilio y el botón de descarga se suicidó en vivo.",
    "startSec": 9.0667,
    "endSec": 14.2,
    "startFrame": 272,
    "frames": 154,
    "firstWordFrame": 274,
    "lastWordFrame": 418,
    "wordStart": 19,
    "wordEnd": 32
  },
  {
    "id": "p04-mama-offline",
    "panel": 4,
    "title": "MAMÁ OFFLINE",
    "text": "Twitch colapsó, Steam lloró y tu mamá preguntó si eso arregla el WiFi.",
    "startSec": 14.2,
    "endSec": 19.0667,
    "startFrame": 426,
    "frames": 146,
    "firstWordFrame": 428,
    "lastWordFrame": 564,
    "wordStart": 32,
    "wordEnd": 45
  },
  {
    "id": "p05-culpable",
    "panel": 5,
    "title": "EL VERDADERO CULPABLE",
    "text": "Giro: no fue un ataque. Fue un tipo con cuarenta mil pestañas abiertas.",
    "startSec": 19.0667,
    "endSec": 24.5667,
    "startFrame": 572,
    "frames": 165,
    "firstWordFrame": 574,
    "lastWordFrame": 729,
    "wordStart": 45,
    "wordEnd": 58
  },
  {
    "id": "p06-mundo-se-rinde",
    "panel": 6,
    "title": "EL MUNDO SE RINDE",
    "text": "La bolsa cayó, los memes subieron y el Gobierno declaró feriado gamer.",
    "startSec": 24.5667,
    "endSec": 29.6,
    "startFrame": 737,
    "frames": 151,
    "firstWordFrame": 739,
    "lastWordFrame": 880,
    "wordStart": 58,
    "wordEnd": 70
  },
  {
    "id": "p07-pregunta",
    "panel": 7,
    "title": "LA PREGUNTA",
    "text": "¿Quién arruinó el estreno: Rockstar, tu WiFi o el tipo de las pestañas? Comenta sin llorar.",
    "startSec": 29.6,
    "endSec": 36.2333,
    "startFrame": 888,
    "frames": 199,
    "firstWordFrame": 890,
    "lastWordFrame": 1077,
    "wordStart": 70,
    "wordEnd": 86
  }
];

export const PANEL_VOICE_BOUNDS: PanelVoiceBound[] = [
  {
    "panel": 1,
    "startFrame": 0,
    "frames": 136,
    "firstWordFrame": 2,
    "lastWordFrame": 128
  },
  {
    "panel": 2,
    "startFrame": 136,
    "frames": 136,
    "firstWordFrame": 138,
    "lastWordFrame": 264
  },
  {
    "panel": 3,
    "startFrame": 272,
    "frames": 154,
    "firstWordFrame": 274,
    "lastWordFrame": 418
  },
  {
    "panel": 4,
    "startFrame": 426,
    "frames": 146,
    "firstWordFrame": 428,
    "lastWordFrame": 564
  },
  {
    "panel": 5,
    "startFrame": 572,
    "frames": 165,
    "firstWordFrame": 574,
    "lastWordFrame": 729
  },
  {
    "panel": 6,
    "startFrame": 737,
    "frames": 151,
    "firstWordFrame": 739,
    "lastWordFrame": 880
  },
  {
    "panel": 7,
    "startFrame": 888,
    "frames": 199,
    "firstWordFrame": 890,
    "lastWordFrame": 1077
  }
];

export const VOICE_WORDS: VoiceWord[] = [
  {
    "text": "Cero",
    "panel": 1,
    "startSec": 0.06,
    "endSec": 0.3886,
    "startFrame": 2,
    "endFrame": 12
  },
  {
    "text": "cero.",
    "panel": 1,
    "startSec": 0.3886,
    "endSec": 1.2428,
    "startFrame": 12,
    "endFrame": 37
  },
  {
    "text": "GTA",
    "panel": 1,
    "startSec": 1.2428,
    "endSec": 1.4071,
    "startFrame": 37,
    "endFrame": 42
  },
  {
    "text": "VI",
    "panel": 1,
    "startSec": 1.4071,
    "endSec": 1.5714,
    "startFrame": 42,
    "endFrame": 47
  },
  {
    "text": "tumbó",
    "panel": 1,
    "startSec": 1.5714,
    "endSec": 1.8999,
    "startFrame": 47,
    "endFrame": 57
  },
  {
    "text": "internet.",
    "panel": 1,
    "startSec": 1.8999,
    "endSec": 2.9185,
    "startFrame": 57,
    "endFrame": 88
  },
  {
    "text": "Todo",
    "panel": 1,
    "startSec": 2.9185,
    "endSec": 3.2471,
    "startFrame": 88,
    "endFrame": 97
  },
  {
    "text": "internet.",
    "panel": 1,
    "startSec": 3.2471,
    "endSec": 4.2656,
    "startFrame": 97,
    "endFrame": 128
  },
  {
    "text": "En",
    "panel": 2,
    "startSec": 4.5942,
    "endSec": 4.7584,
    "startFrame": 138,
    "endFrame": 143
  },
  {
    "text": "Vice",
    "panel": 2,
    "startSec": 4.7584,
    "endSec": 5.087,
    "startFrame": 143,
    "endFrame": 153
  },
  {
    "text": "City,",
    "panel": 2,
    "startSec": 5.087,
    "endSec": 5.4813,
    "startFrame": 153,
    "endFrame": 164
  },
  {
    "text": "dos",
    "panel": 2,
    "startSec": 5.4813,
    "endSec": 5.6456,
    "startFrame": 164,
    "endFrame": 169
  },
  {
    "text": "millones",
    "panel": 2,
    "startSec": 5.6456,
    "endSec": 6.1384,
    "startFrame": 169,
    "endFrame": 184
  },
  {
    "text": "gritaron",
    "panel": 2,
    "startSec": 6.1384,
    "endSec": 6.6312,
    "startFrame": 184,
    "endFrame": 199
  },
  {
    "text": "al",
    "panel": 2,
    "startSec": 6.6312,
    "endSec": 6.7955,
    "startFrame": 199,
    "endFrame": 204
  },
  {
    "text": "mismo",
    "panel": 2,
    "startSec": 6.7955,
    "endSec": 7.1241,
    "startFrame": 204,
    "endFrame": 214
  },
  {
    "text": "tiempo:",
    "panel": 2,
    "startSec": 7.1241,
    "endSec": 7.7976,
    "startFrame": 214,
    "endFrame": 234
  },
  {
    "text": "¡ya",
    "panel": 2,
    "startSec": 7.7976,
    "endSec": 7.9619,
    "startFrame": 234,
    "endFrame": 239
  },
  {
    "text": "salió!",
    "panel": 2,
    "startSec": 7.9619,
    "endSec": 8.8162,
    "startFrame": 239,
    "endFrame": 264
  },
  {
    "text": "Los",
    "panel": 3,
    "startSec": 9.1447,
    "endSec": 9.309,
    "startFrame": 274,
    "endFrame": 279
  },
  {
    "text": "servidores",
    "panel": 3,
    "startSec": 9.309,
    "endSec": 9.9661,
    "startFrame": 279,
    "endFrame": 299
  },
  {
    "text": "pidieron",
    "panel": 3,
    "startSec": 9.9661,
    "endSec": 10.459,
    "startFrame": 299,
    "endFrame": 314
  },
  {
    "text": "auxilio",
    "panel": 3,
    "startSec": 10.459,
    "endSec": 10.9518,
    "startFrame": 314,
    "endFrame": 329
  },
  {
    "text": "y",
    "panel": 3,
    "startSec": 10.9518,
    "endSec": 11.1161,
    "startFrame": 329,
    "endFrame": 333
  },
  {
    "text": "el",
    "panel": 3,
    "startSec": 11.1161,
    "endSec": 11.2804,
    "startFrame": 333,
    "endFrame": 338
  },
  {
    "text": "botón",
    "panel": 3,
    "startSec": 11.2804,
    "endSec": 11.609,
    "startFrame": 338,
    "endFrame": 348
  },
  {
    "text": "de",
    "panel": 3,
    "startSec": 11.609,
    "endSec": 11.7732,
    "startFrame": 348,
    "endFrame": 353
  },
  {
    "text": "descarga",
    "panel": 3,
    "startSec": 11.7732,
    "endSec": 12.2661,
    "startFrame": 353,
    "endFrame": 368
  },
  {
    "text": "se",
    "panel": 3,
    "startSec": 12.2661,
    "endSec": 12.4304,
    "startFrame": 368,
    "endFrame": 373
  },
  {
    "text": "suicidó",
    "panel": 3,
    "startSec": 12.4304,
    "endSec": 12.9232,
    "startFrame": 373,
    "endFrame": 388
  },
  {
    "text": "en",
    "panel": 3,
    "startSec": 12.9232,
    "endSec": 13.0875,
    "startFrame": 388,
    "endFrame": 393
  },
  {
    "text": "vivo.",
    "panel": 3,
    "startSec": 13.0875,
    "endSec": 13.9417,
    "startFrame": 393,
    "endFrame": 418
  },
  {
    "text": "Twitch",
    "panel": 4,
    "startSec": 14.2703,
    "endSec": 14.4346,
    "startFrame": 428,
    "endFrame": 433
  },
  {
    "text": "colapsó,",
    "panel": 4,
    "startSec": 14.4346,
    "endSec": 15.1574,
    "startFrame": 433,
    "endFrame": 455
  },
  {
    "text": "Steam",
    "panel": 4,
    "startSec": 15.1574,
    "endSec": 15.3217,
    "startFrame": 455,
    "endFrame": 460
  },
  {
    "text": "lloró",
    "panel": 4,
    "startSec": 15.3217,
    "endSec": 15.6503,
    "startFrame": 460,
    "endFrame": 470
  },
  {
    "text": "y",
    "panel": 4,
    "startSec": 15.6503,
    "endSec": 15.8145,
    "startFrame": 470,
    "endFrame": 474
  },
  {
    "text": "tu",
    "panel": 4,
    "startSec": 15.8145,
    "endSec": 15.9788,
    "startFrame": 474,
    "endFrame": 479
  },
  {
    "text": "mamá",
    "panel": 4,
    "startSec": 15.9788,
    "endSec": 16.3074,
    "startFrame": 479,
    "endFrame": 489
  },
  {
    "text": "preguntó",
    "panel": 4,
    "startSec": 16.3074,
    "endSec": 16.8002,
    "startFrame": 489,
    "endFrame": 504
  },
  {
    "text": "si",
    "panel": 4,
    "startSec": 16.8002,
    "endSec": 16.9645,
    "startFrame": 504,
    "endFrame": 509
  },
  {
    "text": "eso",
    "panel": 4,
    "startSec": 16.9645,
    "endSec": 17.2931,
    "startFrame": 509,
    "endFrame": 519
  },
  {
    "text": "arregla",
    "panel": 4,
    "startSec": 17.2931,
    "endSec": 17.7859,
    "startFrame": 519,
    "endFrame": 534
  },
  {
    "text": "el",
    "panel": 4,
    "startSec": 17.7859,
    "endSec": 17.9502,
    "startFrame": 534,
    "endFrame": 539
  },
  {
    "text": "WiFi.",
    "panel": 4,
    "startSec": 17.9502,
    "endSec": 18.8045,
    "startFrame": 539,
    "endFrame": 564
  },
  {
    "text": "Giro:",
    "panel": 5,
    "startSec": 19.133,
    "endSec": 19.8066,
    "startFrame": 574,
    "endFrame": 594
  },
  {
    "text": "no",
    "panel": 5,
    "startSec": 19.8066,
    "endSec": 19.9709,
    "startFrame": 594,
    "endFrame": 599
  },
  {
    "text": "fue",
    "panel": 5,
    "startSec": 19.9709,
    "endSec": 20.1351,
    "startFrame": 599,
    "endFrame": 604
  },
  {
    "text": "un",
    "panel": 5,
    "startSec": 20.1351,
    "endSec": 20.2994,
    "startFrame": 604,
    "endFrame": 609
  },
  {
    "text": "ataque.",
    "panel": 5,
    "startSec": 20.2994,
    "endSec": 21.318,
    "startFrame": 609,
    "endFrame": 640
  },
  {
    "text": "Fue",
    "panel": 5,
    "startSec": 21.318,
    "endSec": 21.4822,
    "startFrame": 640,
    "endFrame": 644
  },
  {
    "text": "un",
    "panel": 5,
    "startSec": 21.4822,
    "endSec": 21.6465,
    "startFrame": 644,
    "endFrame": 649
  },
  {
    "text": "tipo",
    "panel": 5,
    "startSec": 21.6465,
    "endSec": 21.9751,
    "startFrame": 649,
    "endFrame": 659
  },
  {
    "text": "con",
    "panel": 5,
    "startSec": 21.9751,
    "endSec": 22.1394,
    "startFrame": 659,
    "endFrame": 664
  },
  {
    "text": "cuarenta",
    "panel": 5,
    "startSec": 22.1394,
    "endSec": 22.6322,
    "startFrame": 664,
    "endFrame": 679
  },
  {
    "text": "mil",
    "panel": 5,
    "startSec": 22.6322,
    "endSec": 22.7965,
    "startFrame": 679,
    "endFrame": 684
  },
  {
    "text": "pestañas",
    "panel": 5,
    "startSec": 22.7965,
    "endSec": 23.2893,
    "startFrame": 684,
    "endFrame": 699
  },
  {
    "text": "abiertas.",
    "panel": 5,
    "startSec": 23.2893,
    "endSec": 24.3079,
    "startFrame": 699,
    "endFrame": 729
  },
  {
    "text": "La",
    "panel": 6,
    "startSec": 24.6364,
    "endSec": 24.8007,
    "startFrame": 739,
    "endFrame": 744
  },
  {
    "text": "bolsa",
    "panel": 6,
    "startSec": 24.8007,
    "endSec": 25.1293,
    "startFrame": 744,
    "endFrame": 754
  },
  {
    "text": "cayó,",
    "panel": 6,
    "startSec": 25.1293,
    "endSec": 25.6878,
    "startFrame": 754,
    "endFrame": 771
  },
  {
    "text": "los",
    "panel": 6,
    "startSec": 25.6878,
    "endSec": 25.8521,
    "startFrame": 771,
    "endFrame": 776
  },
  {
    "text": "memes",
    "panel": 6,
    "startSec": 25.8521,
    "endSec": 26.1807,
    "startFrame": 776,
    "endFrame": 785
  },
  {
    "text": "subieron",
    "panel": 6,
    "startSec": 26.1807,
    "endSec": 26.6735,
    "startFrame": 785,
    "endFrame": 800
  },
  {
    "text": "y",
    "panel": 6,
    "startSec": 26.6735,
    "endSec": 26.8378,
    "startFrame": 800,
    "endFrame": 805
  },
  {
    "text": "el",
    "panel": 6,
    "startSec": 26.8378,
    "endSec": 27.0021,
    "startFrame": 805,
    "endFrame": 810
  },
  {
    "text": "Gobierno",
    "panel": 6,
    "startSec": 27.0021,
    "endSec": 27.4949,
    "startFrame": 810,
    "endFrame": 825
  },
  {
    "text": "declaró",
    "panel": 6,
    "startSec": 27.4949,
    "endSec": 27.9878,
    "startFrame": 825,
    "endFrame": 840
  },
  {
    "text": "feriado",
    "panel": 6,
    "startSec": 27.9878,
    "endSec": 28.4806,
    "startFrame": 840,
    "endFrame": 854
  },
  {
    "text": "gamer.",
    "panel": 6,
    "startSec": 28.4806,
    "endSec": 29.3349,
    "startFrame": 854,
    "endFrame": 880
  },
  {
    "text": "¿Quién",
    "panel": 7,
    "startSec": 29.6634,
    "endSec": 29.8277,
    "startFrame": 890,
    "endFrame": 895
  },
  {
    "text": "arruinó",
    "panel": 7,
    "startSec": 29.8277,
    "endSec": 30.3206,
    "startFrame": 895,
    "endFrame": 910
  },
  {
    "text": "el",
    "panel": 7,
    "startSec": 30.3206,
    "endSec": 30.4848,
    "startFrame": 910,
    "endFrame": 915
  },
  {
    "text": "estreno:",
    "panel": 7,
    "startSec": 30.4848,
    "endSec": 31.3227,
    "startFrame": 915,
    "endFrame": 940
  },
  {
    "text": "Rockstar,",
    "panel": 7,
    "startSec": 31.3227,
    "endSec": 31.8812,
    "startFrame": 940,
    "endFrame": 956
  },
  {
    "text": "tu",
    "panel": 7,
    "startSec": 31.8812,
    "endSec": 32.0455,
    "startFrame": 956,
    "endFrame": 961
  },
  {
    "text": "WiFi",
    "panel": 7,
    "startSec": 32.0455,
    "endSec": 32.3741,
    "startFrame": 961,
    "endFrame": 971
  },
  {
    "text": "o",
    "panel": 7,
    "startSec": 32.3741,
    "endSec": 32.5384,
    "startFrame": 971,
    "endFrame": 976
  },
  {
    "text": "el",
    "panel": 7,
    "startSec": 32.5384,
    "endSec": 32.7026,
    "startFrame": 976,
    "endFrame": 981
  },
  {
    "text": "tipo",
    "panel": 7,
    "startSec": 32.7026,
    "endSec": 33.0312,
    "startFrame": 981,
    "endFrame": 991
  },
  {
    "text": "de",
    "panel": 7,
    "startSec": 33.0312,
    "endSec": 33.1955,
    "startFrame": 991,
    "endFrame": 996
  },
  {
    "text": "las",
    "panel": 7,
    "startSec": 33.1955,
    "endSec": 33.3598,
    "startFrame": 996,
    "endFrame": 1001
  },
  {
    "text": "pestañas?",
    "panel": 7,
    "startSec": 33.3598,
    "endSec": 34.3783,
    "startFrame": 1001,
    "endFrame": 1031
  },
  {
    "text": "Comenta",
    "panel": 7,
    "startSec": 34.3783,
    "endSec": 34.8711,
    "startFrame": 1031,
    "endFrame": 1046
  },
  {
    "text": "sin",
    "panel": 7,
    "startSec": 34.8711,
    "endSec": 35.0354,
    "startFrame": 1046,
    "endFrame": 1051
  },
  {
    "text": "llorar.",
    "panel": 7,
    "startSec": 35.0354,
    "endSec": 35.8897,
    "startFrame": 1051,
    "endFrame": 1077
  }
];

export const CAPTION_PAGES: CaptionPageTiming[] = [
  {
    "startFrame": 1,
    "endFrame": 35,
    "panel": 1,
    "words": [
      {
        "text": "Cero",
        "startFrame": 2,
        "endFrame": 12
      },
      {
        "text": "cero.",
        "startFrame": 12,
        "endFrame": 37
      }
    ]
  },
  {
    "startFrame": 35,
    "endFrame": 86,
    "panel": 1,
    "words": [
      {
        "text": "GTA",
        "startFrame": 37,
        "endFrame": 42
      },
      {
        "text": "VI",
        "startFrame": 42,
        "endFrame": 47
      },
      {
        "text": "tumbó",
        "startFrame": 47,
        "endFrame": 57
      },
      {
        "text": "internet.",
        "startFrame": 57,
        "endFrame": 88
      }
    ]
  },
  {
    "startFrame": 86,
    "endFrame": 134,
    "panel": 1,
    "words": [
      {
        "text": "Todo",
        "startFrame": 88,
        "endFrame": 97
      },
      {
        "text": "internet.",
        "startFrame": 97,
        "endFrame": 128
      }
    ]
  },
  {
    "startFrame": 137,
    "endFrame": 182,
    "panel": 2,
    "words": [
      {
        "text": "En",
        "startFrame": 138,
        "endFrame": 143
      },
      {
        "text": "Vice",
        "startFrame": 143,
        "endFrame": 153
      },
      {
        "text": "City,",
        "startFrame": 153,
        "endFrame": 164
      },
      {
        "text": "dos",
        "startFrame": 164,
        "endFrame": 169
      },
      {
        "text": "millones",
        "startFrame": 169,
        "endFrame": 184
      }
    ]
  },
  {
    "startFrame": 182,
    "endFrame": 237,
    "panel": 2,
    "words": [
      {
        "text": "gritaron",
        "startFrame": 184,
        "endFrame": 199
      },
      {
        "text": "al",
        "startFrame": 199,
        "endFrame": 204
      },
      {
        "text": "mismo",
        "startFrame": 204,
        "endFrame": 214
      },
      {
        "text": "tiempo:",
        "startFrame": 214,
        "endFrame": 234
      },
      {
        "text": "¡ya",
        "startFrame": 234,
        "endFrame": 239
      }
    ]
  },
  {
    "startFrame": 237,
    "endFrame": 270,
    "panel": 2,
    "words": [
      {
        "text": "salió!",
        "startFrame": 239,
        "endFrame": 264
      }
    ]
  },
  {
    "startFrame": 273,
    "endFrame": 312,
    "panel": 3,
    "words": [
      {
        "text": "Los",
        "startFrame": 274,
        "endFrame": 279
      },
      {
        "text": "servidores",
        "startFrame": 279,
        "endFrame": 299
      },
      {
        "text": "pidieron",
        "startFrame": 299,
        "endFrame": 314
      }
    ]
  },
  {
    "startFrame": 312,
    "endFrame": 351,
    "panel": 3,
    "words": [
      {
        "text": "auxilio",
        "startFrame": 314,
        "endFrame": 329
      },
      {
        "text": "y",
        "startFrame": 329,
        "endFrame": 333
      },
      {
        "text": "el",
        "startFrame": 333,
        "endFrame": 338
      },
      {
        "text": "botón",
        "startFrame": 338,
        "endFrame": 348
      },
      {
        "text": "de",
        "startFrame": 348,
        "endFrame": 353
      }
    ]
  },
  {
    "startFrame": 351,
    "endFrame": 424,
    "panel": 3,
    "words": [
      {
        "text": "descarga",
        "startFrame": 353,
        "endFrame": 368
      },
      {
        "text": "se",
        "startFrame": 368,
        "endFrame": 373
      },
      {
        "text": "suicidó",
        "startFrame": 373,
        "endFrame": 388
      },
      {
        "text": "en",
        "startFrame": 388,
        "endFrame": 393
      },
      {
        "text": "vivo.",
        "startFrame": 393,
        "endFrame": 418
      }
    ]
  },
  {
    "startFrame": 427,
    "endFrame": 472,
    "panel": 4,
    "words": [
      {
        "text": "Twitch",
        "startFrame": 428,
        "endFrame": 433
      },
      {
        "text": "colapsó,",
        "startFrame": 433,
        "endFrame": 455
      },
      {
        "text": "Steam",
        "startFrame": 455,
        "endFrame": 460
      },
      {
        "text": "lloró",
        "startFrame": 460,
        "endFrame": 470
      },
      {
        "text": "y",
        "startFrame": 470,
        "endFrame": 474
      }
    ]
  },
  {
    "startFrame": 472,
    "endFrame": 517,
    "panel": 4,
    "words": [
      {
        "text": "tu",
        "startFrame": 474,
        "endFrame": 479
      },
      {
        "text": "mamá",
        "startFrame": 479,
        "endFrame": 489
      },
      {
        "text": "preguntó",
        "startFrame": 489,
        "endFrame": 504
      },
      {
        "text": "si",
        "startFrame": 504,
        "endFrame": 509
      },
      {
        "text": "eso",
        "startFrame": 509,
        "endFrame": 519
      }
    ]
  },
  {
    "startFrame": 517,
    "endFrame": 570,
    "panel": 4,
    "words": [
      {
        "text": "arregla",
        "startFrame": 519,
        "endFrame": 534
      },
      {
        "text": "el",
        "startFrame": 534,
        "endFrame": 539
      },
      {
        "text": "WiFi.",
        "startFrame": 539,
        "endFrame": 564
      }
    ]
  },
  {
    "startFrame": 573,
    "endFrame": 638,
    "panel": 5,
    "words": [
      {
        "text": "Giro:",
        "startFrame": 574,
        "endFrame": 594
      },
      {
        "text": "no",
        "startFrame": 594,
        "endFrame": 599
      },
      {
        "text": "fue",
        "startFrame": 599,
        "endFrame": 604
      },
      {
        "text": "un",
        "startFrame": 604,
        "endFrame": 609
      },
      {
        "text": "ataque.",
        "startFrame": 609,
        "endFrame": 640
      }
    ]
  },
  {
    "startFrame": 638,
    "endFrame": 677,
    "panel": 5,
    "words": [
      {
        "text": "Fue",
        "startFrame": 640,
        "endFrame": 644
      },
      {
        "text": "un",
        "startFrame": 644,
        "endFrame": 649
      },
      {
        "text": "tipo",
        "startFrame": 649,
        "endFrame": 659
      },
      {
        "text": "con",
        "startFrame": 659,
        "endFrame": 664
      },
      {
        "text": "cuarenta",
        "startFrame": 664,
        "endFrame": 679
      }
    ]
  },
  {
    "startFrame": 677,
    "endFrame": 735,
    "panel": 5,
    "words": [
      {
        "text": "mil",
        "startFrame": 679,
        "endFrame": 684
      },
      {
        "text": "pestañas",
        "startFrame": 684,
        "endFrame": 699
      },
      {
        "text": "abiertas.",
        "startFrame": 699,
        "endFrame": 729
      }
    ]
  },
  {
    "startFrame": 738,
    "endFrame": 783,
    "panel": 6,
    "words": [
      {
        "text": "La",
        "startFrame": 739,
        "endFrame": 744
      },
      {
        "text": "bolsa",
        "startFrame": 744,
        "endFrame": 754
      },
      {
        "text": "cayó,",
        "startFrame": 754,
        "endFrame": 771
      },
      {
        "text": "los",
        "startFrame": 771,
        "endFrame": 776
      },
      {
        "text": "memes",
        "startFrame": 776,
        "endFrame": 785
      }
    ]
  },
  {
    "startFrame": 783,
    "endFrame": 823,
    "panel": 6,
    "words": [
      {
        "text": "subieron",
        "startFrame": 785,
        "endFrame": 800
      },
      {
        "text": "y",
        "startFrame": 800,
        "endFrame": 805
      },
      {
        "text": "el",
        "startFrame": 805,
        "endFrame": 810
      },
      {
        "text": "Gobierno",
        "startFrame": 810,
        "endFrame": 825
      }
    ]
  },
  {
    "startFrame": 823,
    "endFrame": 886,
    "panel": 6,
    "words": [
      {
        "text": "declaró",
        "startFrame": 825,
        "endFrame": 840
      },
      {
        "text": "feriado",
        "startFrame": 840,
        "endFrame": 854
      },
      {
        "text": "gamer.",
        "startFrame": 854,
        "endFrame": 880
      }
    ]
  },
  {
    "startFrame": 889,
    "endFrame": 938,
    "panel": 7,
    "words": [
      {
        "text": "¿Quién",
        "startFrame": 890,
        "endFrame": 895
      },
      {
        "text": "arruinó",
        "startFrame": 895,
        "endFrame": 910
      },
      {
        "text": "el",
        "startFrame": 910,
        "endFrame": 915
      },
      {
        "text": "estreno:",
        "startFrame": 915,
        "endFrame": 940
      }
    ]
  },
  {
    "startFrame": 938,
    "endFrame": 979,
    "panel": 7,
    "words": [
      {
        "text": "Rockstar,",
        "startFrame": 940,
        "endFrame": 956
      },
      {
        "text": "tu",
        "startFrame": 956,
        "endFrame": 961
      },
      {
        "text": "WiFi",
        "startFrame": 961,
        "endFrame": 971
      },
      {
        "text": "o",
        "startFrame": 971,
        "endFrame": 976
      },
      {
        "text": "el",
        "startFrame": 976,
        "endFrame": 981
      }
    ]
  },
  {
    "startFrame": 979,
    "endFrame": 1029,
    "panel": 7,
    "words": [
      {
        "text": "tipo",
        "startFrame": 981,
        "endFrame": 991
      },
      {
        "text": "de",
        "startFrame": 991,
        "endFrame": 996
      },
      {
        "text": "las",
        "startFrame": 996,
        "endFrame": 1001
      },
      {
        "text": "pestañas?",
        "startFrame": 1001,
        "endFrame": 1031
      }
    ]
  },
  {
    "startFrame": 1029,
    "endFrame": 1085,
    "panel": 7,
    "words": [
      {
        "text": "Comenta",
        "startFrame": 1031,
        "endFrame": 1046
      },
      {
        "text": "sin",
        "startFrame": 1046,
        "endFrame": 1051
      },
      {
        "text": "llorar.",
        "startFrame": 1051,
        "endFrame": 1077
      }
    ]
  }
];

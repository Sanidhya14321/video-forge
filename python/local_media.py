#!/usr/bin/env python3
"""Optional local models. First use downloads model weights; no hosted inference."""
import argparse, json, pathlib
p=argparse.ArgumentParser();p.add_argument('operation',choices=['transcribe','speak','doctor']);p.add_argument('--input');p.add_argument('--output');p.add_argument('--model',default='base');p.add_argument('--language',default='en');p.add_argument('--voice',default='af_heart');a=p.parse_args()
if a.operation=='doctor':
 import importlib.util
 print(json.dumps({m:importlib.util.find_spec(m) is not None for m in ['faster_whisper','kokoro','soundfile']}))
elif a.operation=='transcribe':
 try:from faster_whisper import WhisperModel
 except ImportError:raise SystemExit('Install optional models: uv sync --project python --python 3.11')
 model=WhisperModel(a.model,device='cpu',compute_type='int8')
 segments,info=model.transcribe(a.input,word_timestamps=True,language=a.language,vad_filter=True)
 words=[dict(text=w.word.strip(),start=w.start,end=w.end) for s in segments for w in (s.words or []) if w.word.strip() and w.end>w.start]
 pathlib.Path(a.output).write_text(json.dumps({'version':1,'language':info.language,'timing':'asr-word-alignment','words':words},indent=2))
else:
 try:
  from kokoro import KPipeline
  import numpy as np
  import soundfile as sf
 except ImportError:raise SystemExit('Install optional models: uv sync --project python --python 3.11')
 # Kokoro language codes differ from Whisper language codes.
 codes={'en':'a','en-gb':'b','es':'e','fr':'f','hi':'h','it':'i','ja':'j','pt':'p','zh':'z'}
 lang=codes.get(a.language)
 if not lang:raise SystemExit('Kokoro language is unsupported; supply an audio file instead')
 text=pathlib.Path(a.input).read_text();chunks=[audio for _,_,audio in KPipeline(lang_code=lang)(text,voice=a.voice)]
 if not chunks:raise SystemExit('Kokoro returned no audio')
 sf.write(a.output,np.concatenate(chunks),24000)

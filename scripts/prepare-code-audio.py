#!/usr/bin/env python3
"""Original procedural 24s score + local narration mix; run with the optional Python environment."""
import pathlib,subprocess,json,math,wave
import numpy as np
root=pathlib.Path(__file__).resolve().parents[1];p=root/'examples/code-film/public';rate=48000;duration=24
ff=str(root/'node_modules/ffmpeg-static/ffmpeg')
score=np.zeros((duration*rate,2),np.float64);rng=np.random.default_rng(71)
def add(at,signal,pan=0):
 start=round(at*rate);n=min(len(signal),len(score)-start)
 if n>0:score[start:start+n,0]+=signal[:n]*math.sqrt((1-pan)/2);score[start:start+n,1]+=signal[:n]*math.sqrt((1+pan)/2)
for beat in range(60):
 at=beat*.4;t=np.arange(int(rate*.20))/rate
 add(at,.34*np.sin(2*np.pi*(48*t+6*(1-np.exp(-t*40))))*np.exp(-t*27))
 t=np.arange(int(rate*.06))/rate;noise=rng.standard_normal(len(t));add(at+.2,.037*noise*np.exp(-t*80),(-1 if beat%2 else 1)*.5)
 if beat%2:
  t=np.arange(int(rate*.12))/rate;add(at,.08*rng.standard_normal(len(t))*np.exp(-t*40))
 t=np.arange(int(rate*.27))/rate;hz=[55,55,82.4069,65.406][beat//4%4];env=(1-np.exp(-t*100))*np.exp(-t*13);add(at,.13*(np.sin(2*np.pi*hz*t)+.2*np.sin(4*np.pi*hz*t))*env)
for at in [2,3.5,5,7.5,9.5,12,14.25,16.25,18,20,22]:
 t=np.arange(int(rate*.24))/rate;noise=rng.standard_normal(len(t));add(at-.12,.025*noise*np.sin(np.pi*t/.24)**2,.4)
 t=np.arange(int(rate*.18))/rate;add(at,.06*np.sin(2*np.pi*880*t)*np.exp(-t*30),-.3)
score*=np.minimum(np.arange(len(score))/rate/.1,1)[:,None]*np.minimum((len(score)-np.arange(len(score)))/rate/.4,1)[:,None]
with wave.open(str(p/'score.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes(np.int16(np.clip(score,-.95,.95)*32767).tobytes())
subprocess.run([ff,'-v','error','-y','-i',str(p/'voice-raw.wav'),'-af','adelay=350|350,loudnorm=I=-16:TP=-2:LRA=9,apad,atrim=0:24','-ar','48000',str(p/'voice.wav')],check=True)
subprocess.run([ff,'-v','error','-y','-i',str(p/'voice.wav'),'-i',str(p/'score.wav'),'-filter_complex','[0:a]volume=1[v];[1:a]volume=0.4[m];[v][m]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=10[a]','-map','[a]','-ar','48000','-t','24',str(p/'mix.wav')],check=True)
(p/'audio-provenance.json').write_text(json.dumps({'score':'Original generated numpy synthesis; seed71;150BPM','voice':'Local Kokoro af_heart; synthetic narration; text in narration.txt','mix':'FFmpeg loudnorm target−16LUFS/−1.5dBTP','noThirdPartyMusic':True},indent=2))
print('Prepared original score, local narration and mix')

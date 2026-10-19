"""Generate original beat-aligned reel audio using the optional local Python env."""
import argparse,json,pathlib
import numpy as np
import soundfile as sf
from kokoro import KPipeline
parser=argparse.ArgumentParser();parser.add_argument('--out',required=True);args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];out=pathlib.Path(args.out)
project=json.loads((root/'examples/reel-showcase.json').read_text());lines=json.loads((root/'examples/assets/reel-narration-script.json').read_text())
assert len(lines)==len(project['scenes'])
sr=24000;total=sum(s['duration'] for s in project['scenes']);voice=np.zeros(round(sr*total),np.float32)
pipe=KPipeline(lang_code='a');cursor=0;timing=[]
for i,(scene,line) in enumerate(zip(project['scenes'],lines)):
 def speak(speed):
  a=np.concatenate([np.asarray(a) for _,_,a in pipe(line,voice='af_heart',speed=speed)])
  nz=np.flatnonzero(abs(a)>.005)
  return a[max(0,nz[0]-240):min(len(a),nz[-1]+480)]
 rate=1.12;a=speak(rate);available=scene['duration']-.12
 if len(a)/sr>available:a=speak(min(1.5,rate*len(a)/sr/available+.02))
 if len(a)/sr>scene['duration']-.08:raise ValueError('Speech too long: '+line)
 start=round((cursor+.035)*sr);voice[start:start+len(a)]=a
 timing.append({'text':line,'start':start/sr,'end':(start+len(a))/sr,'scene':i+1});cursor+=scene['duration']
 print(i+1,line,round(len(a)/sr,2),flush=True)
sf.write(out/'voice-raw.wav',voice,sr);(out/'voice-timing.json').write_text(json.dumps(timing,indent=2)+'\n')
# A new, sample-free minimal electronic composition with a quiet bridge.
sr=48000;audio=np.zeros(round(total*sr));rng=np.random.default_rng(17);bpm=project['reel']['bpm'];beat=60/bpm

def add(at,samples):
 begin=round(at*sr);n=min(len(samples),len(audio)-begin)
 if begin>=0 and n>0:audio[begin:begin+n]+=samples[:n]
for b in range(round(total/beat)):
 at=b*beat;bridge=.35 if 64<=b<68 else 1
 t=np.arange(round(sr*.27))/sr
 add(at,np.sin(2*np.pi*(43*t+3*(1-np.exp(-t*30))))*np.exp(-t*24)*.42*bridge)
 if b%4 in (1,3):
  t=np.arange(round(sr*.12))/sr;add(at,rng.normal(size=len(t))*np.exp(-t*36)*.055*bridge)
 for off in (0,.5):
  t=np.arange(round(sr*.045))/sr;n=rng.normal(size=len(t));add(at+off*beat,np.diff(n,prepend=0)*np.exp(-t*120)*.013)
 t=np.arange(round(sr*.3))/sr;freq=[146.832,220,293.665,220,164.814,246.942,329.628,246.942][b%8]
 add(at,np.sin(2*np.pi*freq*t)*(1-np.exp(-100*t))*np.exp(-13*t)*.07*bridge)
 if b%4==0:
  t=np.arange(round(sr*.13))/sr;add(at,np.sin(2*np.pi*(700*t-1400*t*t))*np.exp(-t*35)*.065)
t=np.arange(len(audio))/sr;audio*=np.minimum(1,t/.08)*np.minimum(1,(total-t)/.35)
sf.write(out/'score.wav',audio,sr)

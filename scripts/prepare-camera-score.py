#!/usr/bin/env python3
"""Original short score for the camera study: 120 BPM pulse and directed travel cues."""
import math,random,struct,wave,pathlib
root=pathlib.Path(__file__).resolve().parents[1];rate=24000;duration=12;rng=random.Random(61);left=[0.]*(rate*duration);right=[0.]*(rate*duration)
def add(at,length,fn,level=.15,pan=0):
 start=int(at*rate)
 for j in range(int(length*rate)):
  i=start+j
  if i>=len(left):break
  t=j/rate;v=fn(t)*level;left[i]+=v*(1-pan*.4);right[i]+=v*(1+pan*.4)
for beat in range(24):
 at=beat*.5
 add(at,.22,lambda t:math.sin(2*math.pi*(52*t+35*(1-math.exp(-t*30))/30))*math.exp(-t*24),.32)
 if beat%2:add(at,.13,lambda t:rng.uniform(-1,1)*math.exp(-t*48),.075,.15)
 if beat%4 in [0,2]:
  freq=[110,130.8128,146.8324][min(2,beat//8)]
  add(at,.38,lambda t,f=freq:(math.sin(2*math.pi*f*t)+.2*math.sin(2*math.pi*2*f*t))*math.exp(-t*8)*min(1,t/.006),.12,-.15)
for at,length,pan in [(.7,.65,-.6),(2.3,.55,.6),(4.4,.5,-.4),(6.9,.45,.4),(8.4,.55,-.5),(10.3,.55,.4)]:
 add(at,length,lambda t,d=length:rng.uniform(-1,1)*math.sin(math.pi*t/d)**2,.045,pan)
for at in [3.3,7.25,10.6]:add(at,.35,lambda t:math.sin(2*math.pi*690*t)*math.exp(-t*17),.09)
p=root/'examples/assets/camera-score.wav'
with wave.open(str(p),'wb') as w:
 w.setparams((2,2,rate,0,'NONE','not compressed'))
 b=bytearray()
 for i,(a,c) in enumerate(zip(left,right)):
  fade=min(1,i/(rate*.03),(len(left)-i)/(rate*.18));b.extend(struct.pack('<hh',int(max(-.95,min(.95,a*fade))*32767),int(max(-.95,min(.95,c*fade))*32767)))
 w.writeframes(b)
print(p.name,p.stat().st_size)

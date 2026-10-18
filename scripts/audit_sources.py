#!/usr/bin/env python3
"""Verify recorded evidence at pinned revisions without executing source code."""
import argparse,json,pathlib,urllib.request,hashlib,concurrent.futures
p=argparse.ArgumentParser();p.add_argument('--rank',type=int);p.add_argument('--output',type=pathlib.Path);a=p.parse_args()
root=pathlib.Path(__file__).resolve().parents[1];rows=json.loads((root/'sources/catalog.json').read_text())
files={e['url']:e for r in rows if a.rank in (None,r['rank']) for e in r['evidence']}
def verify(item):
 url,expected=item
 try:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'video-forge-audit/0.1'}),timeout=25) as res:data=res.read(4000000)
  actual=hashlib.sha256(data).hexdigest();return {'url':url,'matches':actual==expected['sha256'],'sha256':actual}
 except Exception as error:return {'url':url,'matches':False,'error':str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:results=list(pool.map(verify,files.items()))
report={'checked':len(results),'passed':sum(r['matches'] for r in results),'results':results}
s=json.dumps(report,indent=2)+'\n'
if a.output:a.output.write_text(s)
else:print(s)
raise SystemExit(0 if all(r['matches'] for r in results) else 1)

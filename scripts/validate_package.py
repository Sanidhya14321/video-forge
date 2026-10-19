#!/usr/bin/env python3
"""Structural release checks; these do not evaluate an agent model's judgment."""
import json,pathlib,re,sys
root=pathlib.Path(__file__).resolve().parents[1]
errors=[]
def check(ok,message):
 if not ok:errors.append(message)
pkg=json.loads((root/'package.json').read_text())
host=json.loads((root/'.release.json').read_text())['host'] if (root/'.release.json').exists() else 'source'
if host=='claude-skill':host='standalone'
for p in ['plugin.json','.claude-plugin/plugin.json','.codex-plugin/plugin.json']:
 if not (root/p).exists():
  check((host=='claude' and p in ['plugin.json','.codex-plugin/plugin.json']) or (host=='codex' and p=='.claude-plugin/plugin.json') or host=='standalone','Required manifest missing: '+p);continue
 m=json.loads((root/p).read_text());check(m['name']=='video-forge',p+' name');check(m['version']==pkg['version'],p+' version')
if (root/'plugin.json').exists():
 openai=json.loads((root/'plugin.json').read_text()).get('extensions',{}).get('com.openai',{})
 if openai.get('onboardingSkill'):check((root/openai['onboardingSkill']).is_file(),'Missing onboarding skill')
if (root/'.codex-plugin/plugin.json').exists():check(json.loads((root/'.codex-plugin/plugin.json').read_text())['skills']=='./skills/','Codex skills path')
for skill in (root/'skills').iterdir():
 if not skill.is_dir():continue
 entry=root/'SKILL.md' if host=='standalone' and skill.name=='video-forge' else skill/'SKILL.md'
 s=entry.read_text();check(s.startswith('---\n'),'Missing frontmatter: '+skill.name)
 check(f'name: {skill.name}\n' in s,'Mismatched skill name: '+skill.name)
 check(bool(re.search(r'^description: .+',s,re.M)),'Missing description: '+skill.name)
 check(((root if host=='standalone' and skill.name=='video-forge' else skill)/'agents/openai.yaml').exists(),'Missing UI metadata: '+skill.name)
 for file in list(skill.rglob('*.md'))+([entry] if entry.parent==root else []):
  text=file.read_text()
  for link in re.findall(r'\]\(([^)]+)\)',text):
   if link.startswith(('https:','http:','#','mailto:')):continue
   check((file.parent/link.split('#')[0]).exists(),f'Broken link: {file.relative_to(root)} -> {link}')
rows=json.loads((root/'sources/catalog.json').read_text());check(len(rows)==100,'Catalog must contain 100 entries')
check({r['rank'] for r in rows}==set(range(1,101)),'Catalog ranks missing or repeated')
for row in rows:
 check(row['disposition'] in ['implemented and tested','reference guidance','unverified/unavailable'],'Invalid disposition')
 check((root/row['destination']).exists(),f"Missing destination for {row['rank']}")
 check(bool(row.get('summary')),f"Missing summary for {row['rank']}")
 check(bool(row.get('dependencies')) or row['verificationStatus']=='unverified',f"Missing dependency disposition for {row['rank']}")
 if row['verificationStatus']=='unverified':check(bool(row['reason']),'Unverified entry requires reason')
 else:
  check(bool(row['canonicalSource']) and bool(row['inspectedRevision']),f"No source revision for {row['rank']}")
  check(all(len(x['sha256'])==64 for x in row['evidence']),f"Invalid evidence hashes for {row['rank']}")
 # Derived entry notes are deliberately traceable even for unresolved names.
 check((root/f"skills/video-{row['module']}/references/catalog.md").exists(),'Missing module catalog')
for example in (root/'examples').glob('*.json'):
 p=json.loads(example.read_text());check(p['version']==1,'Example version')
check((root/'package-lock.json').exists(),'Missing npm lockfile');check((root/'python/uv.lock').exists(),'Missing Python lockfile')
if errors:print('\n'.join(errors),file=sys.stderr);raise SystemExit(1)
print(f'Validated {len(list((root/"skills").iterdir()))} skills, host manifests, links, lockfiles, and all 100 source records.')

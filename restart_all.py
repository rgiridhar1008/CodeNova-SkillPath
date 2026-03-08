import psutil,subprocess,time,os 
TARGET={5000,5173} 
killed=[] 
for c in psutil.net_connections(kind='inet'): 
    if c.status=='LISTEN' and c.laddr and c.laddr.port in TARGET and c.pid: 
        try: 
            p=psutil.Process(c.pid) 
            p.terminate() 
            killed.append((c.laddr.port,c.pid,p.name())) 
        except Exception: pass 
time.sleep(1) 
subprocess.Popen(['python','app.py'], cwd=r'd:\Novora Hackathon\SkillPath\backend') 
subprocess.Popen(['npm','run','dev'], cwd=r'd:\Novora Hackathon\SkillPath\frontend') 
print('killed',killed) 
print('started','backend:5000','frontend:5173') 

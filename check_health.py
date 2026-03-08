import urllib.request 
with urllib.request.urlopen('http://localhost:5000/health', timeout=5) as r: 
    print(r.status) 

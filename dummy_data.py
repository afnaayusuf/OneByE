"""
Sends cycling dummy metric values to the local server every 3 seconds.
Run:  python dummy_data.py
"""

import time, math, random, json, urllib.request

URL = "http://localhost:8080/api/metrics"

SEQUENCES = {
    "volume":    [57, 43, 30, 65, 82, 48, 71, 36, 90, 55],
    "pressure":  [13.4, 8.2, 17.1, 5.6, 11.9, 19.3, 3.7, 14.8, 9.5, 16.0],
    "vibration": [72.6, 45.3, 88.1, 33.7, 61.2, 95.0, 22.4, 79.8, 50.5, 67.9],
    "battery":   [84, 82, 79, 76, 73, 70, 68, 65, 63, 60],
    "network":   [23, 18, 27, 12, 30, 8, 25, 15, 21, 29],
    "gas":       [1380, 1720, 980, 2450, 1100, 3200, 850, 1960, 2780, 1540],
}

step = 0

print("Sending dummy metrics to", URL)
print("Press Ctrl+C to stop\n")

while True:
    payload = {}
    for key, seq in SEQUENCES.items():
        payload[key] = seq[step % len(seq)]

    data = json.dumps(payload).encode()
    req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"}, method="POST")

    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read())
            print(f"[step {step}] sent: {payload}")
    except Exception as e:
        print(f"[step {step}] error: {e}")

    step += 1
    time.sleep(3)

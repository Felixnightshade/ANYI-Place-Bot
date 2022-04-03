# Credits: stech3

# Parses the html of the google sheet overlay to return a matrix of colors

# pip install beautifulsoup4
from bs4 import BeautifulSoup

myf = open("Main Design.html")

soup = BeautifulSoup(myf.read().encode("utf-8"), "html.parser")

outp = []

myl = soup.find_all("tr")
for item in myl:
    outp.append([])
    for itemi in item.find_all("td"):
        try:
            outp[len(outp) - 1].append(itemi["class"][0])
        except:
            outp[len(outp) - 1].append("ncncncn")

# remove borders
for i in range(3):
    outp.pop(0)

for i in range(len(outp)):
    for j in range(2):
        outp[i].pop(0)

# css parsing!
from json import loads

styledata = soup.find_all("style")[0].text.split(".ritz .waffle .")
correlation = {}
for item in styledata:
    try:
        correlation[item.split("{", 1)[0]] = loads(
            ('{"' + item.split("{", 1)[-1])
            .replace(":", '":"')
            .replace(";", '","')
            .replace(',"}', "}")
            .replace('"," }', '"}')
        )["background-color"]
    except:
        pass

outf = open("out.txt", "w")
outs = ""
for line in outp:
    outs += "\t".join(line) + "\n"

for item in correlation.keys():
    outs = outs.replace(item + "\t", correlation[item] + "\t")
    outs = outs.replace(item + "\n", correlation[item] + "\n")

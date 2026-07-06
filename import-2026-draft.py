#!/usr/bin/env python3
"""Read the 2026 draft workbook without importing its embedded player images."""

import argparse
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def column_index(reference):
    letters = re.match(r"[A-Z]+", reference).group(0)
    value = 0
    for letter in letters:
        value = value * 26 + ord(letter) - 64
    return value - 1


def workbook_rows(path):
    with zipfile.ZipFile(path) as archive:
        strings = []
        shared = ET.fromstring(archive.read("xl/sharedStrings.xml"))
        for item in shared.findall("m:si", NS):
            strings.append("".join(node.text or "" for node in item.findall(".//m:t", NS)))

        sheet = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
        rows = []
        max_column = 0
        for row in sheet.findall(".//m:sheetData/m:row", NS):
            values = {}
            for cell in row.findall("m:c", NS):
                index = column_index(cell.attrib["r"])
                max_column = max(max_column, index)
                cell_type = cell.attrib.get("t")
                raw = cell.find("m:v", NS)
                if cell_type == "inlineStr":
                    node = cell.find(".//m:t", NS)
                    value = node.text if node is not None else ""
                elif raw is None:
                    value = ""
                elif cell_type == "s":
                    value = strings[int(raw.text)]
                elif cell_type == "b":
                    value = raw.text == "1"
                else:
                    text = raw.text or ""
                    try:
                        number = float(text)
                        value = int(number) if number.is_integer() else number
                    except ValueError:
                        value = text
                values[index] = value
            rows.append((int(row.attrib["r"]), values))
        return rows, max_column + 1


def dense(values, width):
    return [values.get(index, "") for index in range(width)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--rows", type=int, default=20)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    rows, width = workbook_rows(args.workbook)
    if args.output:
        players = []
        for _, values in rows:
            pick = values.get(2)
            if not isinstance(pick, int) or not 1 <= pick <= 224:
                continue
            player_text = re.sub(r"\s+", " ", str(values.get(5, "")).replace("\xa0", " ")).strip()
            match = re.search(r"\s*\(([A-Z/]+)\)\s*$", player_text)
            position = match.group(1) if match else ""
            player = player_text[: match.start()].strip() if match else player_text
            points = values.get(11, "")
            games = values.get(8, "")
            is_goalie = position == "G"
            players.append({
                "pick": pick,
                "round": (pick - 1) // 32 + 1,
                "nhlTeam": str(values.get(4, "")).replace("\xa0", " ").strip(),
                "player": player,
                "position": position,
                "team": str(values.get(6, "")).replace("\xa0", " ").strip(),
                "league": str(values.get(7, "")).replace("\xa0", " ").strip(),
                "games": games,
                "goals": "" if is_goalie else values.get(9, ""),
                "assists": "" if is_goalie else values.get(10, ""),
                "points": "" if is_goalie else points,
                "ppg": round(points / games, 2) if not is_goalie and isinstance(points, (int, float)) and isinstance(games, (int, float)) and games else "",
                "gaa": values.get(9, "") if is_goalie else "",
                "svPct": values.get(10, "") if is_goalie else "",
            })
        payload = "const DRAFT_2026_DATA=" + json.dumps(players, ensure_ascii=False, separators=(",", ":")) + ";\n"
        args.output.write_text(payload, encoding="utf-8")
        print(json.dumps({"output": str(args.output), "players": len(players)}, ensure_ascii=False))
        return
    print(json.dumps({"rowCount": len(rows), "columnCount": width}, ensure_ascii=False))
    for number, values in rows[: args.rows]:
        print(json.dumps({"row": number, "values": dense(values, width)}, ensure_ascii=False))


if __name__ == "__main__":
    main()

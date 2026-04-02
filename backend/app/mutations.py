def generate_variants(logs):
    variants = [("baseline", logs)]

    # Obfuscated PowerShell
    v1 = []
    for log in logs:
        new_log = dict(log)
        raw = dict(log.get("raw_log", {}))
        if raw.get("command_line"):
            raw["command_line"] = raw["command_line"].replace("-enc", "-EncodedCommand")
            new_log["message"] += " (obfuscated variant)"
        new_log["raw_log"] = raw
        v1.append(new_log)
    variants.append(("obfuscated", v1))

    # Renamed dump tool
    v2 = []
    for log in logs:
        new_log = dict(log)
        raw = dict(log.get("raw_log", {}))
        if raw.get("process_name") == "procdump.exe":
            raw["process_name"] = "dumpert.exe"
            new_log["message"] += " (renamed tool variant)"
        new_log["raw_log"] = raw
        v2.append(new_log)
    variants.append(("renamed_tool", v2))

    # Low and slow
    v3 = []
    for log in logs:
        new_log = dict(log)
        raw = dict(log.get("raw_log", {}))
        if raw.get("failed_attempts"):
            raw["failed_attempts"] = 6
            new_log["message"] += " (low and slow variant)"
        new_log["raw_log"] = raw
        v3.append(new_log)
    variants.append(("low_and_slow", v3))

    return variants
type Level = "info" | "warn" | "error";

function write(level: Level, msg: string, fields?: Record<string, unknown>) {
  const entry: Record<string, unknown> = {
    ts: new Date().toISOString(),
    level,
    msg,
  };
  if (fields) Object.assign(entry, fields);
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export function logInfo(msg: string, fields?: Record<string, unknown>) {
  write("info", msg, fields);
}

export function logWarn(msg: string, fields?: Record<string, unknown>) {
  write("warn", msg, fields);
}

export function logError(msg: string, err?: unknown, fields?: Record<string, unknown>) {
  const errInfo =
    err instanceof Error
      ? { error: err.message, stack: err.stack }
      : { error: err ?? String(err) };
  write("error", msg, { ...errInfo, ...fields });
}

export function logSecurity(event: string, fields?: Record<string, unknown>) {
  write("info", `security.${event}`, fields);
}
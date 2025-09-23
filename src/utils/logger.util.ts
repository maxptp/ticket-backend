function getLocalTimeString(): string {
  const now = new Date();
  // GMT+7 (Bangkok time)
  return new Date(now.getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .replace('Z', '+07:00');
}

export function logWithTime(message: string) {
  console.log(`[${getLocalTimeString()}] ${message}`);
}

export function logErrorWithTime(message: string, err: Error) {
  console.error(`[${getLocalTimeString()}] ${message}\n${err.message}`);
}

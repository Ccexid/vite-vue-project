/**
 * 将 HSL 字符串转换为 RGB 格式
 * 示例: "233 100% 73%" -> "rgb(115, 132, 255)"
 */
export function hslToRgb(hslStr: string): string {
  // 1. 处理可能存在的空字符串或格式不正确的情况
  const parts = hslStr.replace(/%/g, '').trim().split(/\s+/);

  if (parts.length < 3) {
    // 如果格式不对，返回一个默认值（比如透明或黑色），防止程序崩溃
    return 'rgb(0, 0, 0)';
  }

  // 2. 强制转换并确保解构后的变量有值
  const h = Number(parts[0]);
  const s = Number(parts[1]);
  const l = Number(parts[2]);

  const sR = s / 100;
  const lR = l / 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = sR * Math.min(lR, 1 - lR);
  const f = (n: number) => lR - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return `rgb(${r}, ${g}, ${b})`;
}

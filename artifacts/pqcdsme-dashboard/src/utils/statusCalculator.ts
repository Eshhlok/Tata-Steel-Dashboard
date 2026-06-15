export type KPIColor =
  | "green"
  | "yellow"
  | "red";

const TOLERANCE = 0.005;

export function getStatusColor(
  current: number,
  fy26Actual: number,
  higherIsBetter: boolean
): KPIColor {

  const diff =
    Math.abs(current - fy26Actual) /
    fy26Actual;

  if (diff <= TOLERANCE) {
    return "yellow";
  }

  if (higherIsBetter) {
    return current > fy26Actual
      ? "green"
      : "red";
  }

  return current < fy26Actual
    ? "green"
    : "red";
}
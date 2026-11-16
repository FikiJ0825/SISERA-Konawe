import { useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@/theme';
import type { TrenPoint } from '@/types';

const HEIGHT = 190;
const PAD = { top: 22, right: 18, bottom: 28, left: 18 };

/** Grafik garis + area sederhana (tanpa pustaka chart) agar ringan dan aman di Expo Go. */
export function TrendChart({ data, color = colors.primary600 }: { data: TrenPoint[]; color?: string }) {
  const [width, setWidth] = useState(0);
  if (data.length < 2) return null;

  const values = data.map((d) => d.nilai);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerW = Math.max(width - PAD.left - PAD.right, 1);
  const innerH = HEIGHT - PAD.top - PAD.bottom;

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + innerH - ((d.nilai - min) / span) * innerH,
    ...d,
  }));

  // kurva halus (Catmull-Rom -> Bezier)
  const line = pts.reduce((acc, p, i, arr) => {
    if (i === 0) return `M${p.x} ${p.y}`;
    const p0 = arr[i - 2] ?? arr[i - 1];
    const p1 = arr[i - 1];
    const p3 = arr[i + 1] ?? p;
    const c1x = p1.x + (p.x - p0.x) / 6;
    const c1y = p1.y + (p.y - p0.y) / 6;
    const c2x = p.x - (p3.x - p1.x) / 6;
    const c2y = p.y - (p3.y - p1.y) / 6;
    return `${acc} C${c1x} ${c1y} ${c2x} ${c2y} ${p.x} ${p.y}`;
  }, '');
  const baseY = PAD.top + innerH;
  const area = `${line} L${pts[pts.length - 1].x} ${baseY} L${pts[0].x} ${baseY} Z`;
  const last = pts[pts.length - 1];

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height: HEIGHT }}>
      {width > 0 ? (
        <Svg width={width} height={HEIGHT}>
          <Defs>
            <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.28} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {[0, 0.5, 1].map((t) => (
            <Line key={t} x1={PAD.left} x2={width - PAD.right} y1={PAD.top + innerH * t} y2={PAD.top + innerH * t} stroke={colors.line} strokeWidth={1} strokeDasharray="4 5" />
          ))}
          <Path d={area} fill="url(#area)" />
          <Path d={line} stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <SvgText key={p.label + i} x={p.x} y={HEIGHT - 8} fontSize={10.5} fontFamily={fonts.medium} fill={colors.muted} textAnchor={i === 0 ? 'start' : i === pts.length - 1 ? 'end' : 'middle'}>
              {p.label}
            </SvgText>
          ))}
          <Circle cx={last.x} cy={last.y} r={9} fill={colors.orange} opacity={0.22} />
          <Circle cx={last.x} cy={last.y} r={5} fill="#fff" stroke={colors.orange} strokeWidth={3} />
        </Svg>
      ) : null}
    </View>
  );
}

export function ChartLegend({ first, last }: { first?: TrenPoint; last?: TrenPoint }) {
  if (!first || !last) return null;
  const naik = last.nilai >= first.nilai;
  return (
    <Text className="mt-1 font-medium text-[12px] text-muted">
      {first.label} → {last.label}: {naik ? 'naik' : 'turun'}
    </Text>
  );
}

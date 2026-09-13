import React, { useState } from 'react';

export default function DecayChart({ points = [], durationMonths = 9, expiryDate = '' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!points || points.length === 0) return null;

  const width = 600;
  const height = 240;
  const padding = { top: 30, right: 30, bottom: 40, left: 45 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxMonth = 48;
  const maxHealth = 100;

  const getX = (month) => padding.left + (month / maxMonth) * innerWidth;
  const getY = (health) => padding.top + innerHeight - (health / maxHealth) * innerHeight;

  // Build SVG path
  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(pt.month);
    const y = getY(pt.health);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Expiry mark coordinates
  const expiryX = getX(Math.min(durationMonths, maxMonth));

  return (
    <div className="brutal-card p-6 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5">CHART</span>
          <h3 className="text-lg font-black text-black">RELATIONSHIP DECAY TRAJECTORY</h3>
        </div>
        <span className="font-mono text-xs font-bold text-black bg-[#fff500] px-2 py-0.5 border border-black">
          FORMULA: H(t) = H₀ · e^(-d·t)
        </span>
      </div>

      <div className="relative w-full overflow-hidden bg-white border-2 border-black p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((h) => (
            <g key={h}>
              <line
                x1={padding.left}
                y1={getY(h)}
                x2={width - padding.right}
                y2={getY(h)}
                stroke="#000000"
                strokeDasharray="2 2"
                strokeWidth="1"
                opacity="0.3"
              />
              <text
                x={padding.left - 8}
                y={getY(h) + 4}
                fill="#000000"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="end"
              >
                {h}%
              </text>
            </g>
          ))}

          {/* X Axis Months Labels */}
          {[0, 12, 24, 36, 48].map((m) => (
            <g key={m}>
              <text
                x={getX(m)}
                y={height - 12}
                fill="#000000"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                {m}M
              </text>
            </g>
          ))}

          {/* Expiry Date Vertical Line Marker */}
          <line
            x1={expiryX}
            y1={padding.top}
            x2={expiryX}
            y2={getY(0)}
            stroke="#ff2d2d"
            strokeWidth="3"
            strokeDasharray="4 2"
          />

          <rect
            x={expiryX - 45}
            y={padding.top - 20}
            width="90"
            height="18"
            fill="#ff2d2d"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <text
            x={expiryX}
            y={padding.top - 7}
            fill="#ffffff"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            EXPIRY: {durationMonths}M
          </text>

          {/* Curve Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#000000"
            strokeWidth="4"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={getX(pt.month)}
              cy={getY(pt.health)}
              r={hoveredPoint?.month === pt.month ? 7 : 4}
              className="cursor-pointer"
              fill={hoveredPoint?.month === pt.month ? '#ff2d2d' : '#000000'}
              stroke="#000000"
              strokeWidth="2"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 bg-black text-white font-mono text-xs px-3 py-1.5 border border-white shadow-[3px_3px_0px_#000]">
            MONTH {hoveredPoint.month}: <strong>{hoveredPoint.health}% HEALTH</strong>
          </div>
        )}
      </div>

      <div className="font-mono text-[11px] text-black font-bold mt-2 text-right">
        [ HOVER POINTS FOR ESTIMATED HEALTH RESIDUALS ]
      </div>
    </div>
  );
}

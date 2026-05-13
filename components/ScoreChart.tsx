
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AIScore } from '../types';

interface Props {
  score: AIScore;
}

const ScoreChart: React.FC<Props> = ({ score }) => {
  const data = [
    { subject: 'Hatırlanma', A: score.recall, fullMark: 100 },
    { subject: 'Duygu Tonu', A: score.sentiment, fullMark: 100 },
    { subject: 'Otorite', A: score.authority, fullMark: 100 },
    { subject: 'Güven', A: score.trust, fullMark: 100 },
    { subject: 'Görünürlük', A: score.visibility, fullMark: 100 },
    { subject: 'E-E-A-T', A: score.eeat, fullMark: 100 },
    { subject: 'Schema', A: score.schemaMarkup, fullMark: 100 },
    { subject: 'İçerik', A: score.contentQuality, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skor"
            dataKey="A"
            stroke="#22d3ee"
            fill="#22d3ee"
            fillOpacity={0.45}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '13px',
            }}
            formatter={(value: number) => [`${value}/100`, 'Puan']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreChart;

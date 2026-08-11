export type TopicStat = {
  total: number;
  correct: number;
};

export type BlockStat = {
  total: number;
  correct: number;
  topics: Record<string, TopicStat>;
};

export type AIBlockReport = {
  block: string;
  score: number;
  weakestTopics: {
    topic: string;
    score: number;
  }[];
};

export function generateAIReport(
  blockStats: Record<string, BlockStat>
) {
  const blocks: AIBlockReport[] = Object.entries(blockStats).map(
    ([block, data]) => {
      const score =
        data.total === 0
          ? 0
          : Math.round(
              (data.correct / data.total) * 100
            );

      const weakestTopics = Object.entries(data.topics)
        .map(([topic, topicData]) => ({
          topic,
          score:
            topicData.total === 0
              ? 0
              : Math.round(
                  (topicData.correct / topicData.total) * 100
                ),
        }))
        .sort((a, b) => a.score - b.score);

      return {
        block,
        score,
        weakestTopics,
      };
    }
  );

  const strongest = [...blocks]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const weakest = [...blocks]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);

  return {
    strongest,
    weakest,
  };
}
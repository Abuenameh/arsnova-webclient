export class Combination {
  count: number;
  selectedChoiceIndexes: number[];
}


export class RoundStatistics {
  round: number;
  independentCounts: number[];
  combinatedCounts: Combination[];
  abstentionCount: number;
}

export class TextRoundStatistics extends RoundStatistics {
  texts: string[];
}

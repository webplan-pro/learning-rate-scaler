export const sineWaveRateScaler = (
  min: number,
  max: number,
  frequency: number,
  maxLearningRateDecay = 1,
  learningRateDecayPerEpoch = 1
) => {
  const halfRange = (max - min) / 2;
  return (iteration: number, epoch: number) =>
    Math.max(
      (min + halfRange + Math.sin(iteration * frequency) * halfRange) /
        maxLearningRateDecay ** iteration /
        learningRateDecayPerEpoch ** epoch,
      min
    );
};

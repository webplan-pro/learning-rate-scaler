import { Callback, Logs } from "@tensorflow/tfjs";
import { sineWaveRateScaler } from "./sineWaveRateScaler";

export class LearningRateCallback extends Callback {
  epoch: number;
  scalerFunction: (iteration: number, epoch: number) => number;
  constructor(
    {
      scalerFunction,
    }: {
      scalerFunction: (iteration: number, epoch: number) => number;
    } = {
      scalerFunction: sineWaveRateScaler(0.0001, 0.1, 15),
    }
  ) {
    super();
    this.scalerFunction = scalerFunction;
    this.epoch = 0;
  }

  scaleLearningRate = () => {
    return this.scalerFunction(this.model.optimizer.iterations, this.epoch);
  };

  onTrainBegin = async (logs?: Logs) => {
    this.setLearningRate(true);
  };

  onBatchEnd = async (batch: number, logs?: Logs) => {
    this.setLearningRate();
  };
  onEpochEnd = async (epoch: number, logs?: Logs) => {
    this.epoch = epoch;
  };

  setLearningRate(logMessages = false) {
    // @ts-ignore
    if (this.model.optimizer.setLearningRate != null) {
      // @ts-ignore
      this.model.optimizer.setLearningRate(this.scaleLearningRate());
    } else {
      // @ts-ignore
      if (this.model.optimizer.learningRate) {
        logMessages &&
          console.warn(
            `LearningRateScaler: The optimizer ${this.model.optimizer.getClassName()} has no method to set learning rate.
          Setting Learning rate manually.`
          );
        // @ts-ignore
        this.model.optimizer.learningRate = this.scaleLearningRate();
      } else {
        throw new Error(`LearningRateScaler: Looks like ${this.model.optimizer.getClassName()} optimizer doesn't have method to set
        learning rate.`);
      }
    }
  }
}

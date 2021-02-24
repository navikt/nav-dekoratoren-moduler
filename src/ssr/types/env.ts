export enum ENV {
  LOCALHOST = "localhost",
  PROD = "prod",
  DEV = "dev",
  Q0 = "q0",
  Q1 = "q1",
  Q2 = "q2",
  Q6 = "q6",
}

export type NAIS_ENV = ENV.PROD | ENV.DEV | ENV.Q0 | ENV.Q1 | ENV.Q2 | ENV.Q6;

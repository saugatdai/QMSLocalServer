import express from 'express';

export default class AppRouterSingleton {
  private static instance = express.Router();

  private constructor() { }

  public static getInstance() {
    return this.instance;
  }
}
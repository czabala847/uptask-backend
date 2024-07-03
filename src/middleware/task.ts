import type { NextFunction, Request, Response } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function validateTaskExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function taskBelongToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.task.project.toString() !== req.project.id.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

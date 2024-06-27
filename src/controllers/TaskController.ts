import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createProject = async (req: Request, res: Response) => {
    const { project } = req;
    try {
      const task = new Task(req.body);
      task.project = project.id;
      project.tasks.push(task.id);
      await task.save();
      await project.save();
      res.send("Task saved");
    } catch (error) {
      console.error(error);
    }
  };
}

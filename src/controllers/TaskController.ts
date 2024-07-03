import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
  static createProject = async (req: Request, res: Response) => {
    const { project } = req;
    try {
      const task = new Task(req.body);
      task.project = project.id;
      project.tasks.push(task.id);
      await Promise.allSettled([task.save(), project.save()]);
      res.send("Task saved");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.params.projectId }).populate(
        "project"
      );
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

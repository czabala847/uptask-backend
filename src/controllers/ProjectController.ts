import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);

    project.manager = req.user.id;

    try {
      await project.save();
      res.send("Project saved");
    } catch (error) {
      console.error(error);
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [{ manager: { $in: req.user.id } }],
      });
      res.json(projects);
    } catch (error) {
      console.error(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");

      if (!project) return res.status(404).json({ error: "No project found" });

      if (project.manager.toString() !== req.user.id.toString()) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndUpdate(id, req.body);

      if (!project) return res.status(404).json({ error: "No project found" });

      if (project.manager.toString() !== req.user.id.toString()) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await project.save();

      res.json(project);
    } catch (error) {
      console.error(error);
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) return res.status(404).json({ error: "No project found" });
      if (project.manager.toString() !== req.user.id.toString()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      await project.deleteOne();
      res.send("Project deleted");
    } catch (error) {
      console.error(error);
    }
  };
}

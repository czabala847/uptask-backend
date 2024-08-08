import { Router } from "express"
import { body, param } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { TaskController } from "../controllers/TaskController"
import { authenticate } from '../middleware/auth'
import { validateProjectExists } from "../middleware/project"
import { taskBelongToProject, validateTaskExists } from "../middleware/task"
import { handleInputError } from "../middleware/validation"

const router = Router();

router.post(
  "/",
  authenticate,
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("Las descripción del proyecto es obligatoria"),
  handleInputError,
  ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Id inválido"),
  handleInputError,
  ProjectController.getProjectById
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Id inválido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("Las descripción del proyecto es obligatoria"),
  handleInputError,
  ProjectController.updateProject
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Id inválido"),
  handleInputError,
  ProjectController.deleteProject
);

router.param("projectId", validateProjectExists);

router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("Las descripción de la tarea es obligatoria"),
  handleInputError,
  TaskController.createProject
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);
router.param("taskId", validateTaskExists);
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id inválido"),
  handleInputError,
  TaskController.getTaskById
);

router.param("taskId", taskBelongToProject);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id inválido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("Las descripción de la tarea es obligatoria"),
  handleInputError,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id inválido"),
  handleInputError,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("Id inválido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handleInputError,
  TaskController.updateStatus
);

export default router;

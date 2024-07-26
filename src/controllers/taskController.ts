import { Request, Response } from 'express';
import { prisma } from '../app';
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchemas';
import { z } from 'zod';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = createTaskSchema.parse(req.body);
    const userId = req.user!.id;

    //highest order in the column
    const highestOrder = await prisma.task.aggregate({
      where: {
        userId
      },
      _max: {
        order: true
      }
    })
    const order = highestOrder._max.order === null ? 1 : highestOrder._max.order + 1;
    const task = await prisma.task.create({
      data: { title, description, column: 'TODO', userId, order },
    });
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(401).json({ error: err.issues[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
export const editTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, column, order } = updateTaskSchema.parse(req.body);
    const userId = req.user!.id;
    const task = await prisma.task.update({
      where: { id, userId },
      data: { column, order, title, description },
    });
    res.status(200).json({ message: 'Task edited successfully', task });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(401).json({ error: err.issues[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, column, order } = updateTaskSchema.parse(req.body);
    const userId = req.user!.id;


    const task = await prisma.task.findUnique({ where: { id, userId } })
    const oldColumn = task?.column
    const oldOrder = task?.order

    // Update the task
    await prisma.task.update({
      where: { id },
      data: { column, order, title, description },
    })

    // Reorder tasks in the old column
    if (oldColumn !== column) {
      await prisma.task.updateMany({
        where: { column: oldColumn, order: { gt: oldOrder } },
        data: { order: { decrement: 1 } },
      })
    }

    // Reorder tasks in the new column
    await prisma.task.updateMany({
      where: {
        column: column,
        order: { gte: order },
        id: { not: id }
      },
      data: { order: { increment: 1 } },
    })
    res.status(200).json({ message: 'Task updated', task });
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(401).json({ error: err.issues[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    await prisma.task.delete({ where: { id, userId } });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

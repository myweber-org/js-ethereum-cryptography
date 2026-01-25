
interface Task {
  id: number;
  name: string;
  priority: number;
  execute: () => void;
}

class PriorityTaskScheduler {
  private tasks: Task[] = [];
  private isRunning: boolean = false;

  addTask(task: Task): void {
    this.tasks.push(task);
    this.tasks.sort((a, b) => b.priority - a.priority);
    console.log(`Task added: ${task.name} (Priority: ${task.priority})`);
  }

  removeTask(taskId: number): void {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    if (this.tasks.length < initialLength) {
      console.log(`Task ${taskId} removed`);
    }
  }

  async executeTasks(): Promise<void> {
    if (this.isRunning) {
      console.log("Scheduler is already running");
      return;
    }

    this.isRunning = true;
    console.log("Starting task execution...");

    while (this.tasks.length > 0) {
      const task = this.tasks.shift();
      if (task) {
        console.log(`Executing: ${task.name}`);
        try {
          task.execute();
          console.log(`Completed: ${task.name}`);
        } catch (error) {
          console.error(`Failed to execute ${task.name}:`, error);
        }
        await this.delay(1000);
      }
    }

    this.isRunning = false;
    console.log("All tasks completed");
  }

  getTaskCount(): number {
    return this.tasks.length;
  }

  clearAllTasks(): void {
    this.tasks = [];
    console.log("All tasks cleared");
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const scheduler = new PriorityTaskScheduler();

scheduler.addTask({
  id: 1,
  name: "Process user data",
  priority: 3,
  execute: () => console.log("Processing user data...")
});

scheduler.addTask({
  id: 2,
  name: "Send email notifications",
  priority: 1,
  execute: () => console.log("Sending email notifications...")
});

scheduler.addTask({
  id: 3,
  name: "Generate report",
  priority: 5,
  execute: () => console.log("Generating monthly report...")
});

console.log(`Total tasks: ${scheduler.getTaskCount()}`);
scheduler.executeTasks();
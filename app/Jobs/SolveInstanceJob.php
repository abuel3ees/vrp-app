<?php

namespace App\Jobs;

use App\Models\Instance;
use App\Services\VRP\VRPSolverService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SolveInstanceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * How long (in seconds) the worker may run this job
     * before it is considered failed.
     */
    public int $timeout = 600; // 10 minutes, tune as you like

    /**
     * The instance ID to solve.
     */
    public function __construct(public int $instanceId)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(VRPSolverService $solver): void
    {
        $instance = Instance::find($this->instanceId);

        if (! $instance) {
            return;
        }

        // Optional: mark as "solving" if you add such a column later
        // $instance->update(['solution_status' => 'solving']);

        // If you *really* want no limits here (worker side):
        // set_time_limit(0);

        // Solve the VRP using your existing service
        $routes = $solver->solve($instance);

        // Store full solution JSON (same as your old controller)
        $instance->solution = json_encode($routes);
        $instance->save();

        // Optional: mark as done
        // $instance->update(['solution_status' => 'done']);
    }
}
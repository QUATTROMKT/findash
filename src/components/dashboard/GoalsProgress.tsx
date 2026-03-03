import { formatBRL } from '../../lib/utils';
import { Target } from 'lucide-react';

interface Goal {
    group: string;
    name: string;
    limit: number;
    current: number;
}

interface GoalsProgressProps {
    goals: Goal[];
}

export default function GoalsProgress({ goals }: GoalsProgressProps) {
    return (
        <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-border mt-6">
            <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                    Metas & Envelopes
                </h3>
            </div>

            <div className="space-y-6">
                {goals.map((goal, idx) => {
                    const percentage = Math.min(100, (goal.current / goal.limit) * 100);

                    let colorClass = "bg-primary";
                    if (percentage >= 100) colorClass = "bg-destructive";
                    else if (percentage >= 80) colorClass = "bg-orange-500";
                    else if (idx === 1) colorClass = "bg-indigo-500";
                    else if (idx === 2) colorClass = "bg-rose-500";
                    else colorClass = "bg-emerald-500";

                    return (
                        <div key={idx}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {goal.name}
                                </span>
                                <span className="text-sm font-semibold text-foreground">
                                    {formatBRL(goal.current)} <span className="text-slate-400 font-normal">/ {formatBRL(goal.limit)}</span>
                                </span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

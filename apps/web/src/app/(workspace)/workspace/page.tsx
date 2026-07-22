import WorkspaceLayout from './layout';

export default function Page() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Widget Layout Structure */}
      <div className="col-span-2 rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center space-y-0 pb-2">
          <h3 className="tracking-tight text-lg font-semibold">Active Tournaments</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="h-[200px] bg-muted/20 rounded-md border flex items-center justify-center text-muted-foreground text-sm">
            Interactive Widget Render Area
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 flex flex-row items-center space-y-0 pb-2">
          <h3 className="tracking-tight text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-4">
             {/* Feed items */}
             <div className="flex items-center gap-4">
               <div className="h-2 w-2 rounded-full bg-primary" />
               <div className="space-y-1">
                 <p className="text-sm font-medium leading-none">Match Completed</p>
                 <p className="text-sm text-muted-foreground">Team A def. Team B</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

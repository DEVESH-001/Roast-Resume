import { ResumeRoaster } from "@/components/resume-roaster";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ResumeRoaster />
      </main>
      <footer className="py-6 text-center text-xs text-muted-foreground space-y-2">
        <div>
          Built with 💛 by{" "}
          <a
            href="https://devesh.work"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Devesh
          </a>
        </div>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://x.com/_Devesh_Yadav_"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            X (Twitter)
          </a>
          <a
            href="https://www.instagram.com/_devesh_yadav_/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Instagram
          </a>
        </div>
      </footer>
    </div>
  );
}

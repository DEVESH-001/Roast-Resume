import { ResumeRoaster } from "@/components/resume-roaster";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <ResumeRoaster />
      </main>
      <footer className="text-muted-foreground space-y-2 py-6 text-center text-xs">
        <div>
          Built with 💛 by{" "}
          <a
            href="https://roast.devesh.work/"
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
          <a
            href="http://github.com/devesh-001/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/deveshyadav1/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}

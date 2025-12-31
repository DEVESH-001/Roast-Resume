import Link from "next/link";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        <div className="inline-flex items-center justify-center p-4 bg-destructive/10 rounded-full">
          <Flame className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          404 – This page got roasted
        </h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
          Head back to the roast machine or check out more of Devesh&apos;s work.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">Back to Roast My Resume</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <a href="https://devesh.work" target="_blank" rel="noreferrer">
              Visit Devesh&apos;s site
            </a>
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
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
      </div>
    </main>
  );
}

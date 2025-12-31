"use client";

import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Upload,
  Github,
  Linkedin,
  AlertCircle,
  FileText,
  CheckCircle2,
  Flame,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ResumeRoaster() {
  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file change, validate file type, and set state
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a PDF file.");
      }
    }
  };

  // Handle form submission, validate inputs, and send request to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a resume (PDF).");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("githubUrl", githubUrl);
    formData.append("linkedinUrl", linkedinUrl);

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to roast resume");
        return;
      }

      setResult(data.roast);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 space-y-4 text-center">
        <div className="bg-destructive/10 mb-4 inline-flex items-center justify-center rounded-full p-3">
          <Flame className="text-destructive h-12 w-12" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Roast My Resume
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Upload your resume and let our AI ruthlessly critique your career
          choices. We&apos;ll also peek at your GitHub and LinkedIn if you dare.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        <Card className="h-fit lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Info</CardTitle>
            <CardDescription>
              Provide your details for the roast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF)</Label>
                <div
                  className="hover:bg-muted/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {file ? (
                    <div className="space-y-2 text-center">
                      <FileText className="text-primary mx-auto h-8 w-8" />
                      <p className="text-sm font-medium break-all">
                        {file.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Click to change
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center">
                      <Upload className="text-muted-foreground mx-auto h-8 w-8" />
                      <p className="text-muted-foreground text-sm">
                        Click to upload PDF
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="resume"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL (Optional)</Label>
                <div className="relative">
                  <Github className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    className="pl-9"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                <div className="relative">
                  <Linkedin className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    className="pl-9"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>
              </div>

              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Your PDF is processed securely on the server, we do not store
                your resume or share it with anyone else.
              </p>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Roasting...
                  </>
                ) : (
                  <>
                    <Flame className="mr-2 h-4 w-4" />
                    Roast Me
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="flex min-h-125 flex-col lg:col-span-2">
          <CardHeader>
            <CardTitle>The Verdict</CardTitle>
            <CardDescription>Brace yourself. The truth hurts.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {result ? (
              <div className="prose prose-xl prose-p:my-3 prose-li:my-2 prose-ul:my-3 prose-ol:my-3 prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-3xl prose-h2:font-extrabold prose-h2:text-primary prose-h2:bg-muted prose-h2:px-3 prose-h2:py-1 prose-h2:rounded-lg prose-strong:text-primary prose-strong:font-semibold dark:prose-invert max-w-none text-[15px]">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-4 p-8">
                {isLoading ? (
                  <div className="space-y-4 text-center">
                    <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                    <p className="animate-pulse text-lg">
                      Analyzing your life choices...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="bg-muted mx-auto flex h-24 w-24 items-center justify-center rounded-full">
                      <Flame className="text-muted-foreground/50 h-12 w-12" />
                    </div>
                    <p>Upload your resume to generate a roast.</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

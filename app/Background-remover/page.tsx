"use client";
import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageResultDisplay } from "@/components/ImageResultDisplay";
import { ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
const predefinedPrompt = `
 Remove the background from the image
`;


  const handleImageSelect = (imageData: string) => {
    setImage(imageData || null);
  };

  const handleImageConversion = async () => {
    if (!image) return;
  
    try {
      setLoading(true);
      setError(null);
  
      const requestData = {
        prompt: predefinedPrompt,
        image: image, // Ensure this is Base64 or a valid URL
        mode: "image-to-image", // Some APIs require specifying this
        strength: 0.75, // Adjust transformation intensity (0.5 - 1)
      };
  
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image. Please try again.");
      }
  
      const data = await response.json();
      if (data.image) {
        setGeneratedImage(data.image);
      } else {
        throw new Error("No image returned from API.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
      console.error("Error processing request:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleReset = () => {
    setImage(null);
    setGeneratedImage(null);
    setLoading(false);
    setError(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="w-full max-w-3xl border-0 bg-card shadow-lg p-6">
        <CardHeader className="flex flex-col items-center justify-center space-y-2">
          <CardTitle className="text-center text-xl font-bold text-foreground">
            AI background Remover
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 w-full text-center">
          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {!generatedImage && !loading ? (
            <>
              <ImageUpload onImageSelect={handleImageSelect} currentImage={image} />
              <button
                onClick={handleImageConversion}
                disabled={!image}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-4 disabled:opacity-50"
              >
                Remove Background
              </button>
            </>
          ) : loading ? (
            <div className="flex items-center justify-center h-56 max-w-sm bg-gray-300 rounded-lg animate-pulse">
              <ImageIcon className="w-10 h-10 text-gray-200" />
              <span className="pl-4 text-muted-foreground">Processing...</span>
            </div>
          ) : (
            <>
              <ImageResultDisplay imageUrl={generatedImage || ""} description="Studio Ghibli-style illustration"  onReset={handleReset} />
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

import { Header } from "./components/header"
import { Separator } from "./components/ui/separator"
import { VideoInputForm } from "./components/video-input-form"
import { AiPropertiesForm } from "./components/ai-properties-form"
import { useEffect, useState } from "react"
import { MainReqResArea } from "./components/main-req-res-area"
import { useCompletion } from "ai/react"

interface AiBody {
  videoId: string | null
  temperature: number
  prompt: string | null
}

export function App() {

  const initialStateAiBody = {
    temperature: 0,
    videoId: null,
    prompt: null
  }
  const [aiBody, setAiBody] = useState<AiBody>(initialStateAiBody)
  useEffect(() => {
    console.log(aiBody)
  }, [aiBody])


  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-1 p-6 flex gap-6">

        <MainReqResArea />

        <aside className="w-80 space-y-6">
          <VideoInputForm handleVideoId={(videoId) => {
            setAiBody((prevState) => ({
              ...prevState,
              videoId,
            }));
          }} />

          <Separator />

          <AiPropertiesForm handleData={({ prompt, temperature }) => {
            setAiBody((prevState) => ({
              ...prevState,
              prompt,
              temperature,
            }));
          }} />
        </aside>
      </main>

    </div>
  )
}
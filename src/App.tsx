import { Header } from "./components/header"
import { Separator } from "./components/ui/separator"
import { VideoInputForm } from "./components/video-input-form"
import { AiPropertiesForm } from "./components/ai-properties-form"
import { MainReqResArea } from "./components/main-req-res-area"
import { useState } from "react"

export function App() {

  const [videoId, setVideoId] = useState<string>("")
  
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main className="flex-1 p-6 flex gap-6">

        <MainReqResArea />

        <aside className="w-80 space-y-6">
          <VideoInputForm
            handleVideoId={setVideoId}
          />

          <Separator />

          <AiPropertiesForm
            videoId={videoId}
          />
        </aside>
      </main>

    </div>
  )
}
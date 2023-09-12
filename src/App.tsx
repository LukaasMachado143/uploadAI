import { Header } from "./components/Header/Header"
import { Textarea } from "./components/ui/textarea"
export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea className="resize-none p-4 leading-relaxed" placeholder="Inclua o prompt para a IA ..."/>
            <Textarea className="resize-none p-4 leading-relaxed" placeholder="Resultado gerado pela IA ..." readOnly/>
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável <code className="text-violet-400">{"{transcription}"}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
          </p>
        </div>
      </main>

    </div>
  )
}
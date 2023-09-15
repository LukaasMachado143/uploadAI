import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";

export function MainReqResArea(promptValue: any, resultAiValue: string) {
    const [prompt, setPrompt] = useState<string>("")
    const [resultAi, setResultAi] = useState<string>("")

    useEffect(() => {
        setPrompt(promptValue.promptValue)
    }, [promptValue])

    useEffect(() => {
        setResultAi(resultAiValue)
    }, [resultAiValue])

    return (
        <div className="flex flex-col flex-1 gap-4">
            <div className="grid grid-rows-2 gap-4 flex-1">
                <Textarea
                    value={prompt}
                    onChange={(event) => {
                        setPrompt(event.target.value)
                    }}
                    className="resize-none p-4 leading-relaxed"
                    placeholder="Inclua o prompt para a IA ..."
                />
                <Textarea
                    value={resultAi}
                    className="resize-none p-4 leading-relaxed"
                    placeholder="Resultado gerado pela IA ..."
                    readOnly
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Lembre-se: você pode utilizar a variável <code className="text-violet-400">{"{transcription}"}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.
            </p>
        </div>

    )
}
import { Wand2 } from "lucide-react";
import { PromptSelect } from "./prompt-select";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import { useCompletion } from "ai/react";

interface AiBody {
    videoId: string | null
    temperature: number
    prompt: string
}

interface AiPropertiesFormProps {
    videoId: string
}

export function AiPropertiesForm({ videoId }: AiPropertiesFormProps) {
    const aiBodyInitialState: AiBody = {
        videoId: "",
        temperature: 0.5,
        prompt: "",
    }
    const [aiBody, setAiBody] = useState<AiBody>(aiBodyInitialState)
    const [temperature, setTemperature] = useState(0.5)
    const [prompt, setPrompt] = useState<string>("")

    useEffect(() => {
        setAiBody({
            videoId: videoId,
            temperature: temperature,
            prompt: prompt,
        })
    }, [temperature, prompt, videoId])

    const {
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        completion,
        isLoading,
    } = useCompletion({
        api: 'http://localhost:3333/ai/complete',
        body: aiBody,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-2">
                <label>Prompt</label>
                <PromptSelect onSelectedValue={setPrompt} />
            </div>

            <div className="space-y-2">
                <label>Modelo</label>
                <Select disabled defaultValue='gpt3.5' >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gpt3.5">GPT 3.5-Turbo 16k</SelectItem>
                    </SelectContent>
                </Select>
                <span className="block text-muted-foreground text-xs italic">
                    Você poderá customizar essa opção em breve
                </span>
            </div>

            <Separator />

            <div className="space-y-4">
                <label className="flex items-center justify-between">
                    Temperatura
                    <span>{temperature}</span>
                </label>
                <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={value => setTemperature(value[0])}
                />
                <span className="block text-muted-foreground text-xs italic leading-relaxed">
                    Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
                </span>
            </div>

            <Separator />

            <Button
                disabled={aiBody.prompt === "" || aiBody.videoId === "" || isLoading}
                className="text-white w-full"
                type="submit"
            >
                Executar
                <Wand2 className="w-4 h-4 ml-2" />
            </Button>
        </form>
    )
}
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";

interface PromptProps {
    id: string
    title: string
    template: string
}

interface PromptSelectProps {
    onSelectedValue: (template: string) => void
}

export function PromptSelect({ onSelectedValue }: PromptSelectProps) {
    const [prompts, setPrompts] = useState<PromptProps[] | null>(null)
    useEffect(() => {
        api.get('/prompts').then(res => {
            setPrompts(res.data)
        })
    }, [])

    function handleSelectedPromp(id: string) {
        const selectedPrompt = prompts?.find(prompt => prompt.id === id)

        if (!selectedPrompt) return

        const template: string = selectedPrompt.template
        onSelectedValue(template)
    }

    return (
        <Select onValueChange={handleSelectedPromp}>
            <SelectTrigger>
                <SelectValue placeholder="Selecione um prompt ..." />
            </SelectTrigger>
            <SelectContent>
                {
                    prompts?.map(prompt => (
                        <SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}
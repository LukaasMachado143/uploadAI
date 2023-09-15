import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg"
import { fetchFile } from "@ffmpeg/util"
import { api } from "@/lib/axios";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'sucess'
const staatusMessage = {
    converting: "Convertendo...",
    uploading: "Carregando...",
    generating: "Transcrevendo...",
    sucess: "Sucesso !",
}

export function VideoInputForm() {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const promptInputRef = useRef<HTMLTextAreaElement>(null)
    const [status, setStatus] = useState<Status>('waiting')

    function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget

        if (!files) {
            return
        }

        const selectedFile = files.item(0)
        setVideoFile(selectedFile)

    }

    async function convertVideoToAudio(video: File) {
        console.log("Convert started.")
        const ffmpeg = await getFFmpeg();
        await ffmpeg.writeFile('input.mp4', await fetchFile(video))
        ffmpeg.on("progress", progress => {
            console.log('Converting progress: ' + progress.progress * 100)
        })

        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3'
        ])

        const data = await ffmpeg.readFile('output.mp3')

        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
        const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' })
        console.log("Convert finish.")
        return audioFile
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const prompt = promptInputRef.current?.value

        if (!videoFile) {
            return
        }
        setStatus("converting")
        // converter vídeo em aúdio
        const audioFile = await convertVideoToAudio(videoFile)
        console.log(audioFile, prompt)

        const data = new FormData()
        data.append('file', audioFile)

        setStatus("uploading")
        const response = await api.post("/videos", data)

        console.log(response.data)

        const videoId = response.data.id

        setStatus("generating")
        await api.post(`/videos/${videoId}/transcription`, { prompt })

        setStatus("sucess")
    }

    const previewUrl = useMemo(() => {

        if (!videoFile) {
            return null
        }

        return URL.createObjectURL(videoFile)
    }, [videoFile])

    return (
        <form className="space-y-6" onSubmit={handleUploadVideo}>
            <label htmlFor="video" className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/50 hover:text-white">
                {previewUrl ?

                    (
                        <video src={previewUrl} controls={false} className="pointer-events-none absolute inset-0" />
                    )

                    :

                    (

                        <>
                            <FileVideo className="w-4 h-4" />
                            Selecione um vídeo
                        </>
                    )
                }
            </label>

            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelection} />

            <Separator />

            <div className="space-y-2">
                <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
                <Textarea
                    ref={promptInputRef}
                    id="transcription_prompt"
                    disabled={status !== 'waiting'}
                    className="h-20 leading-relaxed resize-none"
                    placeholder="Inclua  palavras-chave mencionadas no vídeo, separadas por vírgula, ( , )."
                />
            </div>

            <Button
                data-success={status === "sucess"}
                disabled={status !== 'waiting'}
                className="text-white w-full data-[success=true]:bg-emerald-400 data-[success=true]:text-black"
                type="submit"
            >
                {status === 'waiting' ?
                    (
                        <>
                            Carregar Vídeo
                            <Upload className="w-4 h-4 ml-2" />
                        </>
                    )
                    :
                    staatusMessage[status]
                }
            </Button>
        </form>
    )
}
/* eslint-disable @next/next/no-img-element */
"use client"
import { FormDesignState, FormResponseDetailsState, stepState, submittedTestimonialState } from "@/app/atoms";
import { useRef, useState, useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ReactMarkdown from 'react-markdown';
import { supabase } from "@/supabaseClient";


export default function RecordT() {
    const [, setStep] = useRecoilState(stepState);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const FormDesign = useRecoilValue(FormDesignState);
    const FormResponseDetails = useRecoilValue(FormResponseDetailsState);
    const [, setSubmittedTestimonial] = useRecoilState(submittedTestimonialState)

    const [publicVideoURL, setPublicVideoURL] = useState("")

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play(); // Add this line
            }
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            chunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const stopRecording = useCallback(async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                setRecordedVideoUrl(url);

                // Upload the blob to Supabase Storage and get the permanent URL
                const permanentUrl = await uploadVideoToSupabase(blob); // Implement this function
                setSubmittedTestimonial({
                    content: permanentUrl, // Use the permanent URL here
                    type: "video"
                });
            };
        }
    }, []);

    // Function to upload video blob to Supabase Storage
    const uploadVideoToSupabase = async (blob: Blob): Promise<string> => {
        const { data: uploadedVideo, error } = await supabase.storage
            .from('videos') // Replace with your storage bucket name
            .upload(`video-${Date.now()}.mp4`, blob, {
                contentType: 'video/mp4',
                upsert: true // Set to true to overwrite if the file already exists
            });

        if (error) {
            throw new Error('Failed to upload video: ' + error.message);
        }

        // Get the public URL of the uploaded video
        const { data } = supabase.storage.from('videos').getPublicUrl(uploadedVideo.path)
        setPublicVideoURL(data.publicUrl)
        return data.publicUrl; // Return the public URL
    };

    return (
        <div className="w-full relative pt-12 pb-6 space-y-10 items-center smooth
        justify-center flex flex-col bg-white">
            <img src={FormDesign.logo ? FormDesign.logo : "https://via.placeholder.com/60"} alt="logo"
                className="form_logo" />
            <div className="w-full space-y-3">
                <h1 className="text-gray-700 text-xl font-medium">
                    Record a video testimonial
                </h1>
                <ReactMarkdown>
                    {FormResponseDetails.videoPrompt}
                </ReactMarkdown>
            </div>
            <div className="w-full space-y-4 items-center justify-center flex 
            flex-col py-6 border border-black/10 rounded-lg bg-gray-100/30">
                {isRecording || recordedVideoUrl ? (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted={isRecording}
                            controls={!isRecording}
                            className="w-[60%] border"
                            src={recordedVideoUrl || undefined}
                        />
                        {isRecording ? (
                            <button className="button_active" onClick={stopRecording}>Stop Recording</button>
                        ) : null}
                    </>
                ) : (
                    <button className="p-6 rounded-full bg-red-500 smooth hover:scale-110 animate-pulse "
                        onClick={startRecording} />
                )}
            </div>
            {publicVideoURL && <button className="button_active"
                onClick={() => setStep(3)} >Next</button>}
        </div>
    )
}
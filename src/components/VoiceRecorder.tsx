
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, X, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onRecordComplete: (audioBlob: Blob) => void;
  onRecordStart?: () => void;
  onSend?: (audioBlob: Blob) => void;
  onCancel?: () => void;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordComplete, 
  onRecordStart, 
  onSend, 
  onCancel, 
  className 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      if (onRecordStart) onRecordStart();
      
      // Start timer
      startTimer();
      
      toast({
        title: "Recording started",
        description: "Speak now...",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone",
        variant: "destructive"
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        toast({
          title: "Recording resumed",
        });
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        toast({
          title: "Recording paused",
        });
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Recording completed",
        description: `${formatTime(duration)} recorded`,
      });
      
      // Small timeout to ensure ondataavailable has processed
      setTimeout(() => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          onRecordComplete(audioBlob);
        }
      }, 300);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    setAudioUrl(null);
    setAudioBlob(null);
    stopTimer();
    
    toast({
      title: "Recording cancelled",
    });
    
    if (onCancel) onCancel();
  };

  const sendAudio = () => {
    if (audioBlob) {
      // Use onSend if provided, otherwise use onRecordComplete as fallback
      if (onSend) {
        onSend(audioBlob);
      } else {
        onRecordComplete(audioBlob);
      }
      
      toast({
        title: "Voice message sent",
      });
      
      setIsRecording(false);
      setIsPaused(false);
      setDuration(0);
      setAudioUrl(null);
      setAudioBlob(null);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      stopTimer();
      
      // Clean up URLs to avoid memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className={cn("flex items-center gap-2 p-2 bg-muted/30 rounded-lg", className)}>
      {isRecording || audioUrl ? (
        <>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={cancelRecording}
          >
            <X className="h-5 w-5" />
          </Button>
          
          {isRecording ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={pauseRecording}
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isPaused ? 'Resume' : 'Pause'}</TooltipContent>
            </Tooltip>
          ) : (
            audioUrl && (
              <audio controls src={audioUrl} className="h-8 max-w-[200px]" />
            )
          )}
          
          <div className="flex-1 flex items-center gap-2">
            <div className="text-sm font-mono text-muted-foreground">
              {formatTime(duration)}
            </div>
            {isRecording && (
              <Progress value={Math.min(100, (duration / 300) * 100)} className="h-1" />
            )}
          </div>
          
          <Button
            size="icon"
            variant="default"
            className="rounded-full"
            onClick={isRecording ? stopRecording : sendAudio}
          >
            <Send className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary hover:text-primary/90 hover:bg-primary/10"
              onClick={startRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Record voice message</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default VoiceRecorder;

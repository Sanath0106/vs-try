"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PermissionsDialogProps {
  isOpen: boolean;
  onPermissionsGranted: () => void;
  onClose: () => void;
}

export function PermissionsDialog({ isOpen, onPermissionsGranted, onClose }: PermissionsDialogProps) {
  const [permissionStatus, setPermissionStatus] = useState<{
    video: boolean | null;
    audio: boolean | null;
  }>({ video: null, audio: null });

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus({ video: true, audio: true });
      onPermissionsGranted();
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setPermissionStatus({ video: false, audio: false });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/50">
        <div className="p-6">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl">Camera & Microphone Access</DialogTitle>
            <DialogDescription className="text-base">
              We need access to your camera and microphone to provide the best interview experience.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                  <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 8.5C15.5 7.11929 14.3807 6 13 6H4C2.61929 6 1.5 7.11929 1.5 8.5V15.5C1.5 16.8807 2.61929 18 4 18H13C14.3807 18 15.5 16.8807 15.5 15.5V8.5Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M15.5 10.7563L19.1415 8.43126C19.5639 8.15679 20.1274 8.21858 20.4816 8.57284C20.8195 8.91054 21 9.37909 21 9.86866V14.1313C21 14.6209 20.8195 15.0895 20.4816 15.4272C20.1274 15.7814 19.5639 15.8432 19.1415 15.5687L15.5 13.2437" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-lg">Camera Access</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Required for video interview
                  </p>
                </div>
                {permissionStatus.video === false && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                  <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17V11M12 17C9.23858 17 7 14.7614 7 12V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V12C17 14.7614 14.7614 17 12 17ZM7 12H17M12 17V21M9 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-lg">Microphone Access</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Required for audio recording
                  </p>
                </div>
                {permissionStatus.audio === false && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </motion.div>
            </div>

            <AnimatePresence>
              {(permissionStatus.video === false || permissionStatus.audio === false) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50"
                >
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Camera and microphone access are required for the interview. Please enable them to continue.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="pt-4 flex justify-end gap-2">
            <Button 
              onClick={requestPermissions}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 min-w-[120px]"
            >
              Allow Access
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 